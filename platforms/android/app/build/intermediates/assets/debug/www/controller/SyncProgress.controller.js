/* global store,OData*/
 sap.ui.define([
 	"jquery.sap.global",
 	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
 	"sap/ui/model/json/JSONModel",
 	"ABMcontactos/TGN-ABMcontactos/model/models"
 ], function (jQuery, BaseController, JSONModel, models) {
 	"use strict";

 	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.SyncProgress", {

 		onInit: function () {
 			var oRouter = this.getOwnerComponent().getRouter();
 			oRouter.getRoute("SyncProgress").attachMatched(this._onRouteMatched, this);
 			var oEventBus = sap.ui.getCore().getEventBus();
 			oEventBus.subscribe("updateSyncProgress", this._updateProgress, this);
 			oEventBus.subscribe("flushSucceded", this._flushSucceded, this);
 			oEventBus.subscribe("flushFailed", this._flushFailed, this);
 			oEventBus.subscribe("refreshSucceded", this._refreshSucceded, this);
 			oEventBus.subscribe("refreshFailed", this._refreshFailed, this);

 		},

 		_onRouteMatched: function () {
 			var sURL = store.serviceUri + "/ErrorArchive";
 			var oHeaders = {};
 			var request = {
 				headers: oHeaders,
 				requestUri: sURL,
 				method: "GET"
 			};

 			var showErrorsSuccessCallback = function (data, response) {
 				if (data.results.length > 0) {
 					this._setState("/bNavToSyncDetailEnabled", true);
 				} else {
 					this._setState("/bNavToSyncDetailEnabled", false);
 				}
 			}.bind(this);

 			OData.read(request, showErrorsSuccessCallback);

 			var oModelProgress = new JSONModel({
 				percentProgress: 0,
 				stateComment: "Inicializando..."
 			});
 			this.getView().setModel(oModelProgress, "oModelProgress");

 			if (typeof sap.hybrid !== 'undefined' && sap.hybrid.isOnline()) {
 				sap.hybrid.flushStore();
 			} else {
 				this._showMessageInfo("No se puede transmitir en modo offline");
 			}
 		},

 		_flushSucceded: function (sChannel, sEvent, sMessage) {
 			jQuery.sap.log.info("flushSucceded");
 			sap.hybrid.refreshStore();
 			this._showMessageInfo(sMessage);
 		},

 		_flushFailed: function (sChannel, sEvent, sMessage) {
 			jQuery.sap.log.error("_flushFailed");
 			sap.hybrid.refreshStore();
 			this._showMessageInfo(sMessage);
 		},

 		_refreshSucceded: function (sChannel, sEvent, sMessage) {
 			jQuery.sap.log.info("_refreshSucceded");
 			this._showMessageInfo(sMessage);
 		},

 		_refreshFailed: function (sChannel, sEvent, sMessage) {
 			jQuery.sap.log.info("_refreshFailed");
 			this._showMessageInfo(sMessage);
 		},
 		_updateProgress: function (sChannel, sEvent, oProgressStatus) {
 			jQuery.sap.log.info("_updateProgress");
 			var lead = "unknown";
 			var icon = "sap-icon://sys-help-2";
 			var oModelProgress = this.getView().getModel("oModelProgress");

 			switch (oProgressStatus.progressState) {
 			case sap.OfflineStore.ProgressState.STORE_DOWNLOADING:
 				lead = "Downloading ";
 				icon = "sap-icon://download-from-cloud";
 				break;
 			case sap.OfflineStore.ProgressState.REFRESH:
 				lead = "Refreshing ";
 				icon = "sap-icon://refresh";
 				if (oModelProgress.getData().percentProgress < 90) {
 					oModelProgress.setProperty("/percentProgress", oModelProgress.getData().percentProgress += 5);
 				}
 				oModelProgress.setProperty("/stateComment", "Sincronizando...");
 				break;
 			case sap.OfflineStore.ProgressState.FLUSH_REQUEST_QUEUE:
 				lead = "Flushing ";
 				icon = "sap-icon://paper-plane";
 				if (oModelProgress.getData().percentProgress < 90) {
 					oModelProgress.setProperty("/percentProgress", oModelProgress.getData().percentProgress += 5);
 				}
 				oModelProgress.setProperty("/stateComment", "Sincronizando...");
 				break;
 			case sap.OfflineStore.ProgressState.DONE:
 				lead = "Complete ";
 				icon = "sap-icon://complete";
 				oModelProgress.setProperty("/percentProgress", 100);
 				oModelProgress.setProperty("/stateComment", "Sincronización completa. Ya puede ingresar a la lista de visitas actualizada.");
 				break;
 			default:
 				this._showMessageInfo("Unknown status in progressCallback");

 			}

 			var aProgressStates = this._getState("/aProgressStates");

 			var oProgress = {
 				"dateAndTime": new Date().toLocaleTimeString(),
 				"state": lead,
 				"icon": icon,
 				"bytesSent": oProgressStatus.bytesSent,
 				"bytesRecv": oProgressStatus.bytesRecv,
 				"fileSize": oProgressStatus.fileSize
 			};

 			aProgressStates.push(oProgress);
 			this._setState("/aProgressStates", aProgressStates);
 		},

 		onDetails: function () {
 			this.getRouter().navTo("Sync");
 		},

 		onExit: function () {
 			this.destroy();
 		}

 	});
 });