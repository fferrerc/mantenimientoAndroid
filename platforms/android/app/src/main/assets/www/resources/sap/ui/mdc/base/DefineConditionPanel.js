/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/mdc/XMLComposite","sap/ui/mdc/base/ConditionModel","sap/ui/mdc/base/Condition","sap/ui/model/Filter","sap/ui/base/ManagedObjectObserver","sap/m/FlexItemData","sap/base/util/merge","./type/Boolean","./type/String","./FilterOperatorConfig","./Field"],function(X,C,a,F,M,b,m,N,U,c,d){"use strict";var D=X.extend("sap.ui.mdc.base.DefineConditionPanel",{metadata:{properties:{},events:{}},fragment:"sap.ui.mdc.base.DefineConditionPanel",init:function(){sap.ui.getCore().getMessageManager().registerObject(this,true);this._oObserver=new M(_.bind(this));},exit:function(){sap.ui.getCore().getMessageManager().unregisterObject(this,true);this._oObserver.disconnect();this._oObserver=undefined;},onBeforeRendering:function(){var o=this.getModel("cm").getFilterField();this.sFieldPath=o.getFieldPath();var v=this.byId("defineCondition");if(!v.getBindingInfo("content")){v.bindAggregation("content",{path:'cm>/conditions/'+this.sFieldPath,filters:[new F('operator','NE','EEQ')],template:this.byId("conditionRow")});this._oObserver.observe(v,{aggregations:["content"]});var G=v.getContent();for(var i=0;i<G.length;i++){e.call(this,G[i]);}}if(!this.oConditionModel){var O=o.getFilterOperatorConfig();var h=(O?O.getOperatorsForType(o.getDataType()):[])||[];var j=[];h.forEach(function(n){var p=O.getOperator(n);if(p.showInSuggest!==undefined&&p.showInSuggest==false){return;}var t=p.textKey||"operators."+p.name+".longText";var T=p.getTypeText(t,o._getDataType().getName().toLowerCase());if(T===t){T=p.longText;}j.push({key:n,additionalText:T});},this);var k=new sap.ui.model.json.JSONModel();k.setData(j);this.setModel(k,"om");this.oConditionModel=this.getModel("cm");var l=this.oConditionModel.bindProperty("/",this.oConditionModel.getContext("/"));l.attachChange(function(E){this.updateDefineConditions();this._updateButtonVisibility();}.bind(this));this.updateDefineConditions();this._updateButtonVisibility();}},_updateButtonVisibility:function(o){var v=this.byId("defineCondition");if(!v){return;}var r=v.getContent();for(var i=0;i<r.length;i++){var R=r[i];var h=R.getContent()[2];var B=h.getItems()[1];B.setVisible(i===r.length-1);}},removeCondition:function(E){var s=E.oSource;var o=s.getBindingContext("cm").getObject();var h=this.getModel("cm");h.removeCondition(this.sFieldPath,o);},addCondition:function(E){var s=E.oSource;var o=s.getBindingContext("cm").getObject();var h=this.getModel("cm");var i=h.indexOf(this.sFieldPath,o);var j=h.getFilterField();var k=j.getMaxConditions();if(k==-1||i<k){this.addDummyCondition(i+1);}},addDummyCondition:function(i){var o=this.getModel("cm");if(!o){return;}var h=a.createCondition(this.sFieldPath,"EQ",[null]);if(i!==undefined){o.insertCondition(this.sFieldPath,i,h,true);}else{o.addCondition(this.sFieldPath,h,true);}},updateDefineConditions:function(){var h=this.oConditionModel.getConditions(this.sFieldPath).filter(function(o){return o.operator!=="EEQ";});if(h.length===0){this.addDummyCondition();}},valueCtrlFactory:function(i,o){var h=o.oModel;var p=o.sPath;var j=parseInt(p.split("/")[p.split("/").length-1]);p=p.slice(0,p.lastIndexOf("/"));p=p.slice(0,p.lastIndexOf("/"));var k=h.getProperty(p);var O=h.getFilterOperatorConfig().getOperator(k.operator);var l=h.getFilterField();var n=l._getDataType();var v=f.call(this,n,O,"cm>",j);v.addStyleClass("sapUiSmallPaddingBegin");v.setLayoutData(new b({shrinkFactor:0,growFactor:1}));if(v.attachChange){v.attachChange(this.onChange.bind(this));v.onpaste=this.onPaste.bind(this);}return v;},onChange:function(E){var o=this.getModel("cm");o._checkIsEmpty(o.getConditions(this.sFieldPath));o._updateValues(o.getConditions(this.sFieldPath));},onOperatorChange:function(E){var G=E.oSource.getParent();var h=G.getContent();var H=h[1];var l=H.getBinding("items");this.onChange(E);l.checkUpdate(true);},onPaste:function(E){var o,s=E.srcControl;if(window.clipboardData){o=window.clipboardData.getData("Text");}else{o=E.originalEvent.clipboardData.getData('text/plain');}var S=o.split(/\r\n|\r|\n/g);if(S&&S.length>1){setTimeout(function(){var h=this.getModel("cm");var j=h.getFilterField();var t=j._getDataType(),k=t.getMetadata().getName();var l=S.length;for(var i=0;i<l;i++){if(S[i]){var v=S[i];var V=v.split(/\t/g);var O,n;if(V.length==2&&V[0]&&V[1]){O="BT";n=j.getFilterOperatorConfig().getOperator(O);}else{V=[v.trim()];O=j.getFilterOperatorConfig().getDefaultOperator(k);n=j.getFilterOperatorConfig().getOperator(O);}v=n?n.format(V):V[0];if(n){var p=n.getCondition(v,t);if(p){p.fieldPath=j.getFieldPath();h.addCondition(j.getFieldPath(),p);}}}}if(s.setDOMValue){s.setDOMValue("");}}.bind(this),0);}}});function _(o){if(o.name==="content"&&o.mutation==="insert"){e.call(this,o.child);}}function e(G){var h=G.getContent();var H=h[1];var l=H.getBinding("items");l.suspend();}function f(o,O,p,i){if(O.valueTypes[i]&&O.valueTypes[i]!=="self"){o=O._createLocalType(O.valueTypes[i]);}if(O.createControl){return O.createControl(o,O,p,i);}var t=o.getMetadata().getName();var n;while(t&&!n&&t!=="base"){switch(t){case"boolean":n=new N(o.oFormatOptions,o.oConstraints);break;case"int":m(o.oFormatOptions,{emptyString:null});if(o.isA("sap.ui.model.type.Integer")){n=new sap.ui.model.type.Integer(o.oFormatOptions,o.oConstraints);}else{n=new sap.ui.model.odata.type.Integer(o.oFormatOptions,o.oConstraints);}break;case"float":m(o.oFormatOptions,{emptyString:null});if(o.isA("sap.ui.model.type.Float")){n=new sap.ui.model.type.Float(o.oFormatOptions,o.oConstraints);}else{n=new sap.ui.model.odata.type.Double(o.oFormatOptions,o.oConstraints);}break;case"date":case"time":case"datetime":n=o;break;default:break;}if(!n){t=g(t);}}if(!n){n=new U(o.oFormatOptions,o.oConstraints);}var h=new d({value:{path:p,type:n,mode:'TwoWay',targetType:'raw'},width:"100%"});return h;}function g(t){return c._mTypes[t];}return D;},true);
