sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/custom/controls/ErrorHandler",
	"sap/m/MessageToast",
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController"
], function (UIComponent, Device, models, ErrorHandler, MessageToast, BaseController) {
	"use strict";

	return UIComponent.extend("ABMcontactos.TGN-ABMcontactos.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// RefreshStore
			if (typeof sap.hybrid !== 'undefined' && sap.hybrid.isOnline()) {
				MessageToast.show("Online mode - Starting Refresh");
				sap.hybrid.refreshStore();
			} else if (typeof sap.hybrid !== 'undefined' && !sap.hybrid.isOnline()) {
				MessageToast.show("Offline mode");
			}

			// set the i18n to models as reference
			models.suscribeModel(this.getModel("i18n"), "i18n");
			// set the i18nErrors to models as reference
			models.suscribeModel(this.getModel("i18nErrors"), "i18nErrors");
			// set the userattributes to models as reference
			models.suscribeModel(this.getModel("UserAttributes"), "UserAttributes");
			// save userAttributes for offline use
			this.getModel("UserAttributes").attachRequestCompleted(models.saveOfflineUserAttributes);
			// set the States to models as reference
			models.suscribeModel(this.getModel("States"), "States");
			// set the WorkOrderModel to models as reference
			models.suscribeModel(this.getModel("WorkOrderModel"), "WorkOrderModel");
			// set the Metadata to models as reference
			models.suscribeModel(this.getMetadata(), "Metadata");
			// Set WorkOrderModel Change Group Ids 
			models.setModelGroupIds();
			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			// set the attachmentSet helper model
			var oAttachmentsModel = models.createAttachmentsModel();
			oAttachmentsModel.setProperty("/AttachmentSet", []);
			models.suscribeModel(oAttachmentsModel, "AttachmentsModel");
			this.setModel(oAttachmentsModel,"AttachmentsModel");

			var _setNativeNavBack = function () {
				var onBackKeyDown = function () {
					var fnOnNavBack = models.getState("/fnOnNavBack");
					if (fnOnNavBack) {
						if (typeof fnOnNavBack === "function") fnOnNavBack();
					}
				}.bind(this);

				var onDeviceReady = function () {
					document.addEventListener("backbutton", onBackKeyDown, false);
				}.bind(this);
				document.addEventListener("deviceready", onDeviceReady, false);
			};

			_setNativeNavBack();

			// initialize the error handler with the component
			this._oErrorHandler = new ErrorHandler(this);
			// enable routing
			this.getRouter().initialize();

		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		}
	});
});