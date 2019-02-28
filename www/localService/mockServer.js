sap.ui.define([
	"sap/ui/core/util/MockServer",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (MockServer,models) {
	"use strict";
	return {
		init: function () {
			// create
			var oMockServer = new MockServer({
				rootUri: "/TGN_MANT/"
			});
			var oUriParameters = jQuery.sap.getUriParameters();
			// configure
			MockServer.config({
				autoRespond: true,
				autoRespondAfter: oUriParameters.get("serverDelay") || 1000
			});
			var sPath = jQuery.sap.getModulePath("ABMcontactos.TGN-ABMcontactos");
			oMockServer.simulate(sPath + "/localService/metadata.xml", sPath + "/localService/mockdata");
			// start
			oMockServer.start();
		}
	};
});