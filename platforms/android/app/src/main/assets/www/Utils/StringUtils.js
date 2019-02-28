sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils"
], function (ObjectUtils) {
	"use strict";

	return {
		getUID: function (oContext) {
			var sPath = oContext.getPath();
			var sRegExp = /\(([^)]+)\)/;
			var aMatches = sRegExp.exec(sPath);
			return aMatches[1];

		},
		// sEntitySetName : "VisitHeadSet"
		buildPath: function (sEntitySetName, oSortedArgs) {
			var iProperties = Object.keys(oSortedArgs).length,
				sPath = "/" + sEntitySetName + "(";
			if (iProperties > 1) {
				for (var key in oSortedArgs) {
					if (ObjectUtils.isNumber(oSortedArgs[key])) {
						sPath += key + "=" + oSortedArgs[key] + ",";
						// Check for empty, undefined or null
					} else if (!oSortedArgs[key]) {
						sPath += key + "='',";
					} else {
						sPath += key + "='" + oSortedArgs[key] + "',";
					}
				}
				//Remove last comma
				sPath = sPath.replace(/,\s*$/, "");
				sPath += ")";
				sPath = encodeURI(sPath);
				return sPath;
			} else {
				for (var key in oSortedArgs) {
				if (ObjectUtils.isNumber(oSortedArgs[key])) {
					sPath += oSortedArgs[key];
				} else {
					sPath += "'" + oSortedArgs[key] + "'";
				}
				}
				sPath += ")";
				sPath = encodeURI(sPath);
				return sPath;
			}

		},

		generateId: function () {
			return jQuery.sap.uid();
		},

		getFileExtension: function (fileName) {
			return fileName.split('.').pop();

		},
		pad: function (num, size) {
			var s = num + "";
			while (s.length < size) s = "0" + s;
			return s;
		}
	};
});