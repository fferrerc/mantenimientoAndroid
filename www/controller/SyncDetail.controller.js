/* global OData */
sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/Utils/FormUtils"
], function (BaseController,FormUtils) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.SyncDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.SyncDetail
		 */
		onInit: function () {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("SyncDetail").attachMatched(this._onRouteMatched, this);
		},
		_onRouteMatched: function (oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			var requestId = oArgs.requestid;
			var sAffectedEntityURL = store.serviceUri + "/ErrorArchive(" + requestId + ")/AffectedEntity";
			var oHeaders = {};
			oHeaders['Content-Type'] = "application/json";
			oHeaders['accept'] = "application/json";

			var request = {
				headers: oHeaders,
				requestUri: sAffectedEntityURL,
				method: "GET"
			};

			var _showAffectedEntity = function (data) {
				if (data.__metadata.type.includes("VisitDetail")) {
					var oVisitDetail = data;
					this.getRouter().navTo("Visit", oVisitDetail);
				} else {
					var oFormContainer = this.getView().byId("formContainer");
					var oSelectedCause = this._getState("/oSelectedCause");
					oFormContainer.destroyFormElements();
					FormUtils.buildForm(oFormContainer, oSelectedCause);
					FormUtils.buildForm(oFormContainer, data);
				}
			}.bind(this);

			var _errorCallback = function (e) {
				jQuery.sap.log.error("An error occurred: " + JSON.stringify(e));
			}.bind(this);

			jQuery.sap.log.info(sAffectedEntityURL);
			OData.request(request, _showAffectedEntity, _errorCallback);
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.SyncDetail
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.SyncDetail
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.SyncDetail
		 */
		onExit: function () {
			this.destroy();
		}

	});

});