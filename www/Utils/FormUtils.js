sap.ui.define([
	"sap/ui/layout/form/FormElement",
	"sap/m/Label",
	"sap/m/Input"
	], function (FormElement, Label, Input) {
	"use strict";
	return {
		buildForm: function (oFormContainer, oObject) {
			oFormContainer.destroyFormElements();
			for (var prop in oObject) {
				if (!prop.includes("__") && !oObject[prop].hasOwnProperty("__deferred") && oObject[prop] !== null) {
					var oFormElement = new FormElement();
					var oLabel = new Label({
						text: prop
					});
					var oField = new Input({
						value: oObject[prop]
					});
					oFormElement.setLabel(oLabel);
					oFormElement.addField(oField);
					oFormContainer.addFormElement(oFormElement);
				}
			}

		}

	};

});