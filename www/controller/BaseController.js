sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils"
], function (Controller, History, models, MessageBox, MessageToast, ObjectUtils, StringUtils) {
	"use strict";

	return Controller.extend("ABMcontactos.TGN-ABMcontactos.controller.BaseController", {
		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getComponentModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Getter for the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		_onNavBack: function (fnCallback) {
			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash(),
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.getView().unbindElement("WorkOrderModel");
			this.getView().setBindingContext(null, "WorkOrderModel");
			if (sPreviousHash !== undefined || sPreviousHash === "") {
				window.history.go(-1);
			} else {
				oRouter.navTo("WorkOrderList", true);
			}
			if (fnCallback) {
				if (typeof fnCallback === "function") fnCallback();
			}

		},

		_setNativeBackBehaviour: function (fnOnNavBack, oContext) {
			this._setState("/fnOnNavBack", fnOnNavBack.bind(oContext));
		},
		//"fileUploaderDialog", "FileUploader", oAttachmentContext, "AttachmentsModel"
		_openDialog: function (sDialogId, sFragmentName, oContext, sModelName) {
			var oView = this.getView();
			var oDialog = oView.byId(sDialogId);

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "ABMcontactos.TGN-ABMcontactos.fragment." + sFragmentName, this);
				oView.addDependent(oDialog);
			}
			var deviceType = this.getView().getModel("device").getProperty("/system");
			if (deviceType.phone) {
				oDialog.setStretch(true);
			}

			
			oDialog.unbindElement();
			if (oContext && sModelName) {
				// bind the view to the new entry
				oDialog.setBindingContext(oContext, sModelName);
			}
			oDialog.open();
		},

		_openDialogWithoutContext: function (sDialogId, sFragmentName) {
			var oView = this.getView();
			var oDialog = oView.byId(sDialogId);

			if (!oDialog) {
				oDialog = sap.ui.xmlfragment(oView.getId(), "ABMcontactos.TGN-ABMcontactos.fragment." + sFragmentName, this);
				oView.addDependent(oDialog);
			}
			var deviceType = this.getView().getModel("device").getProperty("/system");
			if (deviceType.phone && !(oDialog.getMetadata()._sClassName === "sap.m.ViewSettingsDialog")) {
				oDialog.setStretch(true);
			}
			oDialog.unbindElement();
			oDialog.open();
		},

		_closeDialog: function (sDialogId) {
			var oDialog = this.getView().byId(sDialogId);
			oDialog.close();
			oDialog.destroy(true);
		},
		_changeDialogTitle: function (sDialogId, sTitle) {
			var oDialog = this.getView().byId(sDialogId);
			oDialog.setTitle(sTitle);
		},
		_setState: function (sUIParameter, value) {
			models.setState(sUIParameter, value);
		},
		_getState: function (sUIParameter) {
			return models.getState(sUIParameter);
		},
		_showMessageInfo: function (sContent) {
			if (this._getState("/bMessageOpen")) {
				return;
			}
			this._setState("/bMessageOpen", true);
			MessageBox.information(
				sContent, {
					id: "InformationMessageBox",
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._setState("/bMessageOpen", false);
					}.bind(this)
				}
			);
		},
		_showMessageError: function (sDetails) {
			if (this._getState("/bMessageOpen")) {
				return;
			}
			this._setState("/bMessageOpen", true);
			MessageBox.error(
				this._sErrorText, {
					id: "ErrorMessageBox",
					details: sDetails,
					actions: [MessageBox.Action.CLOSE],
					onClose: function () {
						this._setState("/bMessageOpen", false);
					}.bind(this)
				}
			);
		},
		_showMessageToast: function (sMessage) {
			MessageToast.show(sMessage);
		},
		_getResourceBundleMessage: function (sKey) {
			var oResourceBundle = this.getModel("i18n").getResourceBundle();
			return oResourceBundle.getText(sKey);
		},
		_getResourceBundleErrorMessage: function (sKey) {
			var oResourceBundle = this.getModel("i18nErrors").getResourceBundle();
			return oResourceBundle.getText(sKey);
		},
		// Get Path from view current context
		_getPath: function (sContextName, sEntitySetName, oArgs) {
			var sPath;
			var oContext = this._getState(sContextName);
			if (oContext) {
				sPath = oContext.getPath();
			} else {
				var oSortedArgs = ObjectUtils.sortProperties(oArgs, this.getModel("WorkOrderModel"), "VisitHead");
				sPath = StringUtils.buildPath(sEntitySetName, oSortedArgs);
			}
			return sPath;

		},

		_comesFrom: function (sPreviousPressumedUrl) {
			var oHistory = History.getInstance(),
				sPreviousHash = oHistory.getPreviousHash();
			if (!sPreviousHash) return false;
			return sPreviousHash.indexOf(sPreviousPressumedUrl) > -1;
		},

		_displayCancelConfirmation: function (sWarningTitle, sErrorMessage, fnOnOk) {
			if (models.getState("/bMessageOpen")) {
				return;
			}
			models.setState("/bMessageOpen", true);

			var fnOnClose = function (sAction) {
				switch (sAction) {
				case MessageBox.Action.OK:
					fnOnOk();
					break;
				case MessageBox.Action.CLOSE:
					break;
				default:
				}
				models.setState("/bMessageOpen", false);
			}.bind(this);

			MessageBox.warning(
				sErrorMessage, {
					title: sWarningTitle,
					id: "cancelConfirmationMessageBox",
					actions: [MessageBox.Action.OK, MessageBox.Action.CLOSE],
					onClose: fnOnClose
				}
			);
		},

		onExit: function () {
			this.destroy();
		},

		generateId: StringUtils.generateId

	});

});