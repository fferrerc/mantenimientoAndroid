/* global store*/

sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/FileHandler",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"jquery.sap.storage"
], function (BaseController,
	JSONModel,
	models,
	StringUtils,
	ObjectUtils,
	FileHandler,
	MessageToast,
	UploadCollectionParameter,
	Filter,
	FilterOperator,
	jQuery) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.Visit", {

		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("Visit").attachMatched(this._onRouteMatched, this);

			this._modifyDateFieldBehaviour();
			this._modifyContactFieldBehaviour();

		},

		_modifyDateFieldBehaviour: function () {
			var oDatePicker = this.getView().byId("dateField");
			oDatePicker.setProperty("maxDate", new Date());
			oDatePicker._bMobile = true;
			var fnOnClick = function (oEvent) {
				oDatePicker.toggleOpen(oDatePicker.isOpen());
			}.bind(this);
			oDatePicker.attachBrowserEvent("click", fnOnClick);
		},

		_modifyContactFieldBehaviour: function () {
			var oContactInput = this.getView().byId("contactInput");
			var fnOnClick = function (oEvent) {
				this.onOpenContactList();
			}.bind(this);
			oContactInput.attachBrowserEvent("click", fnOnClick);
		},

		_onRouteMatched: function (oEvent) {
			var oVisitHeadContext = this._getState("/oVisitHeadContext"),
				oVisitDetailContext = this._getState("/oVisitDetailContext");

			if (typeof oVisitHeadContext === "undefined" || typeof oVisitDetailContext === "undefined") {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("WorkOrderList");
			}

			this._setNativeBackBehaviour(this.onCancelVisitDetail, this);

			// Bind page
			this._bindPage(oVisitHeadContext);

			if (this._comesFrom("Sync")) {
				var oError = this._getState("/oSelectedCause");
				this._setState("/bMessageStrip", true);
				this._setState("/sMessageStripContent", oError.error.message.value);
			} else {
				this._setState("/bMessageStrip", false);
				this._setState("/sMessageStripContent", "");
			}
			// Bind view 
			this._bindVisitDetail(oVisitDetailContext);
			// Bind Recipient control
			this._bindRecipient(oVisitHeadContext);

		},

		_bindPage: function (oVisitHeadContext) {
			var oVisitPage = this.getView().byId("visitPage");
			oVisitPage.setBindingContext(oVisitHeadContext, "WorkOrderModel");
		},

		_bindRecipient: function (oVisitHeadContext) {
			var oInput = this.getView().byId("recipientInput");
			oInput.setBindingContext(oVisitHeadContext, "WorkOrderModel");
		},

		_bindContact: function (oVisitDetailContext) {
			var oVisitDetail = oVisitDetailContext.getObject(),
				oInput = this.getView().byId("contactInput"),
				oModel = this.getModel("WorkOrderModel"),
				sContactPath = "",
				oContactContext = {};

			var oTemporalContact = this._getState("/oTemporalVisitContact");
			if (oTemporalContact) {
				sContactPath = ObjectUtils.getPath(oTemporalContact, oModel);
				oContactContext = new sap.ui.model.Context(this.getModel("WorkOrderModel"), sContactPath);
				oInput.setBindingContext(oContactContext, "WorkOrderModel");
				oModel.refresh();
			} else {
				var fnSuccess = function (oContact) {
					if (oContact) {
						sContactPath = ObjectUtils.getPath(oContact, oModel);
						oContactContext = new sap.ui.model.Context(this.getModel("WorkOrderModel"), sContactPath);
						oInput.setBindingContext(oContactContext, "WorkOrderModel");
						oModel.refresh();
					} else {
						oInput.setBindingContext(null, "WorkOrderModel");
						oModel.refresh();
					}
				}.bind(this);

				var fnError = function () {
					oInput.setBindingContext(null, "WorkOrderModel");
					oModel.refresh();
				}.bind(this);

				models.getContact(oVisitDetail, fnSuccess, fnError);
			}

		},

		_bindVisitDetail: function (oVisitDetailContext) {

			this._setState("/bVisitEditableMode", true);
			this._setState("/bVisitSwitchesEditableMode", true);
			this._setState("/bVisitResultComboEditableMode", true);
			this._setState("/bVisitDatepickerValueState", "None");
			this._setState("/bVisitResultComboBoxValueState", "None");

			this._bindView(oVisitDetailContext);
			this._bindContact(oVisitDetailContext);
			this.onChangeObservation();

		},

		_bindView: function (oVisitDetailContext) {
			this.getView().byId("visitGrid").unbindElement();
			this.getView().byId("visitGrid").setBindingContext(oVisitDetailContext, "WorkOrderModel");
		},

		onOpenContactList: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				oVisitDetailContext = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel"),
				oVisitDetail = oVisitDetailContext.getObject();

			oRouter.navTo("ContactList", {
				RecipientId: oVisitDetail.RecipientId,
				RecipientType: oVisitDetail.RecipientType,
				RecipientOffice: oVisitDetail.RecipientOffice
			});
		},

		onOpenFileUploader: function () {
			var oVisitDetailContext = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel");
			this._openDialog("fileUploaderDialog", "FileUploader", oVisitDetailContext, "WorkOrderModel");
		},

		onSelectChange: function (oEvent) {
			var oUploadCollection = this.byId("UploadCollection");
			oUploadCollection.setShowSeparators(oEvent.getParameters().selectedItem.getProperty("key"));
		},

		onChange: function (oEvent) {
			var oUploadCollection = oEvent.getSource();
			this.getModel("WorkOrderModel").refreshSecurityToken(null, null, false);
			var sToken = this.getModel("WorkOrderModel").getSecurityToken();

			var fnGetTokenSuccess = function (sNewToken) {
				var oCustomerHeaderToken = new UploadCollectionParameter({
					name: "x-csrf-token",
					value: sNewToken
				});
				oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			}.bind(this);

			var fnGetTokenFailed = function (oError) {
				jQuery.sap.log.warning("Get token failed:" + JSON.stringify(oError));
			}.bind(this);

			if (!sToken) {
				var sUrl = "TGN_MANT";
				models.getCsrfToken(sUrl, fnGetTokenSuccess, fnGetTokenFailed);
			} else {
				fnGetTokenSuccess(sToken);
			}
		},

		onTypeMissmatch: function (oEvent) {
			MessageToast.show("Event typeMissmatch triggered");
		},

		onChangeObservation: function (oEvent) {
			var oVisitDetailContext = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel");
			var oVisitDetail = {};
			if (this.getView().byId("observationCombo").getSelectedKey() === "0") {
				oVisitDetail = {
					ObservationId: parseInt(this.getView().byId("observationCombo").getSelectedKey(), 10)
				};

				models.updateVisitDetail(oVisitDetail, oVisitDetailContext);
				// Setea el modelo de los enabled de switches y del combo de resultado en false
				this._setState("/bVisitResultComboEditableMode", true);
				this._setState("/bVisitSwitchesEditableMode", true);

			} else {
				// Setea los valores cuando la observacion esta "Vacio"
				oVisitDetail = {
					Material: false,
					Blueprint: false,
					Signature: false,
					Note: false,
					ResultId: "N/C",
					ObservationId: parseInt(this.getView().byId("observationCombo").getSelectedKey(), 10)
				};

				models.updateVisitDetail(oVisitDetail, oVisitDetailContext);
				//TODO Fix bug updating the model has no impact on the control.
				this.getView().byId("resultCombo").setSelectedKey("N/C");
				// Setea el modelo de los enabled de switches y del combo de resultado en false
				this._setState("/bVisitResultComboEditableMode", false);
				this._setState("/bVisitSwitchesEditableMode", false);

			}
		},

		onStartUpload: function (oEvent) {
			var oUploadCollection = this.byId("UploadCollection"),
				oUcItems = this.byId("UploadCollection").getItems(),
				files = FileHandler.getFiles(oUcItems),
				oVisitDetail = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel").getObject();
			//Get data from offline Storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oUserAttributes = oStorage.get("UserAttributes");
			var oAttachmentTypeSelect = this.byId("AttachmentTypeSelect");
			var sSelectedType = oAttachmentTypeSelect.getSelectedItem().getBindingContext("WorkOrderModel").getObject().Value;

			if (files.length > 0 && sSelectedType.length > 0) {
				if (typeof sap.hybrid === 'undefined') { // Web
					oUploadCollection.upload();
				} else if (store) { // Mobile and offline
					var fnSuccess = function (oResult) {
						jQuery.sap.log.info(oResult.aSuccessResponses);
						this.getView().setBusy(false);
						this._closeDialog("fileUploaderDialog");
					}.bind(this);
					var fnError = function (aErrorResponses) {
						jQuery.sap.log.error(aErrorResponses);
						this.getView().setBusy(false);
						this._showMessageToast(this._getResourceBundleErrorMessage("attachments.unexpectedError"));
					}.bind(this);

					var aAttachmentParamenters = FileHandler.getAttachmentParameters(oVisitDetail, oAttachmentTypeSelect, oUserAttributes),
						oVisitDetailContext = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel"),
						sParentNavPropertyPath = oVisitDetailContext.getPath() + "/ToAttachments";
					this.getView().setBusy(true);
					FileHandler.saveOfflineFileCollection(sParentNavPropertyPath, aAttachmentParamenters, files, fnSuccess, fnError);
				}
			} else if (files.length === 0) {
				this._showMessageToast(this._getResourceBundleErrorMessage("attachments.errorAtLeastOneAttachment"));
			} else if (sSelectedType.length === 0) {
				this._showMessageToast(this._getResourceBundleErrorMessage("attachments.errorAtLeastOneAttachmentType"));
			} else {
				this._showMessageToast(this._getResourceBundleErrorMessage("attachments.unexpectedError"));
			}
		},

		onDeleteAttachment: function (oEvent) {
			var oUploadCollectionItem = oEvent.getSource();
			var oAttachmentContext = oUploadCollectionItem.getBindingContext("WorkOrderModel");
			var fnSuccess = function (sResponse) {
				jQuery.sap.log.info(sResponse);
			}.bind(this);

			var fnError = function (sResponse) {
				jQuery.sap.log.error(sResponse);
			}.bind(this);

			FileHandler.deleteAttachment(oAttachmentContext.getPath(), fnSuccess, fnError);
		},

		onBeforeUploadStarts: function (oEvent) {
			//Get data from offline Storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oUserAttributes = oStorage.get("UserAttributes");
			var oVisitDetail = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel").getObject();
			var oAttachmentTypeSelect = this.byId("AttachmentTypeSelect");

			var aAttachmentParamenters = FileHandler.getAttachmentParameters(oVisitDetail, oAttachmentTypeSelect, oUserAttributes);

			for (var i = 0; i < aAttachmentParamenters.length; i++) {
				var oAttachmentParameter = aAttachmentParamenters[i];
				oEvent.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter(oAttachmentParameter));
			}

			oEvent.getParameters().addHeaderParameter(new sap.m.UploadCollectionParameter({
				name: "FileName",
				value: oEvent.getParameter("fileName")
			}));

		},

		onUploadComplete: function (oEvent) {
			var sUploadedFileName = oEvent.getParameter("files")[0].fileName;
			var oUploadCollection = this.byId("UploadCollection");
			var oWorkOrderModel = this.getView().getModel("WorkOrderModel");
			var oVisitDetail = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel").getObject();
			//Get data from offline Storage
			var oStorage = jQuery.sap.storage(jQuery.sap.storage.Type.local);
			var oUserAttributes = oStorage.get("UserAttributes");

			var fnSuccess = function () {
				oWorkOrderModel.refresh(true);
				//this._closeDialog("fileUploaderDialog");
			}.bind(this);

			var fnError = function () {
				jQuery.sap.log.error("UpdateMetadata failed");
			}.bind(this);
			FileHandler.updateMetadata(sUploadedFileName, oUploadCollection, oWorkOrderModel, oVisitDetail, oUserAttributes, fnSuccess, fnError);

			oWorkOrderModel.refresh(true);
			this._closeDialog("fileUploaderDialog");
		},

		onCloseFileUploaderDialog: function () {
			this._closeDialog("fileUploaderDialog");
		},

		onSaveVisitDetail: function () {
			var oModel = this.getModel("WorkOrderModel"),
				mProperties = {},
				oVisitDetailContext = this.getView().byId("visitGrid").getBindingContext("WorkOrderModel"),
				oVisitDetail = oVisitDetailContext.getObject(),
				oVisitHeadContext = this.getView().byId("visitPage").getBindingContext("WorkOrderModel"),
				oVisitHead = oVisitHeadContext.getObject();
			if (!this._performValidations()) {
				return;
			}
			
			oModel.setProperty(oVisitHeadContext.getPath() + "/RealizationDate", oVisitDetail.RealizationDate);

			mProperties = {
				groupId: "VisitHeadGroup",
				eTag: "*"
			};
			//if (oVisitHead.__metadata.etag) mProperties.eTag = oVisitHead.__metadata.etag;
			oModel.submitChanges(mProperties);
			
			// BugFix: ObservationId should be int
			oModel.setProperty(oVisitDetailContext.getPath() + "/ObservationId", parseInt(oVisitDetail.ObservationId, 10));

			mProperties = {
				groupId: "VisitDetailGroup",
				eTag: "*"
			};
			//if (oVisitDetail.__metadata.etag) mProperties.eTag = oVisitDetail.__metadata.etag;

			oModel.submitChanges(mProperties);
			

			/* TODO remove start*/
			this._setState("/oVisitHeadContext", null);
			this._setState("/oVisitDetailContext", null);
			this._setState("/oSelectedContactContext", null);
			this._setState("/oTemporalVisitContact", null);
			oModel.refresh(true, false, "VisitDetailGroup");
			this._onNavBack();
			/* TODO remove end*/

		},

		_performValidations: function () {
			var bValid = true;

			var oDatePicker = this.getView().byId("dateField"),
				oResultCombo = this.getView().byId("resultCombo");

			if (!this._validateRequiredDatepicker(oDatePicker)) {
				MessageToast.show(this._getResourceBundleMessage("vd.emptyDatePicker"));
				this._setState("/bVisitDatepickerValueState", "Error");
				bValid = false;
			} else {
				this._setState("/bVisitDatepickerValueState", "None");
			}
			if (!this._validateRequiredCombos([oResultCombo])) {
				MessageToast.show(this._getResourceBundleMessage("vd.emptyCombos"));
				this._setState("/bVisitResultComboBoxValueState", "Error");
				bValid = false;
			} else {
				this._setState("/bVisitResultComboBoxValueState", "None");
			}

			return bValid;
		},

		_validateRequiredCombos: function (aCombos) {
			var bValid = true;
			for (var i = 0; i < aCombos.length; i++) {
				var oCombo = aCombos[i];
				if (!oCombo.getSelectedItem()) {
					bValid = false;
				}
			}
			return bValid;
		},

		_validateRequiredDatepicker: function (oDatePicker) {
			return oDatePicker.getValue() !== "";
		},

		_updateSwitch: function (sSwitchId, sVisitDetailPath, sVisitProperty) {
			var oSwitch = this.getView().byId(sSwitchId);
			var bSelectedResult = oSwitch.getBindingContext("WorkOrderModel").getProperty(sVisitProperty.replace(/^\/+/g, ''));
			var oModel = this.getModel("WorkOrderModel");
			oModel.setProperty(sVisitDetailPath + sVisitProperty, bSelectedResult);
		},

		onCancelVisitDetail: function () {
			this._rollBackChanges();
			this._onNavBack();
		},

		_rollBackChanges: function () {
			var oModel = this.getModel("WorkOrderModel");
			if (oModel.hasPendingChanges()) {
				oModel.resetChanges();
			}

			this._setState("/oVisitHeadContext", null);
			this._setState("/oVisitDetailContext", null);
			this._setState("/oSelectedContactContext", null);
			this._setState("/oTemporalVisitContact", null);
		},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.Visit
		 */
		onExit: function () {
			this.getView().setBindingContext(null, "WorkOrderModel");
		}
	});
});