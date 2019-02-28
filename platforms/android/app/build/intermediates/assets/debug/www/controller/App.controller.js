sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (BaseController, models) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.App", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.App
		 */
		onInit: function () {

			// Set Sections model
			this.getComponentModel("WorkOrderModel").metadataLoaded().then(models.setSectionsModel.bind(models));

		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.App
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.App
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ABMcontactos.TGN-ABMcontactos.view.App
		 */
		//	onExit: function() {
		//
		//	}

	});

});