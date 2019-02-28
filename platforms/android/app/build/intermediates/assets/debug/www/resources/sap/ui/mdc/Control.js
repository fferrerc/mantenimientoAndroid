/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control"],function(C){"use strict";var C=C.extend("sap.ui.mdc.Control",{metadata:{library:"sap.ui.mdc",properties:{width:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},height:{type:"sap.ui.core.CSSSize",group:"Dimension",defaultValue:null,invalidate:true},metadataDelegate:{type:"string",group:"Data"},personalization:{type:"any",multiple:false}}},renderer:C.renderer});C.prototype.setMetadataDelegate=function(m){this.oDelegatePromise=new Promise(function(r,a){sap.ui.require([m],function(M){this.DELEGATE=M;r(M);}.bind(this));}.bind(this));return this.setProperty("metadataDelegate",m,true);};C.prototype.getPropertyInfos=function(c){if(this._aMetadata){return Promise.resolve(this._aMetadata);}return this.oDelegatePromise.then(function(){this._aMetadata=this.DELEGATE.retrieveAllMetadata(c.oModel,c.sPath);return this._aMetadata;}.bind(this));};return C;},true);
