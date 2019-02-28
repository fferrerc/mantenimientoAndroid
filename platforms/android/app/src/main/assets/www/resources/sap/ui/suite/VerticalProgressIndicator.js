/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2018 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/thirdparty/jquery",'sap/ui/core/Control','sap/ui/core/EnabledPropagator','./library',"./VerticalProgressIndicatorRenderer"],function(q,C,E,l,V){"use strict";var a=C.extend("sap.ui.suite.VerticalProgressIndicator",{metadata:{library:"sap.ui.suite",properties:{percentage:{type:"int",group:"Misc",defaultValue:null}},associations:{ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"},ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}},events:{press:{}}}});E.call(a.prototype);a.prototype.setPercentage=function(p){var b=this.getPercentage();if(b==p){return this;}this.oBar=window.document.getElementById(this.getId()+'-bar');b=p;if(b<0||b==Number.NaN){b=0;}if(b>100){b=100;}var P=Math.round(b*58/100);var c=58-P;this.setProperty('percentage',p,true);q(this.oBar).css("top",c);q(this.oBar).css("height",P);if(!this.oThis){this.oThis=q(document.getElementById(this.getId()));}this.oThis.attr('aria-valuenow',p+'%');return this;};a.prototype.onclick=function(e){this.firePress({});e.preventDefault();e.stopPropagation();};a.prototype.focus=function(){var d=this.getDomRef();if(d){d.focus();}};return a;});
