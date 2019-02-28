/* global fiori_client_appConfig,route,mobile_appRoutes,store,navigator */

/* hybrid capacity bootstrap
 *
 * This has to happen after sapui5 bootstrap, and before first application page is loaded.
 */

sap.hybrid = {
	loadCordova: false,

	setCordova: function () {
		sap.hybrid.loadCordova = true;
	},
	
	packUrl: function (url, route) {
		var connection = ((route.common ? "services/" : fiori_client_appConfig.appID + "_") + route.destination).substr(0, 63); // max length cap by SCPms DB
		var path = url.substring(route.path.endsWith("/") ? route.path.length - 1 : route.path.length);
		return "/" + connection + (route.entryPath ? route.entryPath : "") + path;
	},

	appLogon: function (appConfig) {
		var context = {};
		var url = appConfig.fioriURL;
		if (url && (url.indexOf("https://") === 0 || url.indexOf("http://") === 0)) {
			if (url.indexOf("https://") === 0) {
				context.https = true;
				url = url.substring("https://".length);
			} else {
				context.https = false;
				url = url.substring("http://".length);
			}

			if (url.indexOf("?") >= 0) {
				url = url.substring(0, url.indexOf("?"));
			}
			if (url.indexOf("/") >= 0) {
				url = url.split("/")[0];
			}
			if (url.indexOf(":") >= 0) {
				context.serverHost = url.split(":")[0];
				context.serverPort = url.split(":")[1];
			}
		}

		// set auth element
		if (appConfig.auth) {
			context.auth = appConfig.auth;
		}

		// If communicatorId is set then use it to be compatible with existing values. Otherwise, use the default "REST". 
		// By doing so logon core does not need to send ping request to server root URL, which will cause authentication issue. 
		// It occurs when the root URL uses a different auth method from the application's endpoint URL, as application can only handle authentication on its own endpoint URL.
		context.communicatorId = appConfig.communicatorId ? appConfig.communicatorId : "REST";

		if ("serverHost" in context && "serverPort" in context && "https" in context) {
			// start SCPms logon
			sap.hybrid.kapsel.doLogonInit(context, appConfig.appID, sap.hybrid.openStore);
		} else {
			console.error("context data for logon are not complete");
		}
	},

	bootStrap: function () {
		if (sap.hybrid.loadCordova) {
			// bind to Cordova event
			document.addEventListener("deviceready", function () {
				// check if app configuration is available
				if (fiori_client_appConfig && fiori_client_appConfig.appID && fiori_client_appConfig.fioriURL) {
					sap.hybrid.appLogon(fiori_client_appConfig);
				} else {
					console.log("Can't find app configuration probably due to a missing appConfig.js from the app binary.");
				};
			}, false);
		} else {
			console.error("cordova is not loaded");
		}
	},

	loadComponent: function (componentName) {
		sap.ui.getCore().attachInit(function () {
			// not support sap.ushell navigation
			sap.ui.require([
				"sap/m/Shell",
				"sap/ui/core/ComponentContainer"
			], function (Shell, ComponentContainer) {
				// initialize the UI component
				new Shell({
					app: new ComponentContainer({
						height: "100%",
						name: componentName
					})
				}).placeAt("content");
			});
		});
	},

	openStore: function () {
		// Set log level to debug.
		//sap.Logger.setLogLevel(sap.Logger.DEBUG);

		console.log("In openStore");
		jQuery.sap.require("sap.ui.thirdparty.datajs"); //Required when using SAPUI5 and the Kapsel Offline Store
		var mobile_appRoute = mobile_appRoutes.find(function (oDest) {
			return oDest.destination === "TGN_MANT";
		});

		var properties = {
			"name": "store_mainService",
			"host": sap.hybrid.kapsel.appContext.registrationContext.serverHost,
			"port": sap.hybrid.kapsel.appContext.registrationContext.serverPort,
			"https": sap.hybrid.kapsel.appContext.registrationContext.https,
			"serviceRoot": fiori_client_appConfig.appID + "_" + mobile_appRoute.destination,

			"definingRequests": {
				"workorderset": "/WorkOrderSet",
				"visitheadset": "/VisitHeadSet",
				"visitdetailset": "/VisitDetailSet",
				"recipientset": "/RecipientSet",
				"contactset": "/ContactSet",
				"comboset": "/ComboSet",
				"attachmentset": {
					"url": "/AttachmentSet",
					"retrieveStreams": true
				}
			},
			"serverSupportsBind": false

		};

		store = sap.OData.createOfflineStore(properties);

		var openStoreSuccessCallback = function () {
			console.log("In openStoreSuccessCallback");
			sap.OData.applyHttpClient(); //Offline OData calls can now be made against datajs.
			sap.hybrid.startApp();
		}

		var openStoreErrorCallback = function (error) {
			console.log("In openStoreErrorCallback");
			alert("An error occurred" + JSON.stringify(error));
		}
		var options = {
			"autoRefresh": false, //enables automatic refresh when the application enters foreground     
			"autoFlush": false //enables automatic flush when the application goes into the background 
		};
		store.open(openStoreSuccessCallback, openStoreErrorCallback, options, sap.hybrid.progressCallback);
	},
	refreshStore: function () {
		console.log("Offline events: refreshStore");
		if (!store) {
			console.log("The store must be open before it can be refreshed");
			return;
		}
		store.refresh(sap.hybrid.refreshStoreCallback, sap.hybrid.refreshStoreErrorCallback, null, sap.hybrid.progressCallback);
	},

	refreshStoreCallback: function () {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("refreshSucceded", "Offline events: refreshStoreCallback");
	},

	refreshStoreErrorCallback: function (error) {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("refreshFailed", "Offline events: refreshStoreError");
		alert("An error occurred: " + JSON.stringify(error));
		//sap.Logger.upload();
	},

	flushStore: function () {
		console.log("Offline events: flushStore");
		if (!store) {
			console.log("The store must be open before it can be flushed");
			return;
		}
		// flush(success, error, progressopt)
		store.flush(sap.hybrid.flushStoreCallback, sap.hybrid.flushStoreErrorCallback, sap.hybrid.progressCallback);
	},

	flushStoreCallback: function () {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("flushSucceded", "Offline events: flushStoreCallback");
	},

	flushStoreErrorCallback: function (error) {
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("flushFailed", "Offline events: flushStoreError");
	},

	progressCallback: function (progressStatus) {
		// console.log("Offline events: progressCallback");
		var oEventBus = sap.ui.getCore().getEventBus();
		oEventBus.publish("updateSyncProgress", progressStatus);
	},

	isOnline: function () {
		return navigator.onLine || false;
	}
};