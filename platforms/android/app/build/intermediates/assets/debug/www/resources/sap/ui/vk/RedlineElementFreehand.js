/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["jquery.sap.global","./RedlineElement"],function(q,R){"use strict";var a=R.extend("sap.ui.vk.RedlineElementFreehand",{metadata:{library:"sap.ui.vk",properties:{path:{type:"float[]",defaultValue:null}}}});a.prototype.init=function(){};a.prototype.setPath=function(p){this.setProperty("path",p,true);var d=this.getDomRef();if(d){d.setAttribute("d",this._getProcessedPath());}};a.prototype.edit=function(o,b){var p=this.getParent();var t=p._toVirtualSpace(o,b);var c=this.getPath()||[];c.push(t.x-this.getOriginX(),t.y-this.getOriginY());this.setPath(c);var d=this.getDomRef();if(d){d.setAttribute("d",this._getProcessedPath());}return this;};a.prototype.applyZoom=function(z){this.setProperty("path",this.getPath().map(function(v){return v*z;}),true);return this;};a.prototype._getProcessedPath=function(){var p=this.getParent(),o=p._toPixelSpace(this.getOriginX(),this.getOriginY());var d="";(this.getPath()||[]).forEach(function(e,i){e=p._toPixelSpace(e);if(i===0){d+="M "+(o.x+e);}else if(i===1){d+=" "+(o.y+e);}else{d+=" "+(i%2===0?"L "+(o.x+e):(o.y+e));}});return d;};a.prototype.render=function(r){r.write("<path");r.writeElementData(this);r.writeAttribute("d",this._getProcessedPath());r.writeAttribute("stroke",this.getStrokeColor());r.writeAttribute("stroke-width",this.getStrokeWidth());if(this.getStrokeDashArray().length>0){r.writeAttribute("stroke-dasharray",this.getStrokeDashArray().toString());}r.writeAttribute("opacity",this.getOpacity());r.writeAttribute("fill","none");r.write("></path>");};a.prototype.exportJSON=function(){return q.extend(true,R.prototype.exportJSON.call(this),{type:sap.ui.vk.Redline.ElementType.Freehand,version:1,path:(this.getPath()||[]).slice()});};a.prototype.importJSON=function(j){if(j.type===sap.ui.vk.Redline.ElementType.Freehand){if(j.version===1){R.prototype.importJSON.call(this,j);if(j.hasOwnProperty("path")){this.setPath(j.path.slice());}}else{q.sap.log.error("wrong version number");}}else{q.sap.log.error("Redlining JSON import: Wrong element type");}return this;};a.prototype.exportSVG=function(){var e=document.createElementNS(sap.ui.vk.Redline.svgNamespace,"path");e.setAttribute("x",this.getOriginX());e.setAttribute("y",this.getOriginY());e.setAttribute("d",this.getPath());e.setAttribute("fill","none");e.setAttribute("stroke",this.getStrokeColor());e.setAttribute("stroke-width",this.getStrokeWidth());if(this.getStrokeDashArray().length>0){e.setAttribute("stroke-dasharray",this.getStrokeDashArray().toString());}if(this.getOpacity()<1){e.setAttribute("opacity",this.getOpacity());}return e;};a.prototype.importSVG=function(s){if(s.tagName==="path"){R.prototype.importSVG.call(this,s);if(s.getAttribute("d")){this.setPath(s.getAttribute("d").split(",").map(parseFloat));}}else{q.sap.log.error("Redlining SVG import: Wrong element type");}return this;};return a;});