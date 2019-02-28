sap.ui.define([], function () {
	"use strict";
	return {
		getPath: function (oItem, oModel) {
			var sDestination = oModel.sServiceUrl.replace(/^\/+/g, '');
			return oItem.__metadata.uri.substring(oItem.__metadata.uri.indexOf(sDestination) + sDestination.length, oItem.__metadata.uri.length);
		},
		getMediaPath: function (oItem) {
			var sStoreMainService = "/store_mainService";
			return oItem.__metadata.media_src.substring(oItem.__metadata.media_src.indexOf(sStoreMainService) + sStoreMainService.length, oItem.__metadata
				.media_src.length);
		},
		// sEntityName : "VisitHead"
		sortProperties: function (oUnsortedObj, oModel, sEntityName) {
			var oSortedObj = {};
			var aEntityTypes = oModel.getServiceMetadata().dataServices.schema[0].entityType;
			var oEntityType = this.searchObjByProp(aEntityTypes, "name", sEntityName);

			var aKeysOrder = oEntityType.key.propertyRef;

			aKeysOrder.forEach(function (key) {
				oSortedObj[key.name] = oUnsortedObj[key.name];
			});

			return oSortedObj;
		},
		getEntityKeys: function (oModel, sEntityName) {
			var aEntityTypes = oModel.getServiceMetadata().dataServices.schema[0].entityType;
			var oEntityType = this.searchObjByProp(aEntityTypes, "name", sEntityName);

			var aKeysOrder = oEntityType.key.propertyRef;
			return aKeysOrder;
		},
		searchObjByProp: function (a, prop, value) {
			var aResults = a.filter(function (oItem) {
				return oItem[prop] === value;
			});
			return aResults[0];
		},
		isNumber: function (n) {
			return !isNaN(parseFloat(n)) && isFinite(n);
		},
		isEmpty: function (obj) {
			return (Object.keys(obj).length === 0 && obj.constructor === Object);
		},

		copyProperties: function (oSource, oTarget) {
			for (var k in oSource) oTarget[k] = oSource[k];
			return oTarget;
		},

		removeNullValues: function (object) {
			for (var property in object) {
				if (object[property] === null) delete object[property];
			}
			return object;
		},
		// "Attachment"
		removeKeyValues: function(oModel, sEntity, object){
			var aKeys = this.getEntityKeys(oModel, sEntity );
			for (var i = 0; i < aKeys.length; i++) {
				var oKey = aKeys[i];
				if (object.hasOwnProperty(oKey.name)) delete object[oKey.name];
			}
			return object;
		},
		removeDefNavigationProperties: function(object){
			for(var prop in object){
				if(object[prop] === null || object[prop].hasOwnProperty("__deferred")){
					delete object[prop];
				}
			}
			return object;
		}
	};
});