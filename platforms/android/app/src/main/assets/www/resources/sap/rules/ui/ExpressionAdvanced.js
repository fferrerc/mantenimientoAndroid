/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/m/Dialog","sap/ui/core/Control","sap/m/Button","sap/m/TextArea","sap/m/Text","sap/m/MessageBox","sap/ui/layout/HorizontalLayout","sap/rules/ui/Utils","sap/ui/core/Popup","jquery.sap.global","sap/rules/ui/ExpressionBase","sap/ui/comp/odata/MetadataAnalyser","sap/rules/ui/providers/ValueHelpProvider","sap/ui/core/LocaleData","sap/rules/ui/Constants","sap/rules/ui/codemirror/lib/codemirror","sap/rules/ui/codemirror/addon/hint/show-hint","sap/rules/ui/codemirror/mode/hdf/hdf","sap/rules/ui/codemirror/addon/display/placeholder","sap/rules/ui/codemirror/addon/mh/mark-selection","sap/rules/ui/codemirror/addon/hint/hdf-hint","sap/rules/ui/codemirror/addon/closeBrackets/closebrackets","sap/rules/ui/codemirror/addon/search/search"],function(D,C,B,a,b,M,H,U,P,q,E,c,V,L,d){"use strict";var e=E.extend("sap.rules.ui.ExpressionAdvanced",{metadata:{properties:{type:{type:"sap.rules.ui.ExpressionType",defaultValue:sap.rules.ui.ExpressionType.All,bindable:"bindable"},collection:{type:"boolean",defaultValue:false},placeholder:{type:"string",defaultValue:null},focusOnLoad:{type:"boolean",defaultValue:false},attributeInfo:{type:"string",defaultValue:"",bindable:"bindable"}},aggregations:{_expressionArea:{type:"sap.m.TextArea",multiple:false,visibility:"hidden"}},events:{"change":{},"liveChange":{},"valueHelpRequest":{parameters:{fromSuggestions:{type:"boolean"}}}},publicMethosds:["validate"]}});e.prototype.init=function(){E.prototype.init.apply(this,arguments);var f=jQuery.sap.getModulePath("sap.rules.ui.codemirror.lib")+"/codemirror.css";var s=jQuery.sap.getModulePath("sap.rules.ui.codemirror.addon.hint")+"/show-hint.css";jQuery.sap.includeStyleSheet(f);jQuery.sap.includeStyleSheet(s);this.pop=new P(q('<span></span>')[0],false,false,false);this.errorWidgets=[];this.expressionTokens=[];this._liveValue="";this.oBundle=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");this.dataModel=this.initControlDataModel();this.oTextArea=new a({width:"100%"});this.validationCompleteEvent=document.createEvent("Event");this.validationCompleteEvent.initEvent("validationCompleteEvent",true,false);this.setAggregation("_expressionArea",this.oTextArea,true);this.bFlagForEventListener=true;var l=sap.ui.getCore().getConfiguration().getFormatSettings().getFormatLocale();var o=L.getInstance(l);this.oFormatDate=sap.ui.core.format.DateFormat.getInstance({pattern:o.getDatePattern('short'),calendarType:sap.ui.core.CalendarType.Gregorian},l);this._dateBusinessDataType="Date";this._valueHelpSelectionText="Select from value help...";this._hasValueSource="HasValueSource";this._propertyValue="Value";this._propertyDescription="Description";};e.prototype._processValidationResult=function(r){if(r.status===sap.rules.ui.ValidationStatus.Error){var m=U.parseUTFToString(r.errorDetails);m=m.replace(/\r\n/g," ").replace(/\r/g," ").replace(/\n/g," ");this.errorCursorPosition=r.cursorPosition;this.setValueStateText(m);}else{this.oTextArea.setValueState("None");this.oTextArea.setValueStateText("");this.setValueStateText("");jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner');}};e.prototype.validateExpression=function(I){for(var i=0;i<this.errorWidgets.length;i++){this.codeMirror.removeLineWidget(this.errorWidgets[i]);}this.errorWidgets=[];var f=this.codeMirror?this.codeMirror.getValue():this.getValue();var r={};var g={};var o=sap.ui.getCore().byId(this.getExpressionLanguage());if(o){g=o.validateExpression(I||f,this.getProperty("type"),this.getCollection(),false);if(g&&this.isActive()){r=g;this._processValidationResult(r);if(r.deferredResult){r.deferredResult.done(function(r){this._processValidationResult(r);document.dispatchEvent(this.validationCompleteEvent);}.bind(this));}}}return g;};e.prototype._showPopUp=function(){var f="Error";var g=this.getProperty("valueStateText");var t=this.getId()+'-message';var p=this.pop;if(!this.pop){return;}p.attachClosed(function(){q.sap.byId(t).remove();});var h=P.Dock;var i='sapMInputBaseMessage'+f+' sapMFocus';var T='sapMValueStateMessageError sapMText';var r=sap.ui.getCore().getLibraryResourceBundle('sap.m');if(f===sap.ui.core.ValueState.Success){i='sapUiInvisibleText';g='';}var o=q('<div>',{'id':t,'class':i,'role':'tooltip','aria-live':'assertive'}).append(q('<span>',{'aria-hidden':true,'class':'sapUiHidden','text':r.getText('INPUTBASE_VALUE_STATE_'+f.toUpperCase())})).append(q('<span>',{'id':t+'-text','class':T,'text':g}));p.setContent(o[0]);p.close(0);p.open(0,h.BeginTop,h.BeginBottom,jQuery(this.codeMirror.getWrapperElement()),null,"none flip",true);var s=this.pop.oContent.clientWidth;var j=document.getElementById(this.getAggregation("_expressionArea"));if(!j){return;}var k=j.sId.clientWidth;if(s>k){jQuery(".sapMText").css('width',k);jQuery(".sapMText").css('padding-left','12px');jQuery(".sapMText").css('padding-right','12px');jQuery(".sapMText").css('padding-top','8px');jQuery(".sapMText").css('padding-bottom','8px');}};e.prototype._closePopUp=function(){if(this.pop){this.pop.close(0);}};e.prototype._showErrorMessage=function(){var f=this.getValueStateText();if(f&&f!==""){this._setExpressionErrorStyle();}};e.prototype.initControlDataModel=function(){var o=new sap.ui.model.json.JSONModel();var f={};o.setData(f);return o;};e.prototype.setExpressionTokens=function(t){var m=0,n=false;this.expressionTokens=[];if(t instanceof Array){for(var i=0;i<t.length;i++){var f=t[i];var g=/\n/;if(g.test(f.token)){m=f.start+f.token.lastIndexOf('\n')+1;n=true;continue;}if(n){f.start=f.start-m;f.end=f.end-m+1;}else{f.end=f.end+1;}this.expressionTokens.push(f);}}};e.prototype.getExpressionTokens=function(){return this.expressionTokens;};e.prototype.getValue=function(){if(this.codeMirror!==undefined){return this.codeMirror.getValue();}return this.getProperty("value");};e.prototype.setValue=function(v){if(v===undefined||v===null){v="";}this._liveValue=v;this.oTextArea.setValue(v);if(this.getProperty("value")===v){return;}this.setProperty("value",v,true);if(this.codeMirror!==undefined){this.codeMirror.setValue(v);}};e.prototype.setPlaceholder=function(v){this.setProperty("placeholder",v);var m=(this.getEditable())?v:"";this.dataModel.setProperty("/placeholder",m);};e.prototype.getPlaceholder=function(){return this.dataModel.getProperty("/placeholder");};e.prototype.setValueStateText=function(m){this.setProperty("valueStateText",m,true);this._showErrorMessage(m);};e.prototype.setEditable=function(v){this.setProperty("editable",v);this.getAggregation("_expressionArea").setProperty("editable",v);if(this.codeMirror){jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');}var _=(v)?this.getProperty("placeholder"):"";this.dataModel.setProperty("/placeholder",_);this.invalidate();};e.prototype.setType=function(t){this.setProperty("type",t);if(this.codeMirror){this.codeMirror.options.returnType=t;}};e.prototype.setCollection=function(i){this.setProperty("collection",i,true);if(this.codeMirror){this.codeMirror.options.collection=i;}};e.prototype.validate=function(){return this.validateExpression();};e.prototype.setFocusOnLoad=function(v){this.dataModel.setProperty("/focus",v);this.setProperty("focusOnLoad",v,true);};e.prototype.focus=function(){if(this.codeMirror){var l=this.codeMirror.getLine(this.codeMirror.lastLine());var f=l.length;this.codeMirror.setCursor({line:this.codeMirror.lastLine(),ch:f});this.codeMirror.focus();}};e.prototype.onAliasLinkPress=function(f){var g=sap.ui.getCore().byId(this.getExpressionLanguage());if(g){g.onAliasLinkPress(f);g.attachEvent("aliasDialogClosed",this.aliasClickCancel,this);}};e.prototype.onCreateAliasLinkForText=function(t){var f=sap.ui.getCore().byId(this.getExpressionLanguage());if(f){f.attachEvent("aliasDialogClosed",this.replaceTextWithAlias,this);f.onCreateAliasLinkForText(t);}};e.prototype.replaceTextWithAlias=function(o){if(o.getParameter("isSave")){this.codeMirror.replaceSelection(o.getParameter("savedAliasName"));}};e.prototype.aliasClickCancel=function(o){this.codeMirror.focus();this.codeMirror.execCommand("goLineEnd");this.fireDialog({dialogStatus:sap.rules.ui.ValueListDialogMode.Close});};e.prototype.onAfterRendering=function(){this.timer=null;this.needAutoComplete=false;this.endCompletion=false;this._setCodeMirror();this._setEditorStyle();this._handleMousedown();this._handleChange();this._handleFocusLeave();this._handleEndCodeCompletion();this._handleKeyPress();this._handleEditableProperty();this._handleOnLoadValidation();this._refreshOnNavigationEnd();this._handleFocus();this._handleValueListSelect();this._handleCalendarChange();if(this.bFlagForEventListener){this.bFlagForEventListener=false;this.fnMouseDownListsner=function(o){this.bFlagForChangeBeforeBlur=o.target.className.indexOf("CodeMirror-hint")>-1;}.bind(this);this.fnBlurListsner=function(o){if(this.bFlagForChangeBeforeBlur){this.bFlagForChangeBeforeBlur=false;o.stopPropagation();this.codeMirror.focus();}}.bind(this);document.addEventListener("mousedown",this.fnMouseDownListsner,true);document.getElementById(this.getId()).addEventListener("blur",this.fnBlurListsner,true);}};e.prototype._handleCalendarChange=function(){var t=this;this.codeMirror.on('onChangeDate',function(){t._createCalendarDialog(t.codeMirror.getCursor());}.bind(this));};e.prototype._createCalendarDialog=function(f){var A=false;var t=this;var o=new sap.ui.unified.Calendar({width:"100%",select:this.handleCalendarSelect.bind(this)});this._oSelectNewDateDialog=new D({title:this.oBundle.getText("calendarTitle"),content:[o],beginButton:new B({text:this.oBundle.getText("okBtn"),enabled:false,press:function(){var g=this.updateText(o);t._updateModal(false);t.setTextOnCursor(g,f,false,this._dateBusinessDataType,A,false);t._oSelectNewDateDialog.close();t.focus(t.codeMirror);}.bind(this)}),endButton:new B({text:this.oBundle.getText("clsBtn"),press:function(){t._updateModal(false);t._oSelectNewDateDialog.close();t.focus(t.codeMirror);}.bind(this)})});this._oSelectNewDateDialog.open();};e.prototype._updateModal=function(m){var p=sap.ui.getCore().byId("popover");if(p){p.setModal(m);}};e.prototype.handleCalendarSelect=function(o){var f=o.getSource(),s=f.getSelectedDates()[0].getStartDate();if(s){this._oSelectNewDateDialog.getBeginButton().setEnabled(true);}};e.prototype.updateText=function(o){var s=o.getSelectedDates();var f;if(s.length>0){f=s[0].getStartDate();return this.oFormatDate.format(f);}};e.prototype._raiseError=function(s){jQuery.sap.log.error(s);var o=sap.ui.getCore().getLibraryResourceBundle("sap.rules.ui.i18n");this.setValueStateText(o.getText("valueHelpTechnicalError"));this._showPopUp();};e.prototype._handleValueListSelect=function(){this.codeMirror.on('onValueListSelect',function(){var s=this.codeMirror.currentHintData.data.listCompletion;var v=[];for(var f=0;f<s.length;f++){if(s[f].text===this._valueHelpSelectionText){v=s[f].info;}}var g=sap.ui.getCore().byId(this.getExpressionLanguage());v.expressionLanguage=g;var h=g.getValueHelpCallback();this.oTextArea.setValueState("None");this.oTextArea.setValueStateText("");this.setValueStateText("");jQuery(this.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner');if((typeof h)!=="function"&&v.metadata.hasOwnProperty(this._hasValueSource)&&v.metadata.HasValueSource===true){this._createCpValueHelp(v,this.codeMirror.getCursor(),false);}else{if((typeof h)!=="function"){this._raiseError("value help callback is not set or is not a function");}else{h.call(this,v);var m=v[0].model;if(!(m instanceof sap.ui.model.odata.v2.ODataModel)){this._raiseError("value help model is not an oData V2 model");}else if(m.isMetadataLoadingFailed()){this._raiseError("model metadata loading has failed in the past");}else if(!(m.getMetaModel().oModel)){m.attachMetadataLoaded(function(){this._createValueHelpProvider(v[0]);}.bind(this));m.attachMetadataFailed(function(){this._raiseError("attached model metadata failed");}.bind(this));}else{this._createValueHelpProvider(v[0]);}}}}.bind(this));};e.prototype._createValueHelpProvider=function(v,r){var m=v.model;this.oMetadataAnalyzer=new sap.ui.comp.odata.MetadataAnalyser(m);var A=v.metadata.propertyPath;var o=this.oMetadataAnalyzer.getValueListAnnotation(A);if(!o.primaryValueListAnnotation){this._raiseError("proprety path is wrong");return;}var t=this.getExpressionTokens();var f=false;if(t.length>0){f=(t[t.length-1].tokenType!=="whitespace");}if(this.oValueHelpDialogProvider){this.oValueHelpDialogProvider.destroy();}this.oValueHelpDialogProvider=new V({annotation:o.primaryValueListAnnotation,additionalAnnotations:o.additionalAnnotations,control:this,model:m,preventInitialDataFetchInValueHelpDialog:false,supportMultiSelect:false,supportRanges:false,takeOverInputValue:false,fieldName:o.primaryValueListAnnotation.valueListTitle,title:o.primaryValueListAnnotation.valueListTitle,cursorPosition:this.codeMirror.getCursor(),bReplaceWord:r,businessDataType:v.metadata.businessDataType,bAddSpace:f});this.fireValueHelpRequest({fromSuggestions:false});};e.prototype._createCpValueHelp=function(v,f,r,g){var h=v.metadata.businessDataType;var t=this.getExpressionTokens();var A=false;var p=sap.ui.getCore().byId("popover");if(p){p.setModal(true);}if(t.length>0){A=(t[t.length-1].tokenType!=="whitespace");}if(this.oDialog){this.oDialog.destroy();}var i=sap.ui.getCore().byId(this.getExpressionLanguage()).getModel().sServiceUrl;this._createDialog(i,v,f,h,A,r,g);};e.prototype._createDialog=function(f,v,g,h,A,r,i){this._createValueHelpDialog(f,v,g,h,A,r,i);this._createSmartFilterBar(f,v);this.oValueHelpDialog.setFilterBar(this.oFilterBar);this.oValueHelpDialog.open();this.oValueHelpDialog.getTable().setBusy(true);};e.prototype._createValueHelpDialog=function(f,v,g,h,A,r,i){var t=this;var j=v.expressionLanguage.getModel();var k="Attributes(Id='"+v.metadata.attributeId+"',VocabularyId='"+v.metadata.vocabularyId+"',DataObjectId='"+v.metadata.dataObjectId+"')";this.attributeName=j.oData[k].Name;sap.ui.core.BusyIndicator.show(0);this.oValueHelpDialog=new sap.ui.comp.valuehelpdialog.ValueHelpDialog({supportMultiselect:false,supportRanges:false,horizontalScrolling:false,title:t.attributeName,resizable:false,beforeOpen:function(){t._bindTable(f,v);},ok:function(o){var s=o.getParameter("tokens")[0].data("row");var l=s.Value;if(h===t._dateBusinessDataType){l=t._formatDate(l);}t.setTextOnCursor(l,g,r,h,A,i);t._updateModal(false);t.oValueHelpDialog.close();t.focus(t.codeMirror);},cancel:function(){t._updateModal(false);t.oValueHelpDialog.close();t.focus(t.codeMirror);},afterClose:function(){t._updateModal(false);t.oValueHelpDialog.destroy();t.focus(t.codeMirror);t.oFilterBar.destroy();sap.ui.core.BusyIndicator.hide();}});};e.prototype._formatDate=function(v){return this.oFormatDate.format(this.oFormatDate.parse(v));};e.prototype._createSmartFilterBar=function(f,v){var t=this;this.oFilterBar=new sap.ui.comp.smartfilterbar.SmartFilterBar({entitySet:v.metadata.entitySet,enableBasicSearch:true,advancedMode:true,filterBarExpanded:true,search:function(){t.onSearch(f,v);},filterChange:function(o){t.setValueStateFilter(o);},controlConfiguration:[t._createControlConfiguration()]});var m=new sap.ui.model.odata.v2.ODataModel(f);this.oFilterBar.setModel(m);};e.prototype._createControlConfiguration=function(){var f=[new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"Value",label:"Value",visibleInAdvancedArea:true,width:"100px",index:1}),new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"Description",label:"Description",visibleInAdvancedArea:true,width:"100px",index:2}),new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"VocabularyId",label:"VocabularyId",width:"100px",visible:false,index:3}),new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"DataObjectId",label:"DataObjectId",visible:false,width:"100px",groupId:"abc",index:4}),new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"AttributeId",label:"AttributeId",visible:false,width:"100px",index:5}),new sap.ui.comp.smartfilterbar.ControlConfiguration({hasValueHelpDialog:true,key:"Version",label:"Version",visible:false,width:"100px",index:6})];return f;};e.prototype.onSearch=function(f,v){this.oValueHelpDialog.getTable().setBusy(true);this._unBindTable();this._bindTable(f,v);};e.prototype._bindTable=function(f,v){var s=v.metadata.serviceURL;var F=this._fetchFilterParams(v);var m={valueHelp:{collection:s,properties:[this._propertyValue,this._propertyDescription]}};var t=this.oValueHelpDialog.getTable();t.setThreshold(10);for(var i=0;i<m.valueHelp.properties.length;i++){this._addValueHelpColumn(m.valueHelp.properties[i],t);}var o=new sap.ui.model.odata.v2.ODataModel(f);t.setModel(o);t.bindRows(m.valueHelp.collection,null,F);t.getBinding("rows").attachDataReceived(this._handleRowsDataReceived,this);};e.prototype._handleRowsDataReceived=function(o){var t=this;var f=o.getParameter("data");if(jQuery.isEmptyObject(f)||(f&&f.results&&f.results.length===0)){this.oValueHelpDialog.getTable().setNoData(t.oBundle.getText("no_data"));}else{this.oValueHelpDialog.getTable().setNoData(t.oBundle.getText("searching"));}this.oValueHelpDialog.getTable().setBusy(false);};e.prototype._addValueHelpColumn=function(o,t){var f=new sap.ui.table.Column().setLabel(new sap.m.Label({text:o}));if(o===this._propertyValue){f.setSortProperty(o);}t.addColumn(f.setTemplate(new sap.m.Text().bindProperty("text",o)));};e.prototype._unBindTable=function(){var t=this.oValueHelpDialog.getTable();t.destroyColumns();t.unbindRows();};e.prototype._fetchFilterParams=function(v){var t=this;var s=[];var f=[new sap.ui.model.Filter("AttributeId",sap.ui.model.FilterOperator.EQ,v.metadata.attributeId),new sap.ui.model.Filter("DataObjectId",sap.ui.model.FilterOperator.EQ,v.metadata.dataObjectId),new sap.ui.model.Filter("VocabularyId",sap.ui.model.FilterOperator.EQ,v.metadata.vocabularyId)];var F=this.oFilterBar.getFilters();var g=this.oFilterBar.getParameters();if(!jQuery.isEmptyObject(g)&&F&&F.length>0){g=this.oFilterBar.getParameters().custom.search;s=this._getSearchFilters(g);F=t._formatFilterParams(F);f.push(new sap.ui.model.Filter({filters:[new sap.ui.model.Filter(F),new sap.ui.model.Filter(s)],and:true}));}else if(!jQuery.isEmptyObject(g)){g=this.oFilterBar.getParameters().custom.search;s=this._getSearchFilters(g);f.push(s);}else if(F&&F.length>0){F=t._formatFilterParams(F);f.push(F[0]);}return f;};e.prototype._formatFilterParams=function(f){var t=this;if(f[0]&&f.length===1&&f[0].aFilters[0]&&f[0].aFilters[0].sOperator){f=t._formatSingleFilter(f);}else if(f[0]&&f[0].aFilters[0]&&f[0].aFilters[0].aFilters[0]&&f[0].aFilters[0].aFilters[0].aFilters&&f[0].aFilters[1].aFilters[0].aFilters){f=t._formatMultiFilter(f,0,true);f=t._formatMultiFilter(f,1,true);}else if(f[0]&&f[0].aFilters[0]&&f[0].aFilters[1]&&f[0].aFilters[0].aFilters[0]&&f[0].aFilters[0].aFilters[0].aFilters&&f[0].aFilters[1].aFilters){f=t._formatMultiFilter(f,0,true);f=t._formatMultiFilter(f,1,false);}else if(f[0]&&f[0].aFilters[0]&&f[0].aFilters[1]&&f[0].aFilters[1].aFilters[0]&&f[0].aFilters[0].aFilters&&f[0].aFilters[1].aFilters[0].aFilters){f=t._formatMultiFilter(f,0,false);f=t._formatMultiFilter(f,1,true);}else if(f[0]&&f[0].aFilters[0]&&f[0].aFilters[1]&&f[0].aFilters[0].aFilters&&f[0].aFilters[1].aFilters){f=t._formatMultiFilter(f,0,false);f=t._formatMultiFilter(f,1,false);}return f;};e.prototype._formatSingleFilter=function(f){var t=this;var _=null;for(var i=0;i<f[0].aFilters.length;i++){if(f[0].aFilters[i].sOperator==="Contains"){f[0].aFilters[i].sOperator="EQ";}else if(f[0].aFilters[i].sOperator==="BT"){var g=t._manageParam(f[0].aFilters[i].sPath,f[0].aFilters[i].sOperator,f[0].aFilters[i].oValue1,f[0].aFilters[i].oValue2);delete f[0].aFilters[i];f[0].aFilters[i]=g;}else if(f[0].aFilters[i].sOperator==="StartsWith"){_=(f[0].aFilters[i].sPath===this._propertyValue)?this._valueFieldValue:this._valueFieldDescription;_.setValueState("Error");_.setValueStateText(f[0].aFilters[i].sOperator+" operator not supported");}else if(f[0].aFilters[i].sOperator==="EndsWith"){_=(f[0].aFilters[i].sPath===this._propertyValue)?this._valueFieldValue:this._valueFieldDescription;_.setValueState("Error");_.setValueStateText(f[0].aFilters[i].sOperator+" operator not supported");}}return f;};e.prototype._formatMultiFilter=function(f,i,m){var t=this;var _=null;var g=[];if(m){g=f[0].aFilters[i].aFilters[0].aFilters;}else{g=f[0].aFilters[i].aFilters;}for(var h=0;h<g.length;h++){if(g[h].sOperator==="Contains"){g[h].sOperator="EQ";}else if(g[h].sOperator==="BT"){var j=t._manageParam(g[h].sPath,g[h].sOperator,g[h].oValue1,g[h].oValue2);delete g[h];g[h]=j;}else if(g[h].sOperator==="StartsWith"){_=(g[h].sPath===this._propertyValue)?this._valueFieldValue:this._valueFieldDescription;_.setValueState("Error");_.setValueStateText(g[h].sOperator+" operator not supported");}else if(g[h].sOperator==="EndsWith"){_=(g[h].sPath===this._propertyValue)?this._valueFieldValue:this._valueFieldDescription;_.setValueState("Error");_.setValueStateText(g[h].sOperator+" operator not supported");}}return f;};e.prototype._manageParam=function(p,o,v,f){var g=[];if(v&&f){g=new sap.ui.model.Filter({filters:[new sap.ui.model.Filter(p,sap.ui.model.FilterOperator.GT,v),new sap.ui.model.Filter(p,sap.ui.model.FilterOperator.LT,f)],and:true});}return g;};e.prototype._getSearchFilters=function(s){return new sap.ui.model.Filter({filters:[new sap.ui.model.Filter(this._propertyValue,sap.ui.model.FilterOperator.EQ,s),new sap.ui.model.Filter(this._propertyDescription,sap.ui.model.FilterOperator.EQ,s)],and:false});};e.prototype.setValueStateFilter=function(o){var i=o.getSource().sId;this._valueFieldValue=sap.ui.getCore().byId(i+"-filterItemControlA_-Value");if(this._valueFieldValue){this._valueFieldValue.setValueState("None");this._valueFieldValue.setValueStateText("");}this._valueFieldDescription=sap.ui.getCore().byId(i+"-filterItemControlA_-Description");if(this._valueFieldDescription){this._valueFieldDescription.setValueState("None");this._valueFieldDescription.setValueStateText("");}};e.prototype.onValueHelpLinkPress=function(v,f){if(!this.getEditable()){return;}var g=sap.ui.getCore().byId(this.getExpressionLanguage());var h=g.getValueHelpCallback();var t=this.getExpressionTokens();var i;var j;var l=this.codeMirror.getCursor().line;var k;for(i=0;i<t.length;i++){if(t[i].tokenType==='valueList'&&t[i].info&&t[i].info.id===f&&t[i].token===v){j=[t[i].info];k=t[i].end;break;}}var m={};m.ch=k;m.line=l;if((typeof h)==="function"){h.call(this,j);var o=j[0].model;if(!o.getMetaModel().oModel){o.attachMetadataLoaded(function(){this._createValueHelpProvider(j[0],true);}.bind(this));}else{this._createValueHelpProvider(j[0],true);}}else if(j&&j[0].metadata.hasOwnProperty(this._hasValueSource)&&j[0].metadata.HasValueSource===true){j[0].expressionLanguage=g;this._createCpValueHelp(j[0],m,true,true);}};e.prototype._createSearchCursor=function(v){var f=this.codeMirror;f.getCursor().ch=f.getCursor().ch+v.length;var g=f.getSearchCursor(v,f.getCursor(),typeof v=="string"&&v==v.toLowerCase());return g;};e.prototype.setTextOnCursor=function(v,f,r,g,A,h){function k(x,y){var z=x+1;for(var j=z;j<y.length;j++){if(y[j].length===0){z++;}else{break;}}return z;}var T="String",l="Date",m="Timestamp",n="Time";var o;var F=((g===T)||(g===l)||(g===m)||(g===n))?"'"+v+"'":v;var t=this.getExpressionTokens();var p=this.getValue().split("\n");var s=-1;var u={start:{line:f.line,ch:f.ch},end:{line:f.line,ch:f.ch}};for(var i=0;i<t.length;i++){s=(t[i].start===0)?k(s,p):s;if(s===f.line&&(t[i].end>f.ch)||(t[i].end>=f.ch&&h)){u.start.ch=t[i].start;u.end.ch=t[i].end;r=true;break;}}if(r){this.codeMirror.replaceRange(F,u.start,u.end);o=this.codeMirror.findPosH(u.start,F.length,"char",true);this.codeMirror.setCursor(o);}else{F=A?" "+F:F;this.codeMirror.replaceRange(F,f);o=this.codeMirror.findPosH(f,F.length,"char",true);this.codeMirror.setCursor(o);}var w=sap.ui.getCore().byId(this.getExpressionLanguage());this.getFormattingTokens(w);this.ValueHelpRequested=false;};e.prototype._setCodeMirror=function(){var f=this.getEditable();var g;if("getAttributeInfo"in this&&this.getAttributeInfo()){g=this.getAttributeInfo();}var h=sap.ui.getCore().byId(this.getExpressionLanguage());var v;if(g){v=h.getValueListAttribute(g);}function j(i,x,y){var A=i.options.expressionEditor;if((A.getEditable()!==false)&&sap.ui.getCore().byId(A.getExpressionLanguage())){window.clearTimeout(A.timer);A.timer=window.setTimeout(function(){i.execCommand(x);},y);return window.CodeMirror.Pass;}return null;}function o(i){var A=i.options.expressionEditor;if(A.getEditable()!==false){window.clearTimeout(A.timer);A.needAutoComplete=true;A.timer=window.setTimeout(function(){if(A.needAutoComplete&&sap.ui.getCore().byId(A.getExpressionLanguage())){i.execCommand("autocomplete");}},500);return window.CodeMirror.Pass;}return null;}function k(i){return j(i,"enterAutocomplete",500);}function l(i){return j(i,"colonAutocomplete",500);}function m(i){j(i,"autocomplete",0);}function s(i){return j(i,"autocomplete",500);}function n(x){var A=x.options.expressionEditor;var y=x.getRange({line:0,ch:0},x.getCursor());if(x.options.headerValue){var z=x.options.headerValue+" ";if(x.options.fixedOperator){z=z+x.options.fixedOperator+" ";}y=z+y;}var F=x.options.relDelegate.getSuggestions(y,x.options.returnType,x.options.collection);var G;if(F&&F.hasOwnProperty("suggs")&&F.suggs.length>0){G=F.suggs;for(var i=0;i<G.length;i++){if(G[i].tokenType==='valueList'&&G[i].info.metadata.hasOwnProperty(A._hasValueSource)){A._createCpValueHelp(G[i].info,x.getCursor(),false);}}}}this.keyMap={"Tab":false,"Shift-Tab":false,"Ctrl-Space":m,"Backspace":o,"Enter":k,"':'":l,"'+'":o,"'-'":o,"'*'":o,"'/'":o,"'_'":o,"'o'":o,"'q'":o,"'w'":o,"'e'":o,"'r'":o,"'t'":o,"'y'":o,"'u'":o,"'i'":o,"'p'":o,"'.'":o,"'a'":o,"'s'":o,"'d'":o,"'f'":o,"'g'":o,"'h'":o,"'j'":o,"'k'":o,"'l'":o,"'z'":o,"'x'":o,"'c'":o,"'v'":o,"'b'":o,"'n'":o,"'m'":o,"'O'":o,"'Q'":o,"'W'":o,"'E'":o,"'R'":o,"'T'":o,"'Y'":o,"'U'":o,"'I'":o,"'P'":o,"'A'":o,"'S'":o,"'D'":o,"'F'":o,"'G'":o,"'H'":o,"'J'":o,"'K'":o,"'L'":o,"'Z'":o,"'X'":o,"'C'":o,"'V'":o,"'B'":o,"'N'":o,"'M'":o,"'0'":false,"'1'":false,"'2'":false,"'3'":false,"'4'":false,"'5'":false,"'6'":false,"'7'":false,"'8'":false,"'9'":false,"' '":s,"F4":n};function p(A){return A.keyMap;}if(this.expressionTokens.length===0){var r=sap.ui.getCore().byId(this.getExpressionLanguage());if(r){this.getFormattingTokens(r);}}var t=p(this);var u=this.oTextArea.getId()+'-inner';var w=(U.msieversion()>=0);if(w){jQuery('#'+u).attr('placeholder',this.getProperty('placeholder'));}this.codeMirror=window.CodeMirror.fromTextArea(document.getElementById(u),{mode:"text/hdf",lineNumbers:false,lineWrapping:true,matchBrackets:f===true?true:false,highlightSelectionMatches:f===true?{showToken:/\w/}:{},relDelegate:h,returnType:this.getProperty("type"),collection:this.getProperty("collection"),valueListAttribute:v,expressionEditor:this,stillNeedShowHint:true,shouldValidate:true,styleSelectedText:true,smartIndent:true,autoCloseBrackets:true,indentUnit:6});this.codeMirror.addKeyMap(t,true);};e.prototype.getFormattingTokens=function(o){this.tokens=[];this.valueListAttrInfo=o.getValueListAttribute(this.mProperties.attributeInfo);var f=o.getExpressionMetadata(this._liveValue);if(f){this.tokens=f.tokens;}if(o._hasValueSource&&this.valueListAttrInfo){this.newExpression=this.valueListAttrInfo.navPath+" "+d.IS_EQUAL_TO+" "+this._liveValue;f=o.getExpressionMetadata(this.newExpression);if(f){var t=f.tokens;for(var g=0;g<t.length;g++){for(var p=0;p<this.tokens.length;p++){if(t[g].tokenType==="valueList"&&t[g].token===this.tokens[p].token){this.tokens[p].info=t[g].info;this.tokens[p].tokenType=t[g].tokenType;}}}}}this.setExpressionTokens(this.tokens);};e.prototype._setEditorStyle=function(){if(this.getValueStateText()&&this.getValueStateText()!==""){jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner');jQuery('#'+this.oTextArea.getId()).addClass('sapMInputBaseError');}jQuery('#'+this.oTextArea.getId()).removeClass().addClass('sapMInput');jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseInner CodeMirror-rules');if(!this.getEditable()){jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-rules-Not-Editable');}else{jQuery(this.codeMirror.getWrapperElement()).removeClass('CodeMirror-rules-Not-Editable');}if(this.codeMirror){this.codeMirror.refresh();}};e.prototype._handleOnLoadValidation=function(){if(this.getValidateOnLoad()){this.validateExpression();this.setValidateOnLoad(false);}};e.prototype._handleEditableProperty=function(){if(this.getEditable()===false){this.codeMirror.setOption("readOnly","true");this.codeMirror.setOption("theme","read-only");}};e.prototype._handleFocus=function(){var o=this.codeMirror;if(this.getFocusOnLoad()){this.focus();}this.codeMirror.on("focus",function(f,g){var h=f.options.expressionEditor.getProperty("valueStateText");if(h&&h!==""){f.options.expressionEditor._showPopUp();}f.options.stillNeedShowHint=true;jQuery('#'+f.options.expressionEditor.oTextArea.getId()).addClass('sapMInputFocused');jQuery(f.getWrapperElement()).removeClass('CodeMirror-errorBackground');});if(this.dataModel.getProperty("/focus")===true){window.setTimeout(function(){var l=o.getLine(o.lastLine());var f=l.length;o.setCursor({line:o.lastLine(),ch:f});},10);}};e.prototype._refreshOnNavigationEnd=function(){jQuery(".sapMNav").on('webkitTransitionEnd oTransitionEnd transitionend msTransitionEnd',jQuery.proxy(_,this));function _(){if(this.codeMirror){this.codeMirror.refresh();}}};e.prototype._handleKeyPress=function(){this.codeMirror.on("keyHandled",function(f,k,g){if(g.keyCode===27&&this&&this.endCompletion===true){g.stopPropagation();this.endCompletion=false;}if(g.ctrlKey===true&&k==="Ctrl-A"){g.stopPropagation();}});};e.prototype._handleEndCodeCompletion=function(){this.codeMirror.on("endCompletion",function(f){f.options.expressionEditor.needAutoComplete=false;f.options.expressionEditor.endCompletion=!f.options.expressionEditor.endCompletion;});};e.prototype._handleMousedown=function(){this.codeMirror.on("mousedown",function(f,g){g.stopPropagation();var t=g.target||g.srcElement;if(t&&g.button===0){var h=t.className.split(/\s+/);for(var i=0;i<h.length;i++){if(h[i]==='cm-valuehelp'){var v=h[++i].split('-valuehelpid-')[1];f.options.expressionEditor.onValueHelpLinkPress(t.textContent,v);}}}});};e.prototype._handleChange=function(){this.codeMirror.on("change",function(f,g){var A=f.options.expressionEditor;if(A.codeMirror.state.completionActive&&A.keyMap["'"+g.text[0]+"'"]===false){A.codeMirror.state.completionActive.close();}jQuery(A.codeMirror.getWrapperElement()).removeClass('CodeMirror-error');jQuery(A.codeMirror.getWrapperElement()).removeClass('sapMInputBaseStateInner sapMInputBaseErrorInner');A._liveValue=f.getValue();var o=sap.ui.getCore().byId(A.getExpressionLanguage());if(o){A.getFormattingTokens(o);}A.codeMirror.options.shouldValidate=true;A.fireLiveChange({newValue:f.getValue()});if(g.origin!=="+delete"){f.operation(function(){for(var l=0,h=f.lineCount();l<h;++l){f.indentLine(l,"smart");}});}});};e.prototype._handleFocusLeave=function(){this.codeMirror.on("blur",function(f){var A=f.options.expressionEditor;A._closePopUp();A.codeMirror.options.stillNeedShowHint=false;if(A.codeMirror.options.shouldValidate&&!A.bFlagForPreventBlurWhenPopOverOpen){A.setValue(A.codeMirror.getValue());if(!(A instanceof sap.rules.ui.DecisionTableCellExpressionAdvanced)){A.validate();}A._closePopUp();A.fireChange({newValue:f.getValue()});A.codeMirror.options.shouldValidate=false;}jQuery('#'+A.oTextArea.getId()).removeClass('sapMInputFocused');A.dataModel.setProperty("/focus",false);});};e.prototype._setExpressionErrorStyle=function(){var f=this.getProperty("valueStateText");if(f!==""&&f!==undefined&&this.codeMirror){jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-error');jQuery(this.codeMirror.getWrapperElement()).addClass('sapMInputBaseStateInner sapMInputBaseErrorInner');jQuery('#'+this.oTextArea.getId()).addClass('sapMInputBaseError');var g;if(this.errorCursorPosition<0){var l=this.codeMirror.getLine(this.codeMirror.lastLine());g=l.length;jQuery(this.codeMirror.getWrapperElement()).addClass('CodeMirror-errorBackground');}else{var i=f.lastIndexOf("'");if(i>0){var o=f.substring(0,i);i=o.lastIndexOf("'");if(i>0){o=o.substring(i+1);}var h=false;for(var j=this.codeMirror.lastLine();!h&&j>=0;j--){var k=this.codeMirror.getLine(j);g=k.lastIndexOf(o);if(g>=0){h=true;this.codeMirror.setSelection({line:j,ch:g},{line:j,ch:g+o.length});}}}}}};e.prototype.getSelectedText=function(){return this.codeMirror.getSelection();};e.prototype.exit=function(){document.removeEventListener("mousedown",this.fnMouseDownListsner,true);};return e;},true);
