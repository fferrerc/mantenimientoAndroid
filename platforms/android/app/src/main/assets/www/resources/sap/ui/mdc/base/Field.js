/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/base/ManagedObjectObserver','./FieldBase','./FieldBaseRenderer','./Condition'],function(M,F,a,C){"use strict";var b=F.extend("sap.ui.mdc.base.Field",{metadata:{library:"sap.ui.mdc",properties:{value:{type:"any",defaultValue:null},additionalValue:{type:"any",defaultValue:null}},events:{change:{parameters:{value:{type:"string"},valid:{type:"boolean"}}}},defaultProperty:"value"},renderer:a});b.prototype.init=function(){F.prototype.init.apply(this,arguments);this.setMaxConditions(1);this.setProperty("_onlyEEQ",true,true);this._oObserver.observe(this,{properties:["value","additionalValue"]});};b.prototype.exit=function(){F.prototype.exit.apply(this,arguments);};b.prototype.bindProperty=function(n,B){if(n==="value"&&!B.formatter){B.targetType="raw";if(!this._oDataType&&B.type){this._oDataType=B.type;}}F.prototype.bindProperty.apply(this,arguments);};b.prototype._handleModelContextChange=function(e){F.prototype._handleModelContextChange.apply(this,arguments);if(!this._oDataType){var B=this.getBinding("value");if(B){this._oDataType=B.getType();}}};b.prototype.setMaxConditions=function(m){if(m!==1){throw new Error("Only one condition allowed for Field "+this);}return this.setProperty("maxConditions",m,true);};b.prototype._observeChanges=function(c){F.prototype._observeChanges.apply(this,arguments);var o;var v;if(c.name==="value"){var A=this.getAdditionalValue();v=c.current;if(A){o=C.createItemCondition(this.getFieldPath(),v,A);}else{o=C.createItemCondition(this.getFieldPath(),v);}this.setConditions([o]);}if(c.name==="additionalValue"){v=this.getValue();if(v||v===0){if(c.current){o=C.createItemCondition(this.getFieldPath(),v,c.current);}else{o=C.createItemCondition(this.getFieldPath(),v);}this.setConditions([o]);}}};b.prototype._fireChange=function(c,v,w){var V;var A;if(v){if(c.length===1){V=c[0].values[0];if(c[0].values[1]){A=c[0].values[1];}}this.setProperty("value",V,true);this.setProperty("additionalValue",A,true);}else{V=w;}this.fireChange({value:V,valid:v});};return b;},true);
