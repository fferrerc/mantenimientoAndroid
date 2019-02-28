sap.ui.define([
	"sap/ui/model/odata/type/Int",
	'sap/ui/model/FormatException', 
	'sap/ui/model/ParseException', 
	"sap/ui/model/ValidateException",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils"
], function (Int,FormatException,ParseException,ValidateException,models,StringUtils) {
	"use strict";
	
	var oRange = {minimum : -2147483648, maximum : 2147483647};
	
	var Int8 = Int.extend("ABMcontactos.TGN-ABMcontactos.custom.dataTypes.Int8", {
		
		constructor : function () {
				Int.apply(this, arguments);
		},
		/* Order in which these 3 methods are triggered by the framework is 
		parseValue() -> validateValue() -> formatValue().*/
		
		/*
		This method receives the user’s input as a parameter. 
		This method’s job is to convert the user’s value (external value) into a suitable internal 
		representation of the value (internal value)
		*/
		parseValue: function(sExternalValue,sInternalType){
			var sInternalValue = Int.parseValue(sExternalValue,sInternalType);
			sInternalValue = StringUtils.pad(sInternalValue,7);
			return sInternalValue;
		},
		/*
		This method receives the parsed value (that is, the internal representation of the value 
		as determined by the parseValue method) and must decide whether or not the value is valid. 
		If the input is determined to be invalid, an exception of type sap.ui.model.ValidateException 
		should be thrown from within this method.
		*/
		validateValue: function(sInternalValue){
			try{
				Int.validateValue(sInternalValue);
			}catch(e){
				var oBundle = models.getModel("i18nErrors").getResourceBundle();
				var sErrorMessage = oBundle.getText("emptyInputFailure");
				throw new ValidateException(sErrorMessage);
			}
		},
		/*
		This method receives the parsed value (internal value) as a parameter and must return a 
		formatted value (that is, a corresponding external value). This formatted value is displayed 
		on the UI.
		*/
		formatValue: function(sInternalValue,sInternalType){
			return sInternalValue;
		}
		
	});
	
	Int8.prototype.getName = function () {
		return "ABMcontactos.TGN-ABMcontactos.custom.dataTypes.Int8";
	};
	
	Int8.prototype.getRange = function () {
		return oRange;
	};
	
	return Int8;

});