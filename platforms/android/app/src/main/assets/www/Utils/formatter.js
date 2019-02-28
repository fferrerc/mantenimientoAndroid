sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils"
], function (models, ObjectUtils, StringUtils) {
    "use strict";
	return {
		/*
		Estado Semáforo
		0 Gris (indica que un no se cargaron datos)
		1 Rojo (Se cargaron datos pero no esta totalmente completa la planilla)
		2 Amarillo (todos los datos de la planilla están completos pero la OT aun no fue cerrada)
		*/
		statusText1: function (iStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (iStatus) {
				case 0:
					return resourceBundle.getText("ml.noneState");
				case 1:
					return resourceBundle.getText("ml.errorState");
				case 2:
					return resourceBundle.getText("ml.noneState");
				default:
					return resourceBundle.getText("ml.noneState");
			}
		},
		statusText2: function (iStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (iStatus) {
				case 0:
					return resourceBundle.getText("ml.noneState");
				case 1:
					return resourceBundle.getText("ml.noneState");
				case 2:
					return resourceBundle.getText("ml.warningState");
				default:
					return resourceBundle.getText("ml.noneState");
			}
		},
		statusText3: function (iStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (iStatus) {
				case 0:
					return resourceBundle.getText("ml.noneState");
				case 1:
					return resourceBundle.getText("ml.noneState");
				case 2:
					return resourceBundle.getText("ml.noneState");
				default:
					return resourceBundle.getText("ml.noneState");
			}
		},
		formatPhone: function(sInternalValue){
			sInternalValue = sInternalValue || "";
			var sExternalValue = "";
			
			var aDigits = sInternalValue.split("");
			aDigits.forEach(function(sDigit,i){
				switch(i){
					case 0:
						sExternalValue = "+" + sDigit;
						break;
					case 1:
						sExternalValue += sDigit + " ";
						break;
					case 2:
						sExternalValue += sDigit + " ";
						break;
					case 4:
						sExternalValue += sDigit + " ";
						break;
					case 8:
						sExternalValue += sDigit + " ";
						break;
					default:
						sExternalValue += sDigit;
				}
			});
			
			return sExternalValue;
		},
		visitTypeColor: function (iType) {
            switch (iType) {
                case 1: //obligatoria
                    return "#E69A17";
                case 2://deseable
                    return "#666666";
                case 3://creada
                    return "#158000";
            }
        },
        visitTypeIcon: function (iType) {
            switch (iType) {
                case 1: //obligatoria
                    return "sap-icon://lightbulb";
                case 2://deseable
                    return "sap-icon://lightbulb";
                case 3://creada
                    return "sap-icon://sys-add";
            }
        },
        visitDone: function (iRealizationDate) {
            if (iRealizationDate) {return "X";} else {return "";}
        }
	};

});