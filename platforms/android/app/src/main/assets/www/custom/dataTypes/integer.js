sap.ui.define([
	"sap/ui/model/odata/type/ODataType",
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	'sap/ui/model/ValidateException',
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (ODataType, FormatException, ParseException, ValidateException, models) {
	"use strict";

	return ODataType.extend("ABMcontactos.TGN-ABMcontactos.custom.dataTypes.integer", {
		/* Order in which these 3 methods are triggered by the framework is 
		parseValue() -> validateValue() -> formatValue().*/

		/*
		This method receives the user’s input as a parameter. 
		This method’s job is to convert the user’s value (external value) into a suitable internal 
		representation of the value (internal value)
		*/
		parseValue: function (sExternalValue, sInternalType) {
			return sExternalValue;
		},
		/*
		This method receives the parsed value (that is, the internal representation of the value 
		as determined by the parseValue method) and must decide whether or not the value is valid. 
		If the input is determined to be invalid, an exception of type sap.ui.model.ValidateException 
		should be thrown from within this method.
		*/
		validateValue: function (sInternalValue) {
			// Let empty string pass.
			if (sInternalValue === "") return;

			var rValidation = /^-?\d*\.?\d*$/;

			var bValid = rValidation.test(sInternalValue);
			if (bValid === false) {
				var oBundle = models.getModel("i18nErrors").getResourceBundle();
				var sErrorMessage = oBundle.getText("integerValidationFailure");
				throw new ValidateException(sErrorMessage);
			}
		},
		/*
		This method receives the parsed value (internal value) as a parameter and must return a 
		formatted value (that is, a corresponding external value). This formatted value is displayed 
		on the UI.
		*/
		formatValue: function (sInternalValue, sInternalType) {
			sInternalValue = sInternalValue || "";
			var sExternalValue = sInternalValue;
			return sExternalValue;
		}

	});
});