sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/Validator",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/Int8",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (BaseController,ObjectUtils,StringUtils,Validator,Int8,models) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.Recipient", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Recipient").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			if (this._getState("/bNewRecipient")) {
				this._createNewRecipient();
			} else {
				this._editRecipient(oArgs);
			}

		},

		_createNewRecipient: function () {
			this._setState("/bNewRecipient", undefined);
			var oNewRecipient = {};

			// create new entry in the model
			var oRecipientContext = models.createNewRecipient(oNewRecipient);                         
			this.getView().unbindElement();
			this.getView().setBindingContext(oRecipientContext, "WorkOrderModel");
			this._setState("/oRecipientContext", oRecipientContext);
		},

		_editRecipient: function (oArgs) {
			
			var oModel = this.getModel("WorkOrderModel");
			var oSortedProps = ObjectUtils.sortProperties(oArgs,oModel,"Recipient");
			var sPath = StringUtils.buildPath("RecipientSet", oSortedProps);
			var oRecipientContext = new sap.ui.model.Context(oModel, encodeURI(sPath));

			this.getView().unbindElement();
			this.getView().setBindingContext(oRecipientContext, "WorkOrderModel");
			this._setState("/oRecipientContext", oRecipientContext);
		},

		onSaveRecipient: function (oEvent) {

			// Create new validator instance
			var validator = new Validator();
			// Validate input fields against root page with id ‘ContactPage’
			if (validator.validate(this.byId("recipientPage"))) {

				this._setState("/oRecipientContext", "");
				this.getView().unbindElement();
				this._onNavBack();

				var oModel = this.getModel("WorkOrderModel");

				var fnSubmitSuccess = function (oResponse) {
					this._showMessageError(oResponse);
				}.bind(this);

				var fnSubmitError = function (oError) {
					this._showMessageError(oError);
				}.bind(this);

				oModel.submitChanges({
					success: fnSubmitSuccess,
					error: fnSubmitError
				});
			}
		},
		
		

		onCancelRecipient: function (oEvent) {
			var oBundle = models.getModel("i18nErrors").getResourceBundle();
			var sWarningTitle = oBundle.getText("recipientEdit.warningTitle");
			var sErrorMessage = oBundle.getText("recipientEdit.cancelConfirmation");
			var onOk = function () {
				this._rollBackChanges();
				this._onNavBack();
				this._setState("/bNewRecipient", undefined);
			}.bind(this);

			this._displayCancelConfirmation(sWarningTitle, sErrorMessage, onOk);
			
		},
		_rollBackChanges: function () {
			var oModel = this.getModel("WorkOrderModel");
			var oRecipientContext = this._getState("/oRecipientContext");
			oModel.resetChanges([oRecipientContext.getPath()]);
			
		}

	});

});