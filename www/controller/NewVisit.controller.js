sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils"
], function (BaseController, models, ObjectUtils) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.NewVisit", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.NewVisit
		 */

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("NewVisit").attachPatternMatched(this._onRouteMatched, this);

			var oEventBus = sap.ui.getCore().getEventBus();
			oEventBus.subscribe("onSelectRecipient", this._onNewVisitCreated, this);
		},

		_onNewVisitCreated: function (sChannelId, sEventId, oSelectedRecipient) {
			// TODO usar ObjectUtils.sortProperties y StringUtils.buildPath
			var oModel = this.getModel("WorkOrderModel"),
				oRecipientContext = new sap.ui.model.Context(oModel, "/RecipientSet(Id=" + oSelectedRecipient.ID + ",Office=" +
					oSelectedRecipient.Office + ",Type='" + oSelectedRecipient.Type + "')");

			this.getView().byId("destInput").setBindingContext(oRecipientContext, "WorkOrderModel");
		},

		_onRouteMatched: function (oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			var oNewVisitHeadContext = this.getView().getBindingContext("WorkOrderModel");
			if (!oNewVisitHeadContext)
				this._createNewVisit(oArgs);
		},

		_createNewVisit: function (oArgs) {
			var sNewVisitHeadPath = "/VisitHeadSet(Id=" + oArgs.Id + ",WOId=" + oArgs.WOId + ")";
			var oModel = this.getModel("WorkOrderModel");

			var fnSuccess = function (oVisitHead, oResponse) {
				var oNewVisitHeadContext =  oModel.createBindingContext(sNewVisitHeadPath);
				this.getView().unbindElement();
				this.getView().setBindingContext(oNewVisitHeadContext, "WorkOrderModel");
			}.bind(this);

			var fnError = function (oError) {

			}.bind(this);

			models.createVisitHead(oArgs, fnSuccess, fnError);
		},

		onShowDestList: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("RecipientList");
		},

		onSaveNewVisit: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oVisitHeadContext = this.getView().getBindingContext("WorkOrderModel");
			var oVisitHead = oVisitHeadContext.getObject();
			var oModel = this.getModel("WorkOrderModel");

			var oTypeSelect = this.getView().byId("typeSelectId");
			var oOfficeSelect = this.getView().byId("officeSelectId");

			oVisitHead.Office = oOfficeSelect.getSelectedItem().getBindingContext("WorkOrderModel").getObject().Value;
			oVisitHead.Type = oTypeSelect.getSelectedItem().getBindingContext("WorkOrderModel").getObject().Value;

			oModel.setProperty(oVisitHeadContext.getPath() + '/Office', oVisitHead.Office);
			oModel.setProperty(oVisitHeadContext.getPath() + '/Type', oVisitHead.Type);

			var fnSubmitSuccess = function (oData, oResponse) {
				this.getView().setBindingContext(undefined, "WorkOrderModel");
				oModel.refresh(true);
				var fnCreateVisitDetailSuccess = function (oVisitDetail, oResponse) {
					var sVisitDetailPath = ObjectUtils.getPath(oVisitDetail, oModel);
					var oNewVisitDetailContext = oModel.createBindingContext(sVisitDetailPath);
					this._setState("/bNewVisitDetail", true);
					this._setState("/oVisitDetailContext", oNewVisitDetailContext);
					oRouter.navTo("MainList", true);
				}.bind(this);
				var fnCreateVisitDetailError = function (oError) {
					this._showMessageError(JSON.stringify(oError));
				}.bind(this);
				models.createVisitDetail(oVisitHeadContext.getPath(), fnCreateVisitDetailSuccess, fnCreateVisitDetailError);
			}.bind(this);

			var fnSubmitError = function (oError) {
				this._showMessageError(JSON.stringify(oError));
			}.bind(this);
			var mParameters = {
				groupId: "VisitHeadGroup",
				success: fnSubmitSuccess,
				error: fnSubmitError
			};
			oModel.submitChanges(mParameters);
		},

		onCancelNewVisit: function (oEvent) {
			this._rollBackChanges();
			this.getRouter().navTo("MainList", true);
		},

		_rollBackChanges: function () {
			var oModel = this.getModel("WorkOrderModel");
			oModel.resetChanges();
		},

		onNavBack: function () {
			this._rollBackChanges();
			this.getRouter().navTo("MainList", true);
		}

	});

});