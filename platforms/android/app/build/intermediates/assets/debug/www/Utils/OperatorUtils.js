sap.ui.define([], function () {
	"use strict";
	return {
		spreadify: function (oSet) {
			var aArray = [];
			oSet.forEach(function(sItem){
				aArray.push(sItem);
			});
			return aArray;
		}
	};
});