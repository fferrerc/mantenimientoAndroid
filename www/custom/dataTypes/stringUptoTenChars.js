sap.ui.define([
	"sap/ui/model/odata/type/ODataType",
	'sap/ui/model/FormatException',
	'sap/ui/model/ParseException',
	"sap/ui/model/ValidateException",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"sap/ui/model/type/String"
], function (ODataType, FormatException, ParseException, ValidateException, models, StringType) {
	"use strict";
	var rDigitsOnly = /^\d+$/,
		rLeadingZeros = /^0*(?=\d)/;
	return ODataType.extend("ABMcontactos.TGN-ABMcontactos.custom.dataTypes.stringUptoTenChars", {
		constructor: function (oFormatOptions, oConstraints) {
			ODataType.apply(this, arguments);
			this.setConstraints(this, oConstraints);
		},
		/* Order in which these 3 methods are triggered by the framework is 
		parseValue() -> validateValue() -> formatValue().*/

		/*
		This method receives the user’s input as a parameter. 
		This method’s job is to convert the user’s value (external value) into a suitable internal 
		representation of the value (internal value)
		*/
		parseValue: function (sExternalValue, sInternalType) {

			sExternalValue = sExternalValue === "" ? null : StringType.prototype.parseValue.apply(this, arguments);

			if (this.isDigitSequence(sExternalValue, this.oConstraints)) {
				sExternalValue = sExternalValue.replace(rLeadingZeros, "");
				if (this.oConstraints.maxLength) {
					sExternalValue = sExternalValue.padStart(this.oConstraints.maxLength, "0");
				}
			} else if (sExternalValue) {
				if (this.oConstraints) {
					sExternalValue = sExternalValue.substring(0, this.oConstraints.maxLength);
				}
			}
			return sExternalValue;
		},
		/*
		This method receives the parsed value (that is, the internal representation of the value 
		as determined by the parseValue method) and must decide whether or not the value is valid. 
		If the input is determined to be invalid, an exception of type sap.ui.model.ValidateException 
		should be thrown from within this method.
		*/
		validateValue: function (sInternalValue) {

			var oConstraints = this.oConstraints || {},
				iMaxLength = oConstraints.maxLength;
			if (sInternalValue) {
				if (sInternalValue.length > iMaxLength) {
					var oBundle = models.getModel("i18nErrors").getResourceBundle();
					var sErrorMessage = jQuery.sap.formatMessage(oBundle.getText("stringTooLong"), iMaxLength);
					throw new ValidateException(sErrorMessage);
				}
			}

		},
		/*
		This method receives the parsed value (internal value) as a parameter and must return a 
		formatted value (that is, a corresponding external value). This formatted value is displayed 
		on the UI.
		*/
		formatValue: function (sInternalValue, sInternalType) {
			return sInternalValue;
		},
		/**
		 * Sets the constraints.
		 *
		 * @param {sap.ui.model.odata.type.String} oType
		 *   the type instance
		 * @param {object} [oConstraints]
		 *   constraints, see {@link #constructor}
		 */
		setConstraints: function (oType, oConstraints) {
			var vIsDigitSequence, vMaxLength, vNullable;

			oType.oConstraints = undefined;
			if (oConstraints) {
				vMaxLength = oConstraints.maxLength;
				if (typeof vMaxLength === "string") {
					vMaxLength = parseInt(vMaxLength,10);
				}
				if (typeof vMaxLength === "number" && !isNaN(vMaxLength) && vMaxLength > 0) {
					oType.oConstraints = {
						maxLength: vMaxLength
					};
				} else if (vMaxLength !== undefined) {
					jQuery.sap.log.warning("Illegal maxLength: " + oConstraints.maxLength, null, oType.getName());
				}
				vIsDigitSequence = oConstraints.isDigitSequence;
				if (vIsDigitSequence === true || vIsDigitSequence === "true") {
					oType.oConstraints = oType.oConstraints || {};
					oType.oConstraints.isDigitSequence = true;
				} else if (vIsDigitSequence !== undefined && vIsDigitSequence !== false && vIsDigitSequence !== "false") {
					jQuery.sap.log.warning("Illegal isDigitSequence: " + vIsDigitSequence, null, oType.getName());
				}

				vNullable = oConstraints.nullable;
				if (vNullable === false || vNullable === "false") {
					oType.oConstraints = oType.oConstraints || {};
					oType.oConstraints.nullable = false;
				} else if (vNullable !== undefined && vNullable !== true && vNullable !== "true") {
					jQuery.sap.log.warning("Illegal nullable: " + vNullable, null, oType.getName());
				}
			}
		},

		/**
		 * Checks whether isDigitSequence constraint is set to true and the given value is a digit
		 * sequence.
		 *
		 * @param {string} [sValue]
		 *   the value to be checked
		 * @param {object} [oConstraints]
		 *   the currently used constraints
		 * @returns {boolean}
		 *   true if isDigitSequence is set to true and the given value is a digit sequence
		 */
		isDigitSequence: function (sValue, oConstraints) {
			return oConstraints && oConstraints.isDigitSequence && sValue && sValue.match(rDigitsOnly);
		}

	});
});