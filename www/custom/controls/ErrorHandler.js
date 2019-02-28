sap.ui.define([
	"sap/ui/base/Object",
	"sap/m/MessageBox",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (UI5Object, MessageBox, models) {
	"use strict";

	return UI5Object.extend("ABMcontactos.TGN-ABMcontactos.controller.ErrorHandler", {

		/**
		 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
		 * @class
		 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
		 * @public
		 * @alias ABMcontactos.TGN-ABMcontactos.controller.ErrorHandler
		 */
		constructor: function (oComponent) {
			this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
			this._oComponent = oComponent;
			this._oModel = oComponent.getModel("WorkOrderModel");
			models.setState("/bMessageOpen", false);
			this._sErrorText = this._oResourceBundle.getText("errorText");

			this._oModel.attachMetadataFailed(function (oEvent) {
				var oParams = oEvent.getParameters();
				this._showMetadataError(oParams.response);
			}, this);

			this._oModel.attachRequestFailed(function (oEvent) {
				var oParams = oEvent.getParameters();

				var showMessage = function (response) {
					var oResponseText = {};
					try {
						oResponseText = JSON.parse(response.responseText);
						this._showServiceError(oResponseText.error.code, oResponseText.error.message.value);
					} catch (e) {
						console.log(e);
					}

				}.bind(this);

				// An entity that was not found in the service is also throwing a 404 error in oData.
				// We already cover this case with a notFound target so we skip it here.
				// A request that cannot be sent to the server is a technical error that we have to handle though

				switch (oParams.response.statusCode) {
					case 404:
						if (oParams.response.responseText.indexOf("Cannot POST") < 0) {
							showMessage(oParams.response);
						}
						break;
					case 412:
						break;
					case 500:
						break;
					default:
						showMessage(oParams.response);
				}
			}, this);

		},

		/**
		 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
		 * The user can try to refresh the metadata.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showMetadataError: function (sDetails) {
			MessageBox.error(
				sDetails, {
					id: "metadataErrorMessageBox",
					details: sDetails,
					actions: [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
					onClose: function (sAction) {
						if (sAction === MessageBox.Action.RETRY) {
							this._oModel.refreshMetadata();
						}
					}.bind(this)
				}
			);
		},

		/**
		 * Shows a {@link sap.m.MessageBox} when a service call has failed.
		 * Only the first error message will be display.
		 * @param {string} sDetails a technical error to be displayed on request
		 * @private
		 */
		_showServiceError: function (sTitle, sDetails) {
			if (models.getState("/bMessageOpen")) {
				return;
			}
			models.setState("/bMessageOpen", true);

			MessageBox.error(sDetails, {
				title: sTitle, // default
				id: "serviceErrorMessageBox",
				onClose: function () {
					models.setState("/bMessageOpen", false);
				}.bind(this),
				actions: [MessageBox.Action.CLOSE]
			});
		}
	});
});