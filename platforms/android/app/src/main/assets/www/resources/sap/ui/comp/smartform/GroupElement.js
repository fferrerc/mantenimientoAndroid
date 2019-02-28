/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/comp/library','sap/ui/core/Element','sap/ui/core/Control','sap/ui/layout/form/FormElement','sap/m/Label','sap/ui/comp/smartfield/SmartLabel','sap/ui/comp/smartfield/SmartField',"sap/base/Log"],function(l,E,C,F,L,S,a,b){"use strict";var V;var H;var c;var d;var G;var e=l.smartfield.ControlContextType;var f=F.extend("sap.ui.comp.smartform.GroupElement",{metadata:{library:"sap.ui.comp",properties:{useHorizontalLayout:{type:"boolean",group:"Misc",defaultValue:null},horizontalLayoutGroupElementMinWidth:{type:"int",group:"Misc",defaultValue:null},elementForLabel:{type:"int",group:"Misc",defaultValue:0}},defaultAggregation:"elements",aggregations:{elements:{type:"sap.ui.core.Control",multiple:true,singularName:"element"}},events:{visibleChanged:{}},designtime:"sap/ui/comp/designtime/smartform/GroupElement.designtime"},_bVisibleElements:false,_bHorizontalLayoutUsed:false});f._myVBox=undefined;f.prototype.init=function(){F.prototype.init.apply(this,arguments);this._oObserver.observe(this,{properties:["useHorizontalLayout","horizontalLayoutGroupElementMinWidth","elementForLabel"]});};f.prototype._getFieldRelevantForLabel=function(){var i=this.getElements();var N=this.getElementForLabel();if(i.length>N&&(i[N]instanceof a)){return i[N];}return null;};f.prototype._extractFields=function(i,N){var O=[];i.forEach(function(P){if(P instanceof V||P instanceof H){O=O.concat(P.getItems());}else{O.push(P);}});if(O.some(function(P){return P instanceof V||P instanceof H;})){O=this._extractFields(O);}if(N){O=O.filter(function(P){return!(P instanceof L);});}return O;};f.prototype.setTooltip=function(T){F.prototype.setTooltip.apply(this,[T]);var R=this._getFieldRelevantForLabel();var i=this._getLabel();_.call(this,i,R);return this;};function _(i,R){if(i==this._oSetLabel){return;}var T;if(this._oSetLabel&&this._oSetLabel instanceof C){T=M.call(this._oSetLabel);}if(!T){T=M.call(this);}if(T){if(i instanceof S){if(R&&R.setTooltipLabel){R.setTooltipLabel(T);}}else{i.setTooltip(T);}}}f.prototype.setLabel=function(i){if(!i&&this._bMoveLabelToVBox){return this.setAggregation("label",i);}if(this._oSetLabel&&(typeof this._oSetLabel!=="string")){this._oSetLabel.detachEvent("_change",g,this);}var O;var N;var P;if(typeof i==="string"){O=this._getLabel();if(O){N=O.getText();}}else if(!i&&this._oSetLabel){N=this.getLabelText();}F.prototype.setLabel.apply(this,[i]);this._oSetLabel=i;h.call(this);if(typeof i==="string"){if(this._oLabel instanceof S&&i!=N&&(i.length>0||N.length>0)){P=this._getFieldRelevantForLabel();if(P&&i!=null){if(P.getTextLabel){if(!P._oTextLabelSetByGroupElement){P._oTextLabelSetByGroupElement={oldText:P.getTextLabel()};}P.setTextLabel(i);}}}if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",this._oLabel,true);}this._oLabel.isRequired=j;this._oLabel.isDisplayOnly=k;}else{if(i){if(i.isRequired){i.isRequired=j;}if(i.isDisplayOnly){i.isDisplayOnly=k;}i.attachEvent("_change",g,this);}else{P=this._getFieldRelevantForLabel();if(P){J.call(this,P,N);}}this.updateLabelOfFormElement();}return this;};f.prototype.destroyLabel=function(){var O=this.getLabelText();F.prototype.destroyLabel.apply(this);delete this._oSetLabel;h.call(this);var i=this._getFieldRelevantForLabel();if(i){J.call(this,i,O);}this.updateLabelOfFormElement();return this;};function g(i){if(i.getParameter("name")=="text"){var N=i.oSource;var T=N.getText();if(this._oLabel){this._oLabel.setText(T);}var O=this._getFieldRelevantForLabel();if(O&&O.getTextLabel){if(!O._oTextLabelSetByGroupElement){O._oTextLabelSetByGroupElement={oldText:O.getTextLabel()};}O.setTextLabel(T);}}}function h(){if(!this._bHorizontalLayoutUsed){return;}var i=this.getFields();var O;if(i.length>0){var N=this.getFields()[0];if(N instanceof V){var P=N.getItems();var Q=this._getLabel();if(P.length>0&&P[0]instanceof L){O=P[0];}this._bMoveLabelToVBox=true;if(O&&O!=Q){N.removeItem(0);if(O._bCreatedByGroupElement){this.setAggregation("_label",O,true);}else{this.setAggregation("label",O);}}if(Q&&O!=Q){N.insertItem(Q,0);}this._bMoveLabelToVBox=false;n.call(this);}}}function j(){if(this.getRequired&&this.getRequired()){return true;}var N=this.getParent();if(N&&N.isA("sap.m.VBox")){N=N.getParent();}var O=N.getElements();for(var i=0;i<O.length;i++){var P=O[i];if(P.getRequired&&P.getRequired()===true&&(!P.getEditable||P.getEditable())&&(!P.getContextEditable||P.getContextEditable())){return true;}}return false;}function k(){if(this.getDisplayOnly){if(!this.isPropertyInitial("displayOnly")){return this.getDisplayOnly();}var i=this.getParent();if(i&&i.isA("sap.m.VBox")){i=i.getParent();}var N=i.getParent();if(N){var O=N.getParent();if(O){return!O.getEditable();}}}return false;}function m(){var i=this.getParent();if(i&&i.isA("sap.m.VBox")){i=i.getParent();}if(i._oSetLabel&&!(typeof i._oSetLabel==="string")&&i._oSetLabel.getWrapping&&!i._oSetLabel.isPropertyInitial("wrapping")){return i._oSetLabel.getWrapping();}return true;}function n(){var i=this._getFieldRelevantForLabel();if(i){if(this._oLabel){this._oLabel.setLabelFor(i);}return;}var N=this.getFields();i=N.length>0?N[0]:null;if(i instanceof V){var O=i.getItems();if(O[1]instanceof H){i=O[1].getItems()[0];}else{i=O[1];}}var P=this._oLabel;if(P){P.setLabelFor(i);}else{P=this.getLabel();if(P instanceof C){P.setAlternativeLabelFor(i);}}}f.prototype.getLabel=function(){return this._oSetLabel;};f.prototype._getLabel=function(){if(this._oLabel){return this._oLabel;}else{return this._oSetLabel;}};f.prototype.getLabelControl=function(){if(this._bHorizontalLayoutUsed){return null;}else{return this._getLabel();}};f.prototype.getLabelText=function(){var i="";var N=this._getLabel();if(N){i=N.getText();}return i;};f.prototype._createLabel=function(i){var N=null;var O=this._getFieldRelevantForLabel();if(O){if(O.getShowLabel&&O.getShowLabel()){N=new S(O.getId()+'-label');if(i){if(!O._oTextLabelSetByGroupElement){O._oTextLabelSetByGroupElement={oldText:O.getTextLabel()};}O.setTextLabel(i);N.setText(i);}N.setLabelFor(O);}}else{N=new L(this.getId()+"-label",{text:i});}if(N){N._bCreatedByGroupElement=true;N.isRequired=j;N.isDisplayOnly=k;N.isWrapping=m;this._oLabel=N;if(!this._bHorizontalLayoutUsed){this.setAggregation("_label",N,true);}if(this._oSetLabel&&typeof this._oSetLabel!=="string"){this._oSetLabel.setAlternativeLabelFor(null);}}return N;};f.prototype.updateLabelOfFormElement=function(){var i=false,O=null;var N=this.getElements();var R=this._getFieldRelevantForLabel();var P=this._getLabel();var Q=false;if(P&&P._bCreatedByGroupElement){if(P instanceof S){if(!R||(P._sSmartFieldId&&P._sSmartFieldId!=R.getId())){Q=true;}}else if(R){Q=true;}if(Q){P.destroy();delete this._oLabel;P=null;if(this._oSetLabel&&!R){if(typeof this._oSetLabel==="string"){F.prototype.setLabel.apply(this,[this._oSetLabel]);P=this._oLabel;this._oLabel.isRequired=j;this._oLabel.isDisplayOnly=k;}else{P=this._oSetLabel;}h.call(this);}}}else if(P&&R){if(P==this._oLabel){P.destroy();delete this._oLabel;}P=null;}if(!P){if(this._oSetLabel){if(typeof this._oSetLabel==="string"){O=this._oSetLabel;}else{O=this._oSetLabel.getText();}}else{O="";}}if(!P&&N.length>0){P=this._createLabel(O);i=true;}if(P){if(P instanceof S){if(R&&R.setTextLabel&&R.getTextLabel()){P.setText(R.getTextLabel());}}_.call(this,P,R);}if(i){h.call(this);if(P&&P.setLabelFor&&!(P instanceof S)&&!R&&(N.length>0)){P.setLabelFor(N[0]);}}};f.prototype.setEditMode=function(i){var N=this.getElements();N.forEach(function(O){if(O instanceof a){if(!(O.data("editable")===false)){O.setContextEditable(i);}}});return this;};f.prototype.invalidateLabel=function(){var i=this._getLabel();if(i){i.invalidate();}};f.prototype._updateFormElementVisibility=function(){var i=this.getVisibleBasedOnElements();if(this._bVisibleElements!==i){this._bVisibleElements=i;if(this.isPropertyInitial("visible")){w.call(this);this.invalidate();}}};f.prototype._updateLayout=function(){var i=null;var N=null;var O=null;var U=this.getUseHorizontalLayout();var P;var Q=0;var R;if(U==this._bHorizontalLayoutUsed){return;}if(U&&!o.call(this)){return;}var T=this.getElements();var W=this._getLabel();this._bNoObserverChange=true;if(U){if(T.length>0){if(T[0].getLayoutData()){O=T[0].getLayoutData();}this.removeAllFields();if(T.length>1){for(Q=0;Q<T.length;Q++){R=T[Q];if(Q>0){q.call(this,R);}}N=t.call(this,T.slice(0));}if(N){P=[N];}else{P=T.slice(0);}i=s.call(this,P,W,O);this.addField(i);if(W){n.call(this);}}}else{var X=this.getFields();if(X[0]instanceof V){i=X[0];P=i.getItems();if(T.length>1&&P.length>0){if(W){if(P.length>1&&P[1]instanceof H){N=P[1];}}else if(P[0]instanceof H){N=P[0];}if(N){N.removeAllItems();N.destroy();}}i.removeAllItems();i.destroy();}this.removeAllFields();for(Q=0;Q<T.length;Q++){R=T[Q];r.call(this,R);this.addField(R);}if(W){if(W==this._oLabel){this.setAggregation("_label",W,true);}else{this.setAggregation("label",W);}}}this._bHorizontalLayoutUsed=U;this._bNoObserverChange=false;};function o(){if((!V||!H||!c||!d||!G)&&!this._bVBoxRequested){V=sap.ui.require("sap/m/VBox");H=sap.ui.require("sap/m/HBox");c=sap.ui.require("sap/m/FlexItemData");d=sap.ui.require("sap/ui/core/VariantLayoutData");G=sap.ui.require("sap/ui/layout/GridData");if(!V||!H||!c||!d||!G){sap.ui.require(["sap/m/VBox","sap/m/HBox","sap/m/FlexItemData","sap/ui/core/VariantLayoutData","sap/ui/layout/GridData"],p.bind(this));this._bVBoxRequested=true;}}if(V&&H&&c&&d&&G&&!this._bVBoxRequested){return true;}else{return false;}}function p(i,N,O,P,Q){V=i;H=N;c=O;d=P;G=Q;this._bVBoxRequested=false;if(!this._bIsBeingDestroyed){this._updateLayout();}}function q(i){var N=i.getLayoutData();if(N){if(N.getStyleClass&&!N.getStyleClass()){N.setStyleClass("sapUiCompGroupElementHBoxPadding");}}else{N=new c({styleClass:"sapUiCompGroupElementHBoxPadding"});N._bCreatedByGroupElement=true;i.setLayoutData(N);}}function r(i){var N=i.getLayoutData();if(N){if(N._bCreatedByGroupElement){N.destroy();}else if(N.getStyleClass&&N.getStyleClass()=="sapUiCompGroupElementHBoxPadding"){N.setStyleClass();}}}function s(i,N,O){if(!f._myVBox){f._myVBox=V.extend("SmartFormVBox",{metadata:{interfaces:["sap.ui.core.IFormContent"]},enhanceAccessibilityState:u,renderer:"sap.m.VBoxRenderer"});}this._bMoveLabelToVBox=true;var P=i.slice(0);if(N){P.splice(0,0,N);}var Q=new f._myVBox(this.getId()+"--VBox",{"items":P});this._bMoveLabelToVBox=false;Q.addStyleClass("sapUiCompGroupElementVBox");Q._oGroupElement=this;if(O&&(O instanceof G||O instanceof d||O.isA("sap.ui.layout.ResponsiveFlowLayoutData"))){Q.setLayoutData(O.clone());}v.call(this,Q);return Q;}function t(i){var N=new H(this.getId()+"--HBox",{"items":i});N._oGroupElement=this;N.enhanceAccessibilityState=u;return N;}function u(i,N){var O=this._oGroupElement._getLabel();if(O&&O!=i&&!(i instanceof H)){var P=N["labelledby"];if(!P){P=O.getId();}else{var Q=P.split(" ");if(((Q?Array.prototype.indexOf.call(Q,O.getId()):-1))<0){Q.splice(0,0,O.getId());P=Q.join(" ");}}N["labelledby"]=P;}return N;}f.prototype._updateGridDataSpan=function(){if(!this._bHorizontalLayoutUsed){return;}var i=this.getFields();if(i.length>0){var N=i[0];if(N instanceof V){v.call(this,N);}}};function v(N){var O=this.getParent();if(!O||!O.addGroupElement){return;}var P=O.getParent();while(P&&!P.addGroup&&P.getParent){P=P.getParent();}if(!P){return;}var Q="";var R=P.getLayout();if(R){Q=R.getGridDataSpan();}var T=N.getLayoutData();var U;if(T){if(!(T instanceof G)&&!(T instanceof d)&&Q){U=new G({span:Q});U._bFromGroupElement=true;var W=new d({multipleLayoutData:[T,U]});W._bFromGroupElement=true;N.setLayoutData(W);}else if(T instanceof G){if(T._bFromGroupElement){if(!Q){T.destroy();}else{T.setSpan(Q);}}}else if(T instanceof d){var X=false;T.getMultipleLayoutData().forEach(function(T){if(T instanceof G){X=true;if(T._bFromGroupElement){if(!Q){T.destroy();}else{T.setSpan(Q);}}}});if(!X&&Q){U=new G({span:Q});U._bFromGroupElement=true;T.addMultipleLayoutData(U);}if(T._bFromGroupElement&&T.getMultipleLayoutData().length==1){U=T.getMultipleLayoutData()[0];N.setLayoutData(U);T.destroy();}}}else if(Q){U=new G({span:Q});U._bFromGroupElement=true;N.setLayoutData(U);}var Y=this.getElements();for(var i=0;i<Y.length;i++){var Z=Y[i];if(Z&&Z.setControlContext){if(Q){Z.setControlContext(e.SmartFormGrid);}else{Z.setControlContext(e.Form);}}}}f.prototype._setLinebreak=function(N,O,P,Q){if(!this._bHorizontalLayoutUsed){return;}var R=this.getFields();if(R.length>0){var T=R[0];if(!(T instanceof V)){return;}var U=T.getLayoutData();if(U){if(U instanceof d){var W=U.getMultipleLayoutData();for(var i=0;i<W.length;i++){U=W[i];if(U instanceof G){U.setLinebreakXL(N);U.setLinebreakL(O);U.setLinebreakM(P);U.setLinebreakS(Q);}}}else if(U instanceof G){U.setLinebreakXL(N);U.setLinebreakL(O);U.setLinebreakM(P);U.setLinebreakS(Q);}}}};f.prototype.setVisible=function(i){var N=this.isVisible();F.prototype.setVisible.apply(this,arguments);if(N!=i){w.call(this);}return this;};f.prototype.isVisible=function(){if(this.isPropertyInitial("visible")){return this._bVisibleElements;}else{return this.getVisible();}};function w(){this.fireVisibleChanged({visible:this.isVisible()});if(this.getParent()){this.getParent()._updateLineBreaks();}}f.prototype.getFormElement=function(){return this;};f.prototype.addElement=function(i){if(!i){return this;}i=this.validateAggregation("elements",i,true);y.call(this,i);var N;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){N=this._oLabel._sSmartFieldId;}if(this._bHorizontalLayoutUsed){x.call(this,i,undefined,true);}else{this.addField(i);}if(N&&N!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(N);}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this;};f.prototype.insertElement=function(i,N){if(!i){return this;}i=this.validateAggregation("elements",i,true);y.call(this,i);var O;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){O=this._oLabel._sSmartFieldId;}if(this._bHorizontalLayoutUsed){x.call(this,i,N,false);}else{this.insertField(i,N);}if(O&&O!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(O);}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this;};f.prototype.getElements=function(){var i;var N;if(this._bHorizontalLayoutUsed){i=this.getFields();N=this._extractFields(i,true);}else{N=this.getFields();}return N;};f.prototype.indexOfElement=function(N){var O=-1;if(this._bHorizontalLayoutUsed){var P=this.getElements();for(var i=0;i<P.length;i++){if(N==P[i]){O=i;break;}}}else{O=this.indexOfField(N);}return O;};f.prototype.removeElement=function(i){var R;var N;if(this._oLabel&&this._oLabel._bCreatedByGroupElement&&this._oLabel._sSmartFieldId){N=this._oLabel._sSmartFieldId;}if(this._bHorizontalLayoutUsed){R=D.call(this,i,false);}else{R=this.removeField(i);}if(R){I.call(this,R);}if(N&&N!=this._oLabel._sSmartFieldId){this._oLabel.setLabelFor(N);}this.updateLabelOfFormElement();this._updateFormElementVisibility();return R;};f.prototype.removeAllElements=function(){var R;if(this._bHorizontalLayoutUsed){R=D.call(this,undefined,true);}else{R=this.removeAllFields();}if(R&&Array.isArray(R)){for(var i=0;i<R.length;i++){I.call(this,R[i]);}}this.updateLabelOfFormElement();this._updateFormElementVisibility();return R;};f.prototype.destroyElements=function(){if(this._bHorizontalLayoutUsed){var i=this.getFields();if(i.length>0){var N=this._getLabel();if(N){i[0].removeItem(N);if(N==this._oLabel){this.setAggregation("_label",N,true);}else{this.setAggregation("label",N);}}this.destroyFields();}}else{this.destroyFields();}this.updateLabelOfFormElement();this._updateFormElementVisibility();return this;};f.prototype._observeChanges=function(i){F.prototype._observeChanges.apply(this,arguments);if(i.object==this){switch(i.name){case"useHorizontalLayout":this._updateLayout();break;case"horizontalLayoutGroupElementMinWidth":b.error("HorizontalLayoutGroupElementMinWidth is deprecated",this);this._updateLayout();break;case"elementForLabel":this.updateLabelOfFormElement();break;default:break;}}else{B.call(this,i);}};function x(i,N,O){var P=this._getLabel();var Q=this.getFields();var R;var T;var U;if(Q.length>0){R=Q[0];}else{U=[i];var W=i.getLayoutData();R=s.call(this,U,P,W);this.addField(R);if(P){n.call(this);}return;}if(!(R instanceof V)){return;}U=R.getItems();if(P){if(U.length>1){T=U[1];}}else if(U.length>0){T=U[0];}if(T instanceof H){U=T.getItems();if((O||N>0)&&U.length>0){q.call(this,i);}if(O){T.addItem(i);}else{if(N==0&&U.length>0){q.call(this,U[0]);}T.insertItem(i,N);}}else{var X=T;U=[];if(X){R.removeItem(X);if(O||N>0){U.push(X);U.push(i);q.call(this,i);}else{U.push(i);U.push(X);q.call(this,X);}T=t.call(this,U);R.addItem(T);}else{R.addItem(i);}if(P){n.call(this);}}}function y(i){if(i.getEditable){if(!i.getEditable()){i.data("editable",false);}}this._oObserver.observe(i,{properties:["visible"]});if(i.attachInnerControlsCreated){i.attachInnerControlsCreated(this._updateFormElementLabel,this);}if(i.setControlContext){i.setControlContext(e.Form);}if(i.getMetadata().getProperty("mandatory")){this._oObserver.observe(i,{properties:["mandatory"]});}z.call(this,i);}function z(N){if(N instanceof a){var O=this.getCustomData();for(var i=0;i<O.length;i++){A.call(this,N,O[i]);}}}function A(i,N){if(i instanceof a&&l.smartform.inheritCostomDataToFields(N)){var O=N.clone();O._bFromGroupElement=true;O._sOriginalId=N.getId();i.addCustomData(O);}}function B(i){if(i.name=="mandatory"){this.invalidateLabel();}else if(i.name=="visible"){this._updateFormElementVisibility();}}function D(N,O){var P=this._getLabel();var Q=this.getFields();var R;var T;var U;var W;var X=false;var Y;if(Q.length>0){R=Q[0];}if(!(R instanceof V)){return null;}U=R.getItems();if(P){if(U.length>1){T=U[1];}}else if(U.length>0){T=U[0];}if(T instanceof H){if(O){W=T.removeAllItems();X=true;}else{W=T.removeItem(N);U=T.getItems();if(U.length>0){r.call(this,U[0]);if(U.length==1){Y=U[0];T.removeAllItems();R.removeItem(T);T.destroy();R.addItem(Y);}}}}else{if(O){W=R.removeAllItems();}else{W=R.removeItem(N);}if(W){X=true;}}if(X){if(P){R.removeItem(P);if(P==this._oLabel){this.setAggregation("_label",P,true);}else{this.setAggregation("label",P);}}this.removeField(R);R.destroy();}if(W){if(Array.isArray(W)){for(var i=0;i<W.length;i++){Y=W[i];r.call(this,Y);}}else{r.call(this,W);}}return W;}function I(i){if(i.detachInnerControlsCreated){i.detachInnerControlsCreated(this._updateFormElementLabel,this);}if(i.setControlContext){i.setControlContext(e.None);}K.call(this,i);J.call(this,i,this.getLabelText());}function J(i,N){if(i._oTextLabelSetByGroupElement){if(i.getTextLabel()==N){i.setTextLabel(i._oTextLabelSetByGroupElement.oldText);}delete i._oTextLabelSetByGroupElement;}}function K(N,O){if(N instanceof a){var P=N.getCustomData();for(var i=0;i<P.length;i++){var Q=P[i];if(Q._bFromGroupElement&&(!O||O==Q._sOriginalId)){N.removeCustomData(Q);Q.destroy();}}}}f.prototype._updateFormElementLabel=function(i){var R=this._getFieldRelevantForLabel();var N=this._getLabel();var O=i.oSource;var P=i.getParameters();if(N instanceof S&&O&&P&&O===R){N.updateLabelFor(P);}};f.prototype.addCustomData=function(N){if(!N){return this;}F.prototype.addCustomData.apply(this,arguments);var O=this.getElements();for(var i=0;i<O.length;i++){A.call(this,O[i],N);}return this;};f.prototype.insertCustomData=function(N,O){if(!N){return this;}F.prototype.insertCustomData.apply(this,arguments);var P=this.getElements();for(var i=0;i<P.length;i++){A.call(this,P[i],N);}return this;};f.prototype.removeCustomData=function(N){var O=F.prototype.removeCustomData.apply(this,arguments);if(O){var P=this.getElements();for(var i=0;i<P.length;i++){K.call(this,P[i],O.getId());}}return O;};f.prototype.removeAllCustomData=function(){var N=F.prototype.removeAllCustomData.apply(this,arguments);if(N.length>0){var O=this.getElements();for(var i=0;i<O.length;i++){K.call(this,O[i]);}}return N;};f.prototype.destroyCustomData=function(){F.prototype.destroyCustomData.apply(this,arguments);var N=this.getElements();for(var i=0;i<N.length;i++){K.call(this,N[i]);}return this;};f.prototype.getVisibleBasedOnElements=function(){var i=false;var N=this.getElements();if(N&&N.length>0){i=N.some(function(O){return O.getVisible();});}return i;};function M(){var T=this.getTooltip();if(!T||typeof T==="string"||T instanceof String){return T;}else{return T.getText();}}f.prototype.clone=function(N,O){var P=this.removeAllElements();var Q=F.prototype.clone.apply(this,arguments);for(var i=0;i<P.length;i++){var R=P[i];var T=R.clone(N,O);this.addElement(R);Q.addElement(T);}return Q;};return f;},true);
