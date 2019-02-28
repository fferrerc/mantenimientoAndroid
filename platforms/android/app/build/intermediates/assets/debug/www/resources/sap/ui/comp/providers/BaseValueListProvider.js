/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/thirdparty/jquery','sap/ui/comp/library','sap/ui/base/EventProvider','sap/ui/comp/odata/ODataType','sap/ui/comp/odata/MetadataAnalyser','sap/ui/comp/util/FormatUtil','sap/base/Log'],function(q,l,E,O,M,F,L){"use strict";var D=l.smartfilterbar.DisplayBehaviour;var A=l.ANALYTICAL_PARAMETER_PREFIX;var B=E.extend("sap.ui.comp.providers.BaseValueListProvider",{constructor:function(p){E.call(this);this.sFieldName=p.fieldName;this.oControl=p.control;this.oODataModel=p.model;this.oFilterModel=p.filterModel;this.oFilterProvider=p.filterProvider;this.sDisplayFormat=p.displayFormat;this._oDateFormatSettings=p.dateFormatSettings;this._fieldViewMetadata=p.fieldViewMetadata;this.sValueListEntitySetName=null;if(!this._oDateFormatSettings){this._oDateFormatSettings={};}if(!this._oDateFormatSettings.hasOwnProperty("UTC")){this._oDateFormatSettings["UTC"]=true;}this.bResolveInOutParams=(p.resolveInOutParams===false)?false:true;this.sDisplayBehaviour=p.displayBehaviour;this.sDDLBDisplayBehaviour=this.sDisplayBehaviour;if(!this.sDDLBDisplayBehaviour||this.sDDLBDisplayBehaviour===D.auto){this.sDDLBDisplayBehaviour=this.oFilterProvider?this.oFilterProvider.sDefaultDropDownDisplayBehaviour:D.descriptionOnly;}this.sPropertyTypePath="";if(this.bResolveInOutParams&&!this.oFilterModel&&!this.oFilterProvider){this._resolvePropertyPath();}if(p.loadAnnotation&&p.fullyQualifiedFieldName){this._oMetadataAnalyser=p.metadataAnalyser;this._sFullyQualifiedFieldName=p.fullyQualifiedFieldName;this._attachAnnotationLoadOnRender();}else{this._onAnnotationLoad({primaryValueListAnnotation:p.annotation,additionalAnnotations:p.additionalAnnotations});}}});B.prototype._attachAnnotationLoadOnRender=function(){this.oBeforeRenderingEventDelegate={onBeforeRendering:function(){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate,this);delete this.oBeforeRenderingEventDelegate;if(!this._bValueListRequested){if(this.bInitialised){if(this._onMetadataInitialised&&this.sAggregationName&&!this.bTypeAheadEnabled&&this.oControl.$()){this._onMetadataInitialised();}}else{this._loadAnnotation();}}}};this.oControl.addEventDelegate(this.oBeforeRenderingEventDelegate,this);};B.prototype.loadAnnotation=function(){if(this.oBeforeRenderingEventDelegate){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate,this);delete this.oBeforeRenderingEventDelegate;}if(this.oAfterRenderingEventDelegate){this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate,this);delete this.oAfterRenderingEventDelegate;}this._loadAnnotation();};B.prototype._loadAnnotation=function(){if(!this._bValueListRequested){this._bValueListRequested=true;if(!this._oMetadataAnalyser){this._oMetadataAnalyser=new M(this.oODataModel);this._bCleanupMetadataAnalyser=true;}this._oMetadataAnalyser.getValueListAnnotationLazy(this._sFullyQualifiedFieldName).then(this._onAnnotationLoad.bind(this),function(e){this._oError=e;this.bInitialised=true;L.debug(e);}.bind(this));}};B.prototype.attachValueListChanged=function(f,o){this.attachEvent("valueListChanged",f,o);};B.prototype.detachValueListChanged=function(f,o){this.detachEvent("valueListChanged",f,o);};B.prototype._onAnnotationLoad=function(v){this.oPrimaryValueListAnnotation=v.primaryValueListAnnotation;this.additionalAnnotations=v.additionalAnnotations;this._resolveAnnotationData(this.oPrimaryValueListAnnotation);this.bInitialised=true;if(this._onMetadataInitialised&&this.sAggregationName&&!this.bTypeAheadEnabled&&this.oControl.$()){this._onMetadataInitialised();}};B.prototype._resolvePropertyPath=function(){var b=this.oControl.getBindingInfo("value"),p,P,a;if(b&&b.parts){p=b.parts[0]?b.parts[0].path:"";}if(p){a=p.split("/");if(a.length>1){P=a[a.length-1];this.sPropertyTypePath=p.replace("/"+P,"");}}};B.prototype._resolveAnnotationData=function(a){var b=0,i=0,c,f,t,T,C,o;if(this.oODataModel&&a){this.bSupportBasicSearch=a.isSearchSupported;this.sValueListTitle=a.valueListTitle||a.qualifier;this.sKey=a.keyField;this._aKeys=a.keys;this.sValueListEntitySetName=a.valueListEntitySetName;this.mInParams=a.inParams;this.mOutParams=a.outParams;this.sTokenDisplayBehaviour=this.sDisplayBehaviour;if(!this.sTokenDisplayBehaviour||this.sTokenDisplayBehaviour===D.auto){this.sTokenDisplayBehaviour=this.oFilterProvider?this.oFilterProvider.sDefaultTokenDisplayBehaviour:D.descriptionAndId;}if(!a.descriptionField){this.sTokenDisplayBehaviour=D.idOnly;}this.sDescription=a.descriptionField||this.sKey;if(this.sValueListEntitySetName&&this.sKey){this._aCols=[];this.aSelect=[];c=a.valueListFields;b=c.length;for(i=0;i<b;i++){f=c[i];t=null;T=null;C=undefined;o=undefined;if(f.type==="Edm.Boolean"){t="boolean";}else if(f.type==="Edm.DateTime"&&f.displayFormat==="Date"){t="date";o=this._oDateFormatSettings;C={displayFormat:"Date"};}else if(f.type==="Edm.Decimal"){t="decimal";C={precision:f.precision,scale:f.scale};}else if(f.type==="Edm.String"){if(f.isCalendarDate){t="stringdate";}else{t="string";}}T=O.getType(f.type,o,C,f.isCalendarDate);if(f.visible){this._aCols.push({label:f.fieldLabel,tooltip:f.quickInfo||f.fieldLabel,type:t,oType:T,width:F.getWidth(f,15),template:f.name,sort:f.sortable?f.name:undefined,sorted:f.sortable&&f.name===this.sKey,sortOrder:"Ascending"});}this.aSelect.push(f.name);}if(a.descriptionField){this.aSelect.push(a.descriptionField);}}else{if(!this.sKey){L.error("BaseValueListProvider","key for ValueListEntitySetName '"+this.sValueListEntitySetName+"' missing! Please check your annotations");}}}};B.prototype._getFilterData=function(){var d,f={};if(this.oFilterProvider&&this.oFilterProvider._oSmartFilter){d=this.oFilterProvider._oSmartFilter.getFilterData();if(this._fieldViewMetadata&&this._fieldViewMetadata.fieldName&&(this._fieldViewMetadata.fieldName.indexOf(A)===0)){Object.keys(d).forEach(function(n){var a=n.split(A);f[a[a.length-1]]=d[n];});return f;}}return d;};B.prototype._setFilterData=function(f){var d=f,o={};if(this.oFilterProvider){if(this._fieldViewMetadata&&this._fieldViewMetadata.fieldName&&(this._fieldViewMetadata.fieldName.indexOf(A)===0)){Object.keys(f).forEach(function(n){o[A+n]=f[n];});d=o;}this.oFilterProvider.setFilterData(d);}};B.prototype._calculateFilterInputData=function(){var s,v,d=null,b;delete this.mFilterInputData;if(this.oFilterProvider&&this.oFilterProvider._oSmartFilter){d=this._getFilterData();}else if(this.oFilterModel){d=this.oFilterModel.getData();}if(this.mInParams&&d){this.mFilterInputData={};this.aFilterField=[];for(s in this.mInParams){if(s){v=this.mInParams[s];if(v!==this.sKey){if(d[s]){this.mFilterInputData[v]=d[s];this.aFilterField.push(v);}}}}}else if(this.oODataModel&&this.bResolveInOutParams){b=this.oControl.getBindingContext();if(this.mInParams&&b){this.mFilterInputData={};this.aFilterField=[];for(s in this.mInParams){if(s){v=this.mInParams[s];if(v!==this.sKey){var p=this.sPropertyTypePath?this.sPropertyTypePath+"/"+s:s;var V=b.getProperty(p);if(V){this.mFilterInputData[v]=V;this.aFilterField.push(v);}}}}}}};B.prototype._calculateAndSetFilterOutputData=function(d){var s,v,f=null,o,e,n,i,a;if(this.mOutParams&&d&&(this.oFilterProvider||this.oFilterModel)){f={};a=function(c){return c.key===n.key;};for(s in this.mOutParams){if(s){v=this.mOutParams[s];if(v!==this.sKey){e=null;i=d.length;while(i--){o=d[i];if(o[v]){n={key:o[v]};if(!f[s]){if(!e&&this.oFilterModel){e=this.oFilterModel.getData();}if(e&&e[s]&&e[s].items){f[s]=e[s];}else{f[s]={items:[]};}}if(f[s].items.filter(a).length<=0){var b=false;if(this.oFilterProvider&&e&&e[s]&&e[s].ranges){e[s].ranges.some(function(r){if(r.operation==="EQ"&&r.value1===n.key){b=true;}return b;});}if(!b){f[s].items.push(n);}}}}}}}if(f){if(this.oFilterProvider){this._setFilterData(f);if(!q.isEmptyObject(f)){this.fireEvent("valueListChanged",{"changes":Object.keys(f)});}}else if(this.oFilterModel){this.oFilterModel.setData(f,true);}}}else if(this.oODataModel&&this.bResolveInOutParams){this._calculateAndSetODataModelOutputData(d[0]);}};B.prototype._calculateAndSetODataModelOutputData=function(d){var b,s,v,p,V,c={};if(d&&this.mOutParams){b=this.oControl.getBindingContext();for(s in this.mOutParams){if(s){v=this.mOutParams[s];if(v!==this.sKey){V=d[v];c[s]=V;p=this.sPropertyTypePath?this.sPropertyTypePath+"/"+s:s;this.oODataModel.setProperty(p,V,b,true);}}}if(c&&!q.isEmptyObject(c)){this.fireEvent("valueListChanged",{"changes":c});}}};B.prototype.destroy=function(){E.prototype.destroy.apply(this,arguments);if(this._bCleanupMetadataAnalyser&&this._oMetadataAnalyser){this._oMetadataAnalyser.destroy();}this._oMetadataAnalyser=null;if(this.oBeforeRenderingEventDelegate){this.oControl.removeEventDelegate(this.oBeforeRenderingEventDelegate);delete this.oBeforeRenderingEventDelegate;}if(this.oAfterRenderingEventDelegate){this.oControl.removeEventDelegate(this.oAfterRenderingEventDelegate);delete this.oAfterRenderingEventDelegate;}this.oControl=null;this.sFieldName=null;this.mFilterInputData=null;this.aFilterField=null;this.sValueListEntitySetName=null;this.oODataModel=null;this.oFilterModel=null;this.oFilterProvider=null;this.oPrimaryValueListAnnotation=null;this.additionalAnnotations=null;this.sDisplayFormat=null;this.bSupportBasicSearch=null;this.bInitialised=null;this._oError=null;this.sValueListTitle=null;this.sKey=null;this._aKeys=null;this.mInParams=null;this.mOutParams=null;this.sDescription=null;this.aSelect=null;this._aCols=null;this.sDDLBDisplayBehaviour=null;this.sTokenDisplayBehaviour=null;this._oDateFormatSettings=null;this.bIsDestroyed=true;};return B;},true);
