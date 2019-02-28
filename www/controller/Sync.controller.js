/* global store,OData,navigator */
sap.ui.define([
	"jquery.sap.global",
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (jQuery, BaseController, JSONModel, models) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.Sync", {

		onInit: function () {
			this.showErrors();
		},

		onAfterRendering: function () {
			this.showErrors();
		},

		//Uses the Error Archive.  You can also view rows that are in an error state using a filter or by looking for an annotation.  See the read() method
		showErrors: function () {
			if (!store) {
				jQuery.sap.log.error("The store must be opened before viewing the ErrorArchive");
				return;
			}
			jQuery.sap.log.info("ErrorArchive request started");

			var sURL = store.serviceUri + "/ErrorArchive";
			var oHeaders = {};

			var request = {
				headers: oHeaders,
				requestUri: sURL,
				method: "GET"
			};
			jQuery.sap.log.info("read using " + sURL);

			function showErrorsSuccessCallback(data, response) {
				jQuery.sap.log.info("ErrorArchive contains " + data.results.length + " records ");
				jQuery.sap.log.info(JSON.stringify(data.results));
			}

			function errorCallback(e) {
				jQuery.sap.log.error("An error occurred: " + JSON.stringify(e));
			}

			OData.read(request, showErrorsSuccessCallback, errorCallback);
		},

		clearErrors: function () {
			var fnSuccess = function (oData, oResponse) {
				var aErrorArchives = oData.results;
				if (typeof aErrorArchives !== 'undefined' && aErrorArchives.length === 0) {
					this._showMessageInfo("There are no errors to remove from the ErrorArchive");
					return;
				}

				navigator.notification.confirm(
					"Proceeding will revert all operations that are currently in an error state", // message
					this.clearErrors1(aErrorArchives), // callback to invoke with index of button pressed
					"Warning", // title
					["Continue", "Cancel"] // buttonLabels
				);
			}.bind(this);
			models.loadEntity("/ErrorArchive", null, fnSuccess);

		},

		clearErrors1: function (aErrorArchives) {
			jQuery.sap.log.info("Clearing error!");
			for (var i = 0; i < aErrorArchives.length; i++) {
				var oErrorMessage = aErrorArchives[i];
				var deleteErrorsURL = store.serviceUri + "/ErrorArchive(" + oErrorMessage.requestID + ")";
				var oHeaders = {};
				oHeaders['Content-Type'] = "application/json";
				oHeaders['accept'] = "application/json";
				oHeaders['If-Match'] = "*"; //Some services needs If-Match Header for Update/delete

				var request = {
					headers: oHeaders,
					requestUri: deleteErrorsURL,
					method: "DELETE"
				};

				var _successCallback = function(data, response) {
					jQuery.sap.log.info(JSON.stringify(data.results));
				}.bind(this);

				var _errorCallback = function(e) {
					jQuery.sap.log.error("An error occurred: " + JSON.stringify(e));
				}.bind(this);
				OData.request(request, _successCallback, _errorCallback);
			}

		},

		onShowDetail: function (oEvent) {
			var oError = oEvent.getSource().getBindingContext("WorkOrderModel").getObject();
			this._setState("/oSelectedCause", oError);

			this.getRouter().navTo("SyncDetail", {
				requestid: oError.RequestID
			});
		},
		onExit: function () {
			this.destroy();
		}

	});
});