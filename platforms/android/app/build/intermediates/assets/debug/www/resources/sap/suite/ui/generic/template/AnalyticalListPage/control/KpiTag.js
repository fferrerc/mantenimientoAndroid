sap.ui.define(["sap/ui/core/Control","sap/suite/ui/generic/template/AnalyticalListPage/controller/KpiTagController","sap/ui/core/library"],function(C,K,S){"use strict";return C.extend("sap.suite.ui.generic.template.AnalyticalListPage.control.KpiTag",{metadata:{properties:{value:{type:"string",defaultValue:"",bindable:"bindable"},shortDescription:{type:"string",defaultValue:"",bindable:"bindable"},unit:{type:"string",defaultValue:"",bindable:"bindable"},indicator:{type:"sap.m.ValueColor",defaultValue:undefined},enabled:{type:"boolean",defaultValue:true,bindable:false},error:{type:"boolean",defaultValue:false,bindable:false},errorType:{type:"sap.ui.core.MessageType",defaultValue:S.MessageType.Error},errorMessage:{type:"string",defaultValue:"",bindable:"bindable"}},events:{press:{}}},renderer:{render:function(r,c){r.write("<div");if(c.getProperty("enabled")){r.writeAttributeEscaped("tabIndex",0);}else{r.writeAttributeEscaped("tabIndex",-1);}r.writeControlData(c);r.addClass("sapSmartTemplatesAnalyticalListPageKpiTag sapSmartTemplatesAnalyticalListPageKpiTagCozy sapUiSmallMarginEnd");c._addColorClasses(r);r.writeClasses();r.writeAccessibilityState(c,{label:c._getAriaLabelText(c._ariaLabel)});r.writeAttributeEscaped("title",c.getTooltip());r.write(">");r.write("<div");r.addClass("sapSmartTemplatesAnalyticalListPageKpiTagName");r.writeClasses();r.write(">");r.writeEscaped(c.getShortDescription());r.write("</div>");if(c.getProperty("error")){r.write("<div");r.addClass(c._getIconColor());r.writeClasses();r.write(">");r.writeIcon(c._getIcon());}else{r.write("<div");r.addClass("sapSmartTemplatesAnalyticalListPageKpiTagValue");r.writeClasses();r.write(">");r.writeEscaped(c.getValue()+(c.getUnit()&&c.getUnit()!==" "?" "+c.getUnit():""));}r.write("</div>");r.write("</div>");}},_getIcon:function(){switch(this.getProperty("errorType")){case S.MessageType.Error:return"sap-icon://message-error";case S.MessageType.Warning:return"sap-icon://message-warning";default:return"sap-icon://message-error";}},_getIconColor:function(){switch(this.getProperty("errorType")){case S.MessageType.Error:return"sapSmartTemplatesAnalyticalListPageKPIErrorIcon";case S.MessageType.Warning:return"sapSmartTemplatesAnalyticalListPageKPIWarningIcon";default:return"sapSmartTemplatesAnalyticalListPageKPIErrorIcon";}},setEnabled:function(v){this.setProperty("enabled",v,true);if(v){this.removeStyleClass("sapSmartTemplatesAnalyticalListPageKpiTagDisable");}else{this.addStyleClass("sapSmartTemplatesAnalyticalListPageKpiTagDisable");}},_getAriaLabelText:function(k){var r=this.getModel("i18n").getResourceBundle();return r.getText("KPI_ARIALABEL_TAG",[k]);},_addColorClasses:function(r){switch(this.getIndicator()){case sap.m.ValueColor.Neutral:r.addClass("sapSmartTemplatesAnalyticalListPageKPINeutral");break;case sap.m.ValueColor.Error:r.addClass("sapSmartTemplatesAnalyticalListPageKPINegative");break;case sap.m.ValueColor.Good:r.addClass("sapSmartTemplatesAnalyticalListPageKPIPositive");break;case sap.m.ValueColor.Critical:r.addClass("sapSmartTemplatesAnalyticalListPageKPICritical");break;default:r.addClass("sapSmartTemplatesAnalyticalListPageKPINeutral");break;}}});},true);
