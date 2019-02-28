sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/Utils/formatter",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils"
], function (BaseController, formatter, models, StringUtils, ObjectUtils) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.VisitsList", {
		formatter: formatter,

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.VisitsList
		 */
		onInit: function () {

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("VisitsList").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			var oModel = this.getModel("WorkOrderModel");
			var oSortedProps = ObjectUtils.sortProperties(oArgs, oModel, "WorkOrder"),
				sPath = StringUtils.buildPath("WorkOrderSet", oSortedProps),
				oWorkOrderContext = new sap.ui.model.Context(oModel, sPath);
			this.getView().setBindingContext(oWorkOrderContext, "WorkOrderModel");
			this._filterVisits(oWorkOrderContext.getObject().Id);

			this._setNativeBackBehaviour(this.onNavback, this);
			oModel.refresh(true);

			models.updateWOStatus();
		},
		_filterVisits: function (iWorkOrderId) {
			var aWorkOrderId = [iWorkOrderId];
			var oWOFilter = models.getFilter("WOId", aWorkOrderId, false);
			var oRecipientTable = this.getView().byId("visitasList");
			var oBinding = oRecipientTable.getBinding("items");
			oBinding.filter(oWOFilter);
		},

		onPressVisita: function (oEvent) {
			var oModel = this.getModel("WorkOrderModel");
			var oRouter = this.getOwnerComponent().getRouter();
			var oVisitHeadContext = oEvent.getSource().getBindingContext("WorkOrderModel");
			this._setState("/oVisitHeadContext", oVisitHeadContext);

			//VisitHead has VisitDetail
			var fnSuccessGetVisitDetail = function (oResult) {

				if (oResult.results.length > 0) {
					var oVisitDetail = oResult.results[0];
					var sVisitDetailPath = ObjectUtils.getPath(oVisitDetail, oModel);
					var oVisitDetailContext = oModel.createBindingContext(sVisitDetailPath);
					//var oVisitDetailContext = new sap.ui.model.Context(oModel, sVisitDetailPath);

					this._setState("/oVisitDetailContext", oVisitDetailContext);
					oRouter.navTo("Visit", {
						RecipientId: oVisitDetail.RecipientId,
						RecipientType: oVisitDetail.RecipientType,
						WOId: oVisitDetail.WOId,
						RecipientOffice: oVisitDetail.RecipientOffice
					});
				} else { //VisitHead doesn't have a VisitDetail
					var fnSuccessCreateVisitDetail = function (oVisitDetail, oResponse) {
						this._showMessageToast("La visita al destinatario " + oVisitDetail.RecipientId + " de la work order " + oVisitDetail.WOId +
							" se grabo correctamente");
					}.bind(this);
					var fnErrorCreateVisitDetail = function (oError) {
						this._showMessageToast(oError);
					}.bind(this);

					var oVisitDetailContext = models.createVisitDetail(oVisitHeadContext, fnSuccessCreateVisitDetail, fnErrorCreateVisitDetail);
					var oVisitDetail = oVisitDetailContext.getObject();
					this._setState("/oVisitDetailContext", oVisitDetailContext);
					oRouter.navTo("Visit", {
						RecipientId: oVisitDetail.RecipientId,
						RecipientType: oVisitDetail.RecipientType,
						WOId: oVisitDetail.WOId,
						RecipientOffice: oVisitDetail.RecipientOffice
					});
				}

			}.bind(this);

			models.getVisitDetail(oVisitHeadContext, fnSuccessGetVisitDetail);

		},

		onPressNewVisitBtn: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RecipientList");
		},

		onNavback: function (oEvent) {
			this._setState("/oSelectedWorkOrderContext", null);
			this._onNavBack();
		}

	});

});