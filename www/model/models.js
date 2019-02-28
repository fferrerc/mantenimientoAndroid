/* global OData,Set*/
sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"ABMcontactos/TGN-ABMcontactos/Utils/Network",
	"ABMcontactos/TGN-ABMcontactos/Utils/OperatorUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"sap/m/MessageToast",
	"jquery.sap.storage",
	"sap/base/util/array/uniqueSort"
], function (JSONModel, Device, Filter, FilterOperator, Network, OperatorUtils, ObjectUtils, MessageToast,
	jQuery, uniqueSort) {
	"use strict";

	var localModels = {};

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createAttachmentsModel: function () {
			var oModel = new JSONModel();
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		suscribeModel: function (oModel, sModelName) {
			localModels[sModelName] = oModel;
		},

		setModelGroupIds: function () {
			var oModel = localModels["WorkOrderModel"];
			oModel.setDeferredGroups(["VisitHeadGroup", "VisitDetailGroup", "ContactGroup"]);
			oModel.setChangeGroups({
				"VisitHead": {
					groupId: "VisitHeadGroup",
					single: true
				},
				"VisitDetail": {
					groupId: "VisitDetailGroup",
					single: true
				},
				"Contact": {
					groupId: "ContactGroup",
					single: true
				}
			});
		},

		getModel: function (sModelName) {
			return localModels[sModelName];
		},

		loadStatesModel: function () {
			localModels["States"] = new JSONModel("/model/mStates.json");
			return localModels["States"];
		},

		setState: function (sUIParameter, value) {
			localModels["States"].setProperty(sUIParameter, value);
		},

		getState: function (sUIParameter) {
			return localModels["States"].getProperty(sUIParameter);
		},

		saveOfflineUserAttributes: function () {
			var oUserAttributes = this.getProperty("/");
			//Get Storage object to use
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			//Clear Storage
			oStorage.clear();
			//Set data into Storage
			oStorage.put("UserAttributes", oUserAttributes);

		},

		setSectionsModel: function () {
			var oWorkOrderModel = localModels["WorkOrderModel"];
			this.uniqueSort = uniqueSort;

			var fnSuccess = function (oData, oResponse) {
				var aWorkOrders = oData.results;
				var aWOIds = OperatorUtils.spreadify(new Set(aWorkOrders.map(function (wo) {
					return wo.Id;
				})));

				var fnOnVisitHeadLoaded = function (oData, oResponse) {
					this.updateWOStatus();
				}.bind(this);

				var oWOFilter = this.getFilter("WOId", aWOIds, false);
				this.loadEntity("/VisitHeadSet", oWOFilter, null);
				this.loadEntity("/VisitDetailSet", oWOFilter, fnOnVisitHeadLoaded);

				this.loadEntity("/AttachmentSet", {}, null);
				//TODO not implemented in the backend.
				//this.loadEntity("/AttachmentSet", oWOFilter, null);

				//Implemented 'Set' polyfill in polyfill folder.
				var aUniqueSections = OperatorUtils.spreadify(new Set(aWorkOrders.map(function (wo) {
					return wo.Section;
				})));
				this.setState("/aSections", aUniqueSections);

				var oSectionFilter = this.getFilter("Section", aUniqueSections, false);

				this.loadEntity("/RecipientSet", oSectionFilter, null);
				this.loadEntity("/ContactSet", oSectionFilter, null);

				var fnWorkOrderSetSuccess = function (oWorkOrders, oResponse) {
					jQuery.sap.log.info(JSON.stringify(oResponse));
				}.bind(this);

				var fnWorkOrderSetError = function (oError) {
					jQuery.sap.log.error(oError);
				}.bind(this);
				var urlParameters = {
					"$skip": 0,
					"$top": 100,
					"$expand": "ToVisits"
				};

				var mParameters = {
					urlParameters: urlParameters,
					success: fnWorkOrderSetSuccess,
					error: fnWorkOrderSetError
				};
				oWorkOrderModel.read("/WorkOrderSet", mParameters);
			}.bind(this);

			var fnError = function (oError) {
				jQuery.sap.log.error(oError);
			}.bind(this);

			var mParameters = {
				success: fnSuccess,
				error: fnError
			};
			oWorkOrderModel.read("/WorkOrderSet", mParameters);

		},

		setVisitsData: function () {
			var oWorkOrderModel = localModels["WorkOrderModel"];
			var aWOIds = localModels["WOIdsModel"].getData();

			var aFilters = aWOIds.map(function (iWOId) {
				return new Filter("WOId", FilterOperator.EQ, iWOId);
			});

			var oFilters = new Filter({
				filters: aFilters,
				and: false
			});

			var fnSuccess = function (oData, oResponse) {
				jQuery.sap.log.info(JSON.stringify(oResponse));
			}.bind(this);

			var fnError = function (oError) {
				jQuery.sap.log.error(oError);
			}.bind(this);

			var mParameters = {
				filters: [oFilters],
				success: fnSuccess,
				error: fnError
			};

			oWorkOrderModel.read("/VisitHeadSet", mParameters);
		},

		getSections: function () {
			return localModels["SectionsModel"].getData();
		},

		getFilter: function (sProperty, aFilterValue, bAnd) {
			var aFilters = aFilterValue.map(function (sSection) {
				return new Filter(sProperty, FilterOperator.EQ, sSection);
			});
			var oFilters = new Filter({
				filters: aFilters,
				and: bAnd
			});
			return oFilters;
		},

		getCompositeFilter: function (mConditions) {
			var aFilters = [];
			for (var key in mConditions) {
				var value = mConditions[key];
				var oFilter = this.getFilter(key, [value], false);
				aFilters.push(oFilter);
			}
			var oFilters = new Filter({
				filters: aFilters,
				and: true
			});
			return oFilters;

		},

		loadEntity: function (sEntityPath, oFilters, fnSuccess) {
			var oWorkOrderModel = localModels["WorkOrderModel"];

			fnSuccess = fnSuccess || function (oData, oResponse) {
				jQuery.sap.log.info(JSON.stringify(oResponse));
			}.bind(this);

			var fnError = function (oError) {
				jQuery.sap.log.info(JSON.stringify(oError));
			}.bind(this);

			var mParameters;

			if (!Object.keys(oFilters).length) {
				mParameters = {
					success: fnSuccess,
					error: fnError
				};
			} else {
				mParameters = {
					filters: [oFilters],
					success: fnSuccess,
					error: fnError
				};
			}

			oWorkOrderModel.read(sEntityPath, mParameters);
		},
		updateWOStatus: function () {
			Network.isOnline(null, function () {
				var oWorkOrderModel = this.getModel("WorkOrderModel");
				var oWorkOrders = this._getEntitySet("ZGW_APPROVE_MNT_SRV.WorkOrder");
				var oVisitHeads = this._getEntitySet("ZGW_APPROVE_MNT_SRV.VisitHead");

				if (Object.keys(oWorkOrders).length > 0 && Object.keys(oVisitHeads).length > 0) {
					for (var woKey in oWorkOrders) {
						var wo = oWorkOrders[woKey];
						var iStatus = 0;
						var iWORealizedVisits = 0;
						var iWOVisits = 0;
						for (var vhKey in oVisitHeads) {
							var vh = oVisitHeads[vhKey];
							if (wo.Id === vh.WOId) {
								if (vh.RealizationDate !== null) {
									iWORealizedVisits++;
								}
								iWOVisits++;
							}
						}
						/*
						Estado Semáforo
                        0 Gris (indica que un no se cargaron datos)
                        1 Rojo (Se cargaron datos pero no esta totalmente completa la planilla)
                        2 Amarillo (todos los datos de la planilla están completos pero la OT aun no fue cerrada)
                        */

						//Not Started: Grey
						if (iWORealizedVisits === 0) {
							iStatus = 0;
							//Visits Pending: Red
						} else if (iWORealizedVisits > 0 && iWORealizedVisits < iWOVisits) {
							iStatus = 1;
							//Completed but still in phone: Yellow
						} else if (iWORealizedVisits === iWOVisits) {
							iStatus = 2;
						}
						oWorkOrderModel.setProperty(woKey + "/Status", iStatus);
					}
				}
			}.bind(this));

		},

		_getEntitySet: function (sMetadataType) {
			var oWorkOrderModel = this.getModel("WorkOrderModel");
			var oEntitySetData = {};

			var oData = oWorkOrderModel.getProperty("/");
			for (var key in oData) {
				if (oData.hasOwnProperty(key)) {
					if (oData[key].__metadata.type === sMetadataType) {
						oEntitySetData["/" + key] = oData[key];
					}
				}
			}
			return oEntitySetData;
		},
		getVisitHeadDefaults: function (oVisitHeadKeys) {
			var oNewVisitHead = {
				WOId: oVisitHeadKeys.WOId,
				RecipientId: oVisitHeadKeys.RecipientId,
				RealizationDate: null,
				RecipientType: oVisitHeadKeys.RecipientType,
				RecipientCompany: oVisitHeadKeys.RecipientCompany,
				RecipientOffice: oVisitHeadKeys.RecipientOffice,
				VisitType: 3
					//ToVisitDetail: {}
			};
			return oNewVisitHead;
		},
		getVisitDetailDefaults: function (oVisitHead) {
			var oVisitDetail = {
				WOId: oVisitHead.WOId,
				Material: false,
				Blueprint: false,
				Signature: false,
				Note: false,
				Comment: "",
				ObservationId: 0,
				ResultId: "",
				RecipientId: oVisitHead.RecipientId,
				RecipientType: oVisitHead.RecipientType,
				RecipientOffice: oVisitHead.RecipientOffice,
				RealizationDate: new Date()
			};
			return oVisitDetail;
		},

		updateVisitHead: function (oVisitHead, oVisitHeadContext) {
			var oModel = this.getModel("WorkOrderModel");
			for (var property in oVisitHead) {
				oModel.setProperty(oVisitHeadContext.getPath() + "/" + property, oVisitHead[property]);
			}
			var mProperties = {
				groupId: "VisitHeadGroup",
				changeSetId: "WOId"
			};
			if(oVisitHead.__metadata.etag) mProperties.eTag = oVisitHead.__metadata.etag;
			oModel.submitChanges(mProperties);
		},

		updateVisitDetail: function (oVisitDetail, oVisitDetailContext) {
			var oModel = this.getModel("WorkOrderModel");
			for (var property in oVisitDetail) {
				oModel.setProperty(oVisitDetailContext.getPath() + "/" + property, oVisitDetail[property]);
			}
		},

		createVisitHead: function (oArgs, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");
			// create default visithead properties
			var oVisitHead = this.getVisitHeadDefaults(oArgs);

			var mParameters = {
				success: fnSuccess,
				error: fnError,
				groupId: "VisitHeadGroup",
				changeSetId: "WOId",
				refreshAfterChange: true
			};
			oModel.create("/VisitHeadSet", oVisitHead, mParameters);

			oModel.submitChanges({
				groupId: "VisitHeadGroup"
			});
		},

		createVisitDetail: function (oVisitHeadContext, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");
			var oVisitHead = oVisitHeadContext.getObject();
			// create default visitdetail properties
			var oVisitDetail = this.getVisitDetailDefaults(oVisitHead);
			var sPath = "/VisitDetailSet";

			// create new entry in the model
			oModel.create(sPath, oVisitDetail, {
				success: fnSuccess,
				error: fnError,
				groupId: "VisitHeadGroup",
				refreshAfterChange: true
			});
			
			oModel.submitChanges({
				groupId: "VisitHeadGroup"
			});
		},

		deleteVisitDetail: function (oVisitDetailContext, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");
			// create new entry in the model
			oModel.delete(oVisitDetailContext.getPath(), {
				success: fnSuccess,
				error: fnError,
				refreshAfterChange: true
			});
		},
		// Esto crea contact validado en la base de datos local.
		onCreateNewContact: function (oNewContact, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel"),
				sPath = "/ContactSet";
				
			// Remove null values
			ObjectUtils.removeNullValues(oNewContact);
			// Remove navigation properties
			oNewContact = ObjectUtils.removeDefNavigationProperties(oNewContact);

			var mParameters = {
				success: fnSuccess,
				error: fnError,
				groupId: "ContactGroup",
				refreshAfterChange: true
			};
			
			oModel.create(sPath, oNewContact, mParameters);
			
			oModel.submitChanges({
				groupId: "ContactGroup"
			});
		},

		selectVisitsContact: function (oContact) {
			var oSelectedVisitContext = this.getState("/oVisitDetailContext");
			var oModel = this.getModel("WorkOrderModel");

			var oVisitDetail = oSelectedVisitContext.getObject();
			// Save a reference to the contact to bind until save.
			this.setState("/oTemporalVisitContact", oContact);
			// Replace the reference with the new contact.
			var oVD = {};
			oVD.ToContact = {
				__metadata: {
					uri: oContact.__metadata.uri
				}
			};

			oVD.ContactId = oContact.Id;
			oVD.WOId = oVisitDetail.WOId;
			
			var fnSuccess = function () {
				MessageToast.show("El contacto fue seleccionado.");
			}.bind(this);

			var fnError = function () {
				MessageToast.show("El contacto no pudo ser seleccionado.");
			}.bind(this);

			var mProperties = {
				success: fnSuccess,
				error: fnError,
				groupId: "VisitDetailGroup",
				refreshAfterChange: true,
				eTag: "*"
			};
			if(oVisitDetail.__metadata.etag) mProperties.eTag = oVisitDetail.__metadata.etag;
			
			oModel.update(oSelectedVisitContext.getPath(), oVD, mProperties);

		},
		createNewRecipient: function (oNewRecipient) {
			var oModel = this.getModel("WorkOrderModel"),
				sPath = "/RecipientSet";

			// create new entry in the model
			var oRecipientContext = oModel.createEntry(sPath, {
				properties: oNewRecipient
			});

			return oRecipientContext;
		},

		getVisitDetail: function (oVisitHeadContext, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");
			var oVisitHead = oVisitHeadContext.getObject();

			var mConditions = {
				RecipientId: oVisitHead.RecipientId,
				RecipientType: oVisitHead.RecipientType,
				RecipientOffice: oVisitHead.RecipientOffice,
				WOId: oVisitHead.WOId
			};

			var oFilters = this.getCompositeFilter(mConditions);

			var mParameters = {
				success: fnSuccess,
				error: fnError,
				filters: [oFilters]
			};

			oModel.read("/VisitDetailSet", mParameters);
		},

		getContact: function (oVisitDetail, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");
			var sVisitDetailPath = ObjectUtils.getPath(oVisitDetail, oModel);

			var mParameters = {
				success: fnSuccess,
				error: fnError
			};

			oModel.read(sVisitDetailPath + "/ToContact", mParameters);
		},

		getCsrfToken: function (sUrl, fnSuccess, fnError) {
			var request = {
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/xml',
					'Accept-Charset': 'utf-8',
					'Accept-Encoding': 'gzip, deflate',
					'X-CSRF-Token': 'Fetch'
				},
				requestUri: sUrl,
				method: "GET"
			};

			OData.request(request, function (data, oSuccess) {
				fnSuccess(oSuccess.headers['x-csrf-token']);
			}, function (oError) {
				fnError(oError);
			});
		},

		setOnlineMode: function () {
			var fnIsOnline = function () {
				this.setState("/bIsOnline", true);
				if (typeof sap.hybrid !== 'undefined' && sap.hybrid.isOnline()) {
					//sap.hybrid.flushStore();
				} else {
					this._showMessageInfo("No se puede transmitir en modo offline");
				}
			}.bind(this);

			var fnIsOffline = function () {
				this.setState("/bIsOnline", false);
			}.bind(this);

			Network.isOnline(fnIsOnline, fnIsOffline);

			// Update the online status icon based on connectivity
			//window.addEventListener('online', fnIsOnline);
			//window.addEventListener('offline', fnIsOffline);

		},

		updateCreatedAttachmentProperties: function (oCreatedAttachment, aAttachmentParamenters, fnSuccess, fnError) {
			var oModel = this.getModel("WorkOrderModel");

			// Update oCreatedAttachment with aAttachmentParameter Values.
			for (var j = 0; j < aAttachmentParamenters.length; j++) {
				var oParam = aAttachmentParamenters[j];
				if (oCreatedAttachment.hasOwnProperty(oParam.name) && oParam.value !== null) oCreatedAttachment[oParam.name] = oParam.value;
			}

			// Remove null values
			ObjectUtils.removeNullValues(oCreatedAttachment);

			// Update extension
			oCreatedAttachment.Extension = oCreatedAttachment.__metadata.content_type;

			// Remove Key values since they can't be updated
			oCreatedAttachment = ObjectUtils.removeKeyValues(oModel, "Attachment", oCreatedAttachment);

			var fnUpdateSuccess = function (oData, oResponse) {
				oResponse.mleStatus = oResponse.statusCode;
				oResponse.mleMessage = "Media metadata updated." + " Etag: " + oResponse.headers.etag;
				oResponse.mleUri = oResponse.requestUri;
				fnSuccess(oResponse);

			}.bind(this);

			var fnUpdateError = function (oError) {
				oError.mleStatus = oError.statusCode;
				oError.mleMessage = "Request failed! Status: " + oError.statusCode;
				fnError(oError);
			}.bind(this);

			var mParameters = {
				success: fnUpdateSuccess,
				error: fnUpdateError
			};
			var sDestination = oModel.sServiceUrl.replace(/^\/+/g, '');
			var sPath = oCreatedAttachment.__metadata.uri.substring(oCreatedAttachment.__metadata.uri.indexOf(sDestination) + sDestination.length,
				oCreatedAttachment.__metadata.uri.length);
			oModel.update(sPath, oCreatedAttachment, mParameters);
		}

	};
});