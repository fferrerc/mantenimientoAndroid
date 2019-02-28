sap.ui.define([
	"sap/ui/model/odata/type/ODataType",
	'sap/ui/model/FormatException', 
	'sap/ui/model/ParseException', 
	"sap/ui/model/ValidateException",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/formatter"
], function (ODataType,FormatException,ParseException,ValidateException,models,formatter) {
	"use strict";
	
	return ODataType.extend("ABMcontactos.TGN-ABMcontactos.custom.dataTypes.phone", {
		/* Order in which these 3 methods are triggered by the framework is 
		parseValue() -> validateValue() -> formatValue().*/
		
		/*
		This method receives the user’s input as a parameter. 
		This method’s job is to convert the user’s value (external value) into a suitable internal 
		representation of the value (internal value)
		*/
		parseValue: function(sExternalValue,sInternalType){
			return sExternalValue.replace(/-/g,"").replace(/ /g, "").replace(/\(/g,"").replace(/\)/g, "").replace(/\+/g, "");
		},
		/*
		This method receives the parsed value (that is, the internal representation of the value 
		as determined by the parseValue method) and must decide whether or not the value is valid. 
		If the input is determined to be invalid, an exception of type sap.ui.model.ValidateException 
		should be thrown from within this method.
		*/
		validateValue: function(sInternalValue){
			if(sInternalValue === "") return;
			sInternalValue = sInternalValue.replace(/\D+/,"");
			var rValidation = /^(?:(?:00)?549?)?0?(?:11|[2368]\d)(?:(?=\d{0,2}15)\d{2})??\d{8}$/;
			
			var isValid = rValidation.test(sInternalValue);
	        if (isValid === false) {
	        	var oBundle = models.getModel("i18nErrors").getResourceBundle();
				var sErrorMessage = oBundle.getText("phoneValidationFailure");
				throw new ValidateException(sErrorMessage);
	        }
		},
		/*
		This method receives the parsed value (internal value) as a parameter and must return a 
		formatted value (that is, a corresponding external value). This formatted value is displayed 
		on the UI.
		*/
		/*input 5491112345678 
		        0123456789012
		 output +54 9 11 65375107
		*/
		formatValue: function(sInternalValue,sInternalType){
			return formatter.formatPhone(sInternalValue);
		}
		
	});
});