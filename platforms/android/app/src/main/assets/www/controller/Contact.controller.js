sap.ui.define([
	"jquery.sap.global",
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/Validator",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/email",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/phone",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/integer",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/nonEmptyString",
	"ABMcontactos/TGN-ABMcontactos/custom/dataTypes/stringUptoTenChars",
	"sap/m/MessageBox"
], function (jQuery, BaseController, JSONModel, models, Validator, ObjectUtils, StringUtils, email, phone, integer, nonEmptyString,
	stringUptoTenChars,
	MessageBox) {
	"use strict";
	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.Contact", {

		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Contact").attachPatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {
			var oArgs = oEvent.getParameter("arguments");
			if (this._getState("/bNewContact")) {
				this._createNewContact(oArgs);
			} else {
				this._editContact(oArgs);
			}
			this._setNativeBackBehaviour(this.onNavBack, this);
		},

		_createNewContact: function (oArgs) {
			var oModel = this.getModel("WorkOrderModel"),
				oContact = ObjectUtils.sortProperties(oArgs, oModel, "Contact");

			// create new entry in the model
			var fnSuccess = function (oNewContact, oResponse) {
				var sContactPath = ObjectUtils.getPath(oNewContact, oModel);
				var oContactContext = oModel.createBindingContext(sContactPath);
				this._setState("/oContactContext", oContactContext);

				this.getView().unbindElement();
				this.getView().setBindingContext(oContactContext, "WorkOrderModel");
			}.bind(this);

			var fnError = function (oError) {
				jQuery.sap.log.error(oError);
			}.bind(this);

			models.onCreateNewContact(oContact, fnSuccess, fnError);
		},

		_editContact: function (oArgs) {
			var oContactContext = this._getState("/oSelectedContactContext");
			this._setState("/oContactContext", oContactContext);
			this.getView().unbindElement();
			this.getView().setBindingContext(oContactContext, "WorkOrderModel");
		},

		onSaveContact: function (oEvent) {
			// Create new validator instance
			var validator = new Validator();
			// Validate input fields against root page with id ‘ContactPage’
			if (validator.validate(this.byId("ContactPage"))) {
				var oModel = this.getModel("WorkOrderModel");
				var oContactContext = this.getView().getBindingContext("WorkOrderModel");
				var oContact = oContactContext.getObject();
				oModel.setProperty(oContactContext.getPath() + "/Office", parseInt(oContact.Office, 10));
				oModel.setProperty(oContactContext.getPath() + "/RecipientId", parseInt(oContact.RecipientId, 10));

				var mParameters = {};
				if (oContact.__metadata.etag) mParameters.eTag = oContact.__metadata.etag;

				// Remove null values
				oContact = ObjectUtils.removeNullValues(oContact);
				
				// Remove null values
				oContact = ObjectUtils.removeDefNavigationProperties(oContact);

				oModel.update(oContactContext.getPath(), oContact, mParameters);

				this.getView().unbindElement();
				this._onNavBack();
				this._onNavBack();
				this._setState("/oContactContext", "");
				this._setState("/bNewContact", "");
				models.selectVisitsContact(oContact);

			}

		},

		_rollBackChanges: function () {
			this.getView().unbindElement();
			var oModel = this.getModel("WorkOrderModel");
			oModel.resetChanges([this._getState("/oContactContext").getPath()]);

			var bNewContact = this._getState("/bNewContact");
			if (bNewContact) {
				var mParameters = {};
				var oContact = this._getState("/oContactContext").getObject();
				if (oContact.__metadata.etag) mParameters.eTag = oContact.__metadata.etag;
				oModel.remove(this._getState("/oContactContext").getPath(), mParameters);
				oModel.submitChanges(mParameters);
				this._setState("/bNewContact", "");
			}
			this._setState("/oContactContext", "");
		},

		onNavBack: function () {
			var oBundle = models.getModel("i18nErrors").getResourceBundle();
			var sWarningTitle = oBundle.getText("contactEdit.warningTitle");
			var sErrorMessage = oBundle.getText("contactEdit.cancelConfirmation");
			var onOk = function () {
				this._rollBackChanges();
				this._onNavBack();
			}.bind(this);
			this._displayCancelConfirmation(sWarningTitle, sErrorMessage, onOk);
		}
	});
});