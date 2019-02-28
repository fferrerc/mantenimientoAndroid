/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/odata/MetadataAnalyser','./ControlProvider','sap/ui/comp/util/FormatUtil','sap/ui/Device'],function(M,C,F,D){"use strict";var T=function(p){if(p){this._oParentODataModel=p.model;this.sEntitySet=p.entitySet;this._sIgnoredFields=p.ignoredFields;this._sInitiallyVisibleFields=p.initiallyVisibleFields;this.isEditableTable=p.isEditableTable;this._smartTableId=p.smartTableId;this._isAnalyticalTable=p.isAnalyticalTable;this._isMobileTable=p.isMobileTable;this.useSmartField=p.useSmartField;this.useSmartToggle=p.useSmartToggle;this._bSkipAnnotationParse=p.skipAnnotationParse==="true";this._sLineItemQualifier=p.lineItemQualifier;this._sPresentationVariantQualifier=p.presentationVariantQualifier;this.enableInResultForLineItem=p.enableInResultForLineItem==="true";this._oSemanticKeyAdditionalControl=p._semanticKeyAdditionalControl;try{this._oDateFormatSettings=p.dateFormatSettings?JSON.parse(p.dateFormatSettings):undefined;this._oCurrencyFormatSettings=p.currencyFormatSettings?JSON.parse(p.currencyFormatSettings):undefined;this._oDefaultDropDownDisplayBehaviour=p.defaultDropDownDisplayBehaviour;}catch(e){}}if(!this._oDateFormatSettings){this._oDateFormatSettings={};}if(!this._oDateFormatSettings.hasOwnProperty("UTC")){this._oDateFormatSettings["UTC"]=true;}this._aODataFieldMetadata=[];this._aTableViewMetadata=[];this._aIgnoredFields=[];this._aInitiallyVisibleFields=[];this._oMetadataAnalyser=new M(this._oParentODataModel);this._oSemanticObjectController=p.semanticObjectController;this._intialiseMetadata();};T.prototype._intialiseMetadata=function(){var t=[],c=-1,i,l,f,o,s,S,a;this._aODataFieldMetadata=this._oMetadataAnalyser.getFieldsByEntitySetName(this.sEntitySet);a=this._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.sEntitySet);if(!this._bSkipAnnotationParse){this._oPresentationVariant=this._oMetadataAnalyser.getPresentationVariantAnnotation(a,this._sPresentationVariantQualifier);if(this._oPresentationVariant){this._oLineItemAnnotation=this._oPresentationVariant.lineItemAnnotation;}if(!this._oLineItemAnnotation){this._oLineItemAnnotation=this._oMetadataAnalyser.getLineItemAnnotation(a,this._sLineItemQualifier);}}if(this._isMobileTable){this._oSemanticKeyAnnotation=this._oMetadataAnalyser.getSemanticKeyAnnotation(a);}if(!this._isAnalyticalTable){this._addLineItemNavigationFields(a);}S=this._oMetadataAnalyser.getEntityContainerAttribute("supported-formats");if(S){this._bSupportsExcelExport=S.indexOf("xlsx")>-1;}if(!this._oDefaultDropDownDisplayBehaviour){this._oDefaultDropDownDisplayBehaviour=this._oMetadataAnalyser.getTextArrangementValue(a);}this._generateArrays();this._oControlProvider=new C({metadataAnalyser:this._oMetadataAnalyser,model:this._oParentODataModel,fieldsMetadata:this._aODataFieldMetadata,lineItemAnnotation:this._oLineItemAnnotation,semanticKeyAnnotation:this._oSemanticKeyAnnotation,_semanticKeyAdditionalControl:this._oSemanticKeyAdditionalControl,isMobileTable:this._isMobileTable,isAnalyticalTable:this._isAnalyticalTable,smartTableId:this._smartTableId,dateFormatSettings:this._oDateFormatSettings,currencyFormatSettings:this._oCurrencyFormatSettings,defaultDropDownDisplayBehaviour:this._oDefaultDropDownDisplayBehaviour,useSmartField:this.useSmartField,useSmartToggle:this.useSmartToggle,enableDescriptions:true,entitySet:this.sEntitySet,semanticObjectController:this._oSemanticObjectController});this._oFieldSemanticObjectMap={};if(this._aODataFieldMetadata){l=this._aODataFieldMetadata.length;}for(i=0;i<l;i++){f=this._aODataFieldMetadata[i];if(this._aIgnoredFields.indexOf(f.name)>-1||!f.visible){continue;}if(f.type.indexOf("Edm.")===0){o=this._oControlProvider.getFieldViewMetadata(f,this.isEditableTable);this._enrichWithTableViewMetadata(o,c++);t.push(o);if(o.semanticObject){this._oFieldSemanticObjectMap[o.name]=o.semanticObject;}}}s=function(b,d){return b.index-d.index;};this._aTableViewMetadata=t.sort(s);if(this._isAnalyticalTable&&this._mDimensionFromText){this._aTableViewMetadata.forEach(function(b){var d=this._mDimensionFromText[b.name];if(d&&b.aggregationRole!=="dimension"){if(!b.additionalProperty){b.additionalProperty=d;}else{b.additionalProperty+=","+d;}}}.bind(this));}};T.prototype._addLineItemNavigationFields=function(f){var a,l,s,o;if(this._aODataFieldMetadata&&this._oLineItemAnnotation){a=this._oLineItemAnnotation.fields;if(a){l=a.length;}while(l--){s=a[l];if(s&&s.indexOf("/")>=0){o=this._oMetadataAnalyser.extractNavigationPropertyField(s,this.sEntitySet);if(o){o.name=o.parentPropertyName+"/"+o.name;if(o.description){o.description=o.parentPropertyName+"/"+o.description;}if(o.unit){o.unit=o.parentPropertyName+"/"+o.unit;}this._aODataFieldMetadata.push(o);}}}}};T.prototype.getFieldSemanticObjectMap=function(){return this._oFieldSemanticObjectMap;};T.prototype.getTableViewMetadata=function(){return this._aTableViewMetadata;};T.prototype.getSupportsExcelExport=function(){return this._bSupportsExcelExport;};T.prototype.getIsUTCDateHandlingEnabled=function(){return this._oDateFormatSettings?this._oDateFormatSettings.UTC:false;};T.prototype.getRequestAtLeastFields=function(){return(this._oPresentationVariant&&this._oPresentationVariant.requestAtLeastFields)?this._oPresentationVariant.requestAtLeastFields:[];};T.prototype._generateArrays=function(){if(this._sIgnoredFields){this._aIgnoredFields=this._sIgnoredFields.split(",");}if(this._sInitiallyVisibleFields){this._aInitiallyVisibleFields=this._sInitiallyVisibleFields.split(",");}};T.prototype._enrichWithTableViewMetadata=function(f,c){var a=[],n=[],p,l;var e=function(P){var N,t;if(P&&P.indexOf("/")>-1){t=P.split("/");t.pop();N=t.join("/");}return N;};this._updateLabel(f);f.isInitiallyVisible=this._isInitiallyVisible(f);f.index=this._getIndex(f,c);f.width=F.getWidth(f);if(f.isMeasureField&&f.unit){a.push(f.unit);}else if(f.description){a.push(f.description);}if(f.criticality){a.push(f.criticality);}if(f.criticalityRepresentation){a.push(f.criticalityRepresentation);}if(f.linkProperties&&f.linkProperties.length){a=a.concat(f.linkProperties);}if(f.fieldControlProperty){a.push(f.fieldControlProperty);}l=a.length;if(l){f.additionalProperty=a.join(",");while(l--){p=e(a[l]);if(p){n.push(p);}}}if(f.parentPropertyName){n.push(f.parentPropertyName);}f.navigationProperty=n.join(",");this._setSortOrder(f);if(this._isAnalyticalTable){f.summed=f.aggregationRole==="measure";this._setInResult(f);this._setGroupBy(f);this._mapDimensionFromTextProperty(f);}};T.prototype._isInitiallyVisible=function(f){var i=false;if(this._oLineItemAnnotation&&this._oLineItemAnnotation.fields){i=this._oLineItemAnnotation.fields.indexOf(f.name)>-1;if(i&&!D.system.desktop){var I=this._getFieldImportance(f);if(I){if(D.system.tablet){i=I==="High"||I==="Medium";}else if(D.system.phone){i=I==="High";}}}}if(!i&&this._aInitiallyVisibleFields){i=this._aInitiallyVisibleFields.indexOf(f.name)>-1;}return i;};T.prototype._setInResult=function(f){if(this._oPresentationVariant){if(this._oPresentationVariant.requestAtLeastFields&&this._oPresentationVariant.requestAtLeastFields.indexOf(f.name)>-1){f.inResult=true;}}else if(this.enableInResultForLineItem){if(this._oLineItemAnnotation&&this._oLineItemAnnotation.fields&&this._oLineItemAnnotation.fields.indexOf(f.name)>-1){f.inResult=true;}}};T.prototype._setSortOrder=function(f){var l;if(this._oPresentationVariant&&this._oPresentationVariant.sortOrderFields){l=this._oPresentationVariant.sortOrderFields.length;for(var i=0;i<l;i++){if(this._oPresentationVariant.sortOrderFields[i].name===f.name){f.sorted=true;f.sortOrder=this._oPresentationVariant.sortOrderFields[i].descending?"Descending":"Ascending";break;}}}};T.prototype._setGroupBy=function(f){if(this._oPresentationVariant&&this._oPresentationVariant.groupByFields&&this._oPresentationVariant.groupByFields.indexOf(f.name)>=0){f.grouped=true;}};T.prototype._getFieldImportance=function(f){var r=null;if(this._oLineItemAnnotation&&this._oLineItemAnnotation.importance){r=this._oLineItemAnnotation.importance[f.name];}return r;};T.prototype._mapDimensionFromTextProperty=function(f){if(!f.description||f.aggregationRole!=="dimension"){return;}if(!this._mDimensionFromText){this._mDimensionFromText={};}this._mDimensionFromText[f.description]=f.name;};T.prototype._getIndex=function(f,c){var i=-1,l=0,I=0;if(this._oLineItemAnnotation&&this._oLineItemAnnotation.fields){l=this._oLineItemAnnotation.fields.length;i=this._oLineItemAnnotation.fields.indexOf(f.name);}if(i<0&&this._aInitiallyVisibleFields){I=this._aInitiallyVisibleFields.length;i=this._aInitiallyVisibleFields.indexOf(f.name);if(i>-1){i+=l;}}if(i>-1){return i;}return c+l+I;};T.prototype._updateLabel=function(f){var l;if(this._oLineItemAnnotation&&this._oLineItemAnnotation.labels){l=this._oLineItemAnnotation.labels[f.name];}if(l){f.label=l;if(f.template&&f.template.setSemanticObjectLabel){f.template.setSemanticObjectLabel(f.label);}}};T.prototype.destroy=function(){if(this._oMetadataAnalyser&&this._oMetadataAnalyser.destroy){this._oMetadataAnalyser.destroy();}this._oMetadataAnalyser=null;if(this._oControlProvider&&this._oControlProvider.destroy){this._oControlProvider.destroy();}this._mDimensionFromText=null;this._oControlProvider=null;this._aODataFieldMetadata=null;this._aTableViewMetadata=null;this._aIgnoredFields=null;this._aInitiallyVisibleFields=null;this._sIgnoredFields=null;this._sInitiallyVisibleFields=null;this.bIsDestroyed=true;};return T;},true);
