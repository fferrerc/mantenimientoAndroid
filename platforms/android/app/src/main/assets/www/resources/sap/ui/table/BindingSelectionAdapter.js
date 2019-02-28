/*
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./SelectionAdapter','./library'],function(S,l){"use strict";var a=l.SelectionMode;var B=S.extend("sap.ui.table.BindingSelectionAdapter");B.prototype.exit=function(){var b=this._getBinding();if(b){b.detachEvent("change",this._onBindingChange);}S.prototype.exit.call(this);};B.prototype.addSelectionInterval=function(i,I){if(this.getSelectionMode()===a.None){return this;}var b=this._getBinding();if(b&&b.findNode&&b.addSelectionInterval){if(this.getSelectionMode()===a.Single){i=I;b.setSelectionInterval(i,I);}b.addSelectionInterval(i,I);}return this;};B.prototype.clearSelection=function(){var b=this._getBinding();if(b&&b.clearSelection){b.clearSelection();}return this;};B.prototype.getSelectedIndex=function(){var b=this._getBinding();if(b&&b.findNode){return b.getSelectedIndex();}};B.prototype.getSelectedIndices=function(){var b=this._getBinding();if(b&&b.findNode&&b.getSelectedIndices){return b.getSelectedIndices();}};B.prototype.isIndexSelectable=function(i){var b=this._getBinding();if(b){return b.isIndexSelectable(i);}else{return false;}};B.prototype.isIndexSelected=function(i){var b=this._getBinding();if(b&&b.isIndexSelected){return b.isIndexSelected(i);}else{return false;}};B.prototype.removeSelectionInterval=function(i,I){var b=this._getBinding();if(b&&b.findNode&&b.removeSelectionInterval){b.removeSelectionInterval(i,I);}return this;};B.prototype.selectAll=function(){if(this.getSelectionMode()===a.None){return this;}var b=this._getBinding();if(b&&b.selectAll){b.selectAll();}return this;};B.prototype.setSelectedIndex=function(i){if(this.getSelectionMode()===a.None){return this;}if(i===-1){this.clearSelection();}var b=this._getBinding();if(b&&b.findNode&&b.setNodeSelection){b.setSelectedIndex(i);}return this;};B.prototype.setSelectionInterval=function(i,I){if(this.getSelectionMode()===a.None){return this;}var b=this._getBinding();if(b&&b.findNode&&b.setSelectionInterval){if(this.getSelectionMode()===a.Single){i=I;}b.setSelectionInterval(i,I);}return this;};B.prototype.setSelectionMode=function(s){if(this.getSelectionMode()!==s){this.clearSelection();}this.setProperty("selectionMode",s,true);return this;};B.prototype._setBinding=function(b){var c=this._getBinding();S.prototype._setBinding.call(this,b);if(c!==b){if(b){b.attachEvent("change",this._onBindingChange,this);}if(c){c.detachEvent("change",this._onBindingChange);}}};B.prototype._onBindingChange=function(e){var r=typeof(e)==="object"?e.getParameter("reason"):e;if(r==="sort"||r==="filter"){this.clearSelection();}};return B;});
