sap.ui.define([
		"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
		"sap/base/util/uid",
		"ABMcontactos/TGN-ABMcontactos/model/models",
		'sap/ui/model/Sorter',
		'sap/ui/model/Filter',
		'sap/ui/Device',
		"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
		"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils"
	],
	function (BaseController, uid, models, Sorter, Filter, Device, ObjectUtils, StringUtils) {
		"use strict";
		return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.RecipientsList", {

			onInit: function () {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("RecipientList").attachPatternMatched(this._onRouteMatched, this);

			},
			_onRouteMatched: function (oEvent) {
				var aSections = this._getState("/aSections") || [],
					oSectionFilter = models.getFilter("Section", aSections, false),
					aFilters = oSectionFilter.aFilters,
					oRecipientTable = this.getView().byId("destTable"),
					sFilterString = "",
					oRecipientsModel;

				aFilters.forEach(function (item, index) {
					if (index === 0) {
						sFilterString += item.sPath + " eq '" + item.oValue1 + "'";
					} else {
						sFilterString += " or " + item.sPath + " eq '" + item.oValue1 + "'";
					}
				});

				oRecipientsModel = new sap.ui.model.odata.v2.ODataModel({
					serviceUrl: "/TGN_MANT/",
					serviceUrlParams: {
						$filter: sFilterString
					},
					useBatch: false
				});

				oRecipientTable.setModel(oRecipientsModel, "RecipientsModel");

				this._setNativeBackBehaviour(this.onCancelNewVisit, this);
			},
			onRecipientItemPress: function (oEvent) {
				var oSelectedRecipientContext = oEvent.getSource().getSelectedItem().getBindingContext("RecipientsModel");
				this._setState("/oSelectedRecipientContext", oSelectedRecipientContext);
			},
			onEditRecipient: function () {
				this._setState("/bNewRecipient", false);
				var oSelectedRecipient = this._getState("/oSelectedRecipientContext").getObject();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Recipient", oSelectedRecipient);
			},
			onAddRecipient: function () {
				this._setState("/bNewRecipient", true);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Recipient", {
					Id: this.generateId()
				});
			},
			onNewVisitCreated: function () {
				var oSelectedRecipient = this._getState("/oSelectedRecipientContext").getObject();
				var oSelectedWorkOrder = this._getState("/oSelectedWorkOrderContext").getObject();
				var oModel = this.getModel("WorkOrderModel");
				var oNewVisitHead = {
					WOId: oSelectedWorkOrder.Id,
					RecipientId: oSelectedRecipient.Id,
					RecipientCompany: oSelectedRecipient.CompanyName,
					RecipientType: oSelectedRecipient.Type,
					RecipientOffice: oSelectedRecipient.Office

				};
				var fnVisitHeadCreated = function (oVisitHead, oResponse) {
					oModel.submitChanges({
						groupId: "VisitHeadGroup"
					});

					var sVisitHeadPath = ObjectUtils.getPath(oVisitHead, oModel);
					var oVisitHeadContext = this.getModel("WorkOrderModel").createBindingContext(sVisitHeadPath);

					this._setState("/oVisitHeadContext", oVisitHeadContext);

					var fnSuccessCreateVisitDetail = function (oVisitDetail, oResponse) {
						this._showMessageToast("La visita al destinatario " + oVisitDetail.RecipientId + " de la work order " + oVisitDetail.WOId +
							" se grabo correctamente");
						this._onNavBack();
						var sVisitDetailPath = ObjectUtils.getPath(oVisitDetail,this.getModel("WorkOrderModel"));
						var oVisitDetailContext =  this.getModel("WorkOrderModel").createBindingContext(sVisitDetailPath);
						this._setState("/oVisitDetailContext", oVisitDetailContext);
						
						this.getRouter().navTo("Visit", {
							RecipientId: oVisitDetail.RecipientId,
							RecipientType: oVisitDetail.RecipientType,
							WOId: oVisitDetail.WOId,
							RecipientOffice: oVisitDetail.RecipientOffice
						});
					}.bind(this);
					var fnErrorCreateVisitDetail = function (oError) {
						this._showMessageToast(oError);
					}.bind(this);

					models.createVisitDetail(oVisitHeadContext, fnSuccessCreateVisitDetail, fnErrorCreateVisitDetail);
				}.bind(this);
				var fnError = function (oError) {
					this._showMessageError(JSON.parse(oError.responseText).error.message.value);
				}.bind(this);
				models.createVisitHead(oNewVisitHead, fnVisitHeadCreated, fnError);
			},

			onCancelNewVisit: function (oEvent) {
				this._setState("/oSelectedRecipientContext", null);
				this._onNavBack();
			},

			onSearch: function (oEvt) {
				var aFilters = [],
					oTable = this.byId("destTable"),
					oBinding = oTable.getBinding("items"),
					sQuery = oEvt.getSource().getValue();

				if (sQuery && sQuery.length > 0) {
					var filter = new Filter("CompanyName", sap.ui.model.FilterOperator.Contains, sQuery);
					aFilters.push(filter);
				}
				//	oBinding.filter(aFilters, "Application");
				oBinding.aFilters = aFilters;
				oTable.getModel("RecipientsModel").refresh(true);
			},

			handleSortButtonPressed: function () {
				this._openDialogWithoutContext("sortDialog", "SortDialog");
			},

			handleSortDialogConfirm: function (oEvent) {
				var oTable = this.byId("destTable"),
					mParams = oEvent.getParameters(),
					oBinding = oTable.getBinding("items"),
					sPath,
					bDescending,
					aSorters = [];

				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new Sorter(sPath, bDescending));

				// apply the selected sort and group settings
				oBinding.sort(aSorters);
			},

			compareCompanyNameStrings: function (a, b) {
				var iA = parseInt(a, 10),
					iB = parseInt(b, 10);

				if (iA === iB) {
					return 0;
				}

				if (iA < iB) {
					return -1;
				}

				if (iA > iB) {
					return 1;
				}

				return 0;
			}
		});
	});