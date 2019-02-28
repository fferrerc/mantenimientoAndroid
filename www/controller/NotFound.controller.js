sap.ui.define([
		"ABMcontactos/TGN-ABMcontactos/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.NotFound", {

			/**
			 * Navigates to the MainList when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("MainList");
			}

		});

	}
);