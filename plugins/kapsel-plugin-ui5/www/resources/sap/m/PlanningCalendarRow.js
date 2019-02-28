/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['jquery.sap.global','sap/ui/core/Element','sap/ui/core/Control','./StandardListItem','./StandardListItemRenderer','sap/ui/core/Renderer','./library','sap/ui/unified/library','sap/ui/unified/DateRange','sap/ui/unified/CalendarRow','sap/ui/unified/CalendarRowRenderer','sap/m/ColumnListItem','sap/m/ColumnListItemRenderer'],function(q,E,C,S,a,R,l,u,D,b,c,d,e){"use strict";var P=E.extend("sap.m.PlanningCalendarRow",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Data"},text:{type:"string",group:"Data"},icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},nonWorkingDays:{type:"int[]",group:"Misc",defaultValue:null},nonWorkingHours:{type:"int[]",group:"Misc",defaultValue:null},selected:{type:"boolean",group:"Data",defaultValue:false},key:{type:"string",group:"Data",defaultValue:null}},aggregations:{appointments:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"appointment"},intervalHeaders:{type:"sap.ui.unified.CalendarAppointment",multiple:true,singularName:"intervalHeader"},_nonWorkingDates:{type:"sap.ui.unified.DateRange",multiple:true,visibility:"hidden"}}}});P.PC_FOREIGN_KEY_NAME="relatedToPCDateRange";P.AGGR_NONWORKING_DATES_NAME="_nonWorkingDates";var f=S.extend("CalenderRowHeader",{metadata:{associations:{parentRow:{type:"sap.m.PlanningCalendarRow",multiple:false}}},setParentRow:function(I){this.setAssociation("parentRow",I,true);if(!I){this._oRow=undefined;}else if(typeof I=="string"){this._oRow=sap.ui.getCore().byId(I);}else{this._oRow=I;}return this;},renderer:R.extend(a)});CalenderRowHeaderRenderer.openItemTag=function(r,L){r.write("<div");};CalenderRowHeaderRenderer.closeItemTag=function(r,L){r.write("</div>");};CalenderRowHeaderRenderer.renderTabIndex=function(r,L){};var g=R.extend(c);g.getLegendItems=function(o){var t=[],L,s=o.getLegend();if(s){L=sap.ui.getCore().byId(s);if(L){t=L.getAppointmentItems?L.getAppointmentItems():L.getItems();}else{q.sap.log.error("PlanningCalendarLegend with id '"+s+"' does not exist!",o);}}return t;};var h=b.extend("CalendarRowInPlanningCalendar",{constructor:function(){b.apply(this,arguments);},renderer:g});var i=d.extend("ColumnListItemInPlanningCalendar",{metadata:{associations:{planningCalendarRow:{type:"sap.m.PlanningCalendarRow",multiple:false,visibility:"hidden"}}},renderer:e});i.prototype.getCustomData=function(){return sap.ui.getCore().byId(this.getAssociation("planningCalendarRow")).getCustomData();};P.prototype.init=function(){var I=this.getId();var o=new f(I+"-Head",{parentRow:this,iconDensityAware:false});var j=new h(I+"-CalRow",{checkResize:false,updateCurrentTime:false,ariaLabelledBy:I+"-Head"});j._oPlanningCalendarRow=this;j.getAppointments=function(){if(this._oPlanningCalendarRow){return this._oPlanningCalendarRow.getAppointments();}else{return[];}};j.getIntervalHeaders=function(){if(this._oPlanningCalendarRow){return this._oPlanningCalendarRow.getIntervalHeaders();}else{return[];}};this._oColumnListItem=new i(this.getId()+"-CLI",{cells:[o,j],planningCalendarRow:this});};P.prototype.exit=function(){if(this._oColumnListItem.getCells()[1]){this._oColumnListItem.getCells()[1].destroy();}this._oColumnListItem.destroy();this._oColumnListItem=undefined;};P.prototype.setTooltip=function(t){this.setAggregation("tooltip",t,true);this._oColumnListItem.getCells()[0].setTooltip(t);return this;};P.prototype.setTitle=function(t){this.setProperty("title",t,true);this._oColumnListItem.getCells()[0].setTitle(t);return this;};P.prototype.setText=function(t){this.setProperty("text",t,true);this._oColumnListItem.getCells()[0].setDescription(t);if(t){this._oColumnListItem.getCells()[1].addStyleClass("sapMPlanCalRowLarge");}else{this._oColumnListItem.getCells()[1].removeStyleClass("sapMPlanCalRowLarge");}return this;};P.prototype.setIcon=function(I){this.setProperty("icon",I,true);this._oColumnListItem.getCells()[0].setIcon(I);return this;};P.prototype.setNonWorkingDays=function(n){this.setProperty("nonWorkingDays",n,true);this.getCalendarRow().setNonWorkingDays(n);return this;};P.prototype.setNonWorkingHours=function(n){this.setProperty("nonWorkingHours",n,true);this.getCalendarRow().setNonWorkingHours(n);return this;};P.prototype.invalidate=function(o){if(!o||!(o instanceof sap.ui.unified.CalendarAppointment)){E.prototype.invalidate.apply(this,arguments);}else if(this._oColumnListItem){this.getCalendarRow().invalidate(o);}};P.prototype.removeAppointment=function(o){var r=this.removeAggregation("appointments",o,true);this.getCalendarRow().invalidate();return r;};P.prototype.removeAllAppointments=function(){var r=this.removeAllAggregation("appointments",true);this.getCalendarRow().invalidate();return r;};P.prototype.destroyAppointments=function(){var o=this.destroyAggregation("appointments",true);this.getCalendarRow().invalidate();return o;};P.prototype.removeIntervalHeader=function(o){var r=this.removeAggregation("intervalHeaders",o,true);this.getCalendarRow().invalidate();return r;};P.prototype.removeAllIntervalHeaders=function(){var r=this.removeAllAggregation("intervalHeaders",true);this.getCalendarRow().invalidate();return r;};P.prototype.destroyIntervalHeaders=function(){var o=this.destroyAggregation("intervalHeaders",true);this.getCalendarRow().invalidate();return o;};P.prototype.setSelected=function(s){this.setProperty("selected",s,true);this._oColumnListItem.setSelected(s);return this;};P.prototype.getColumnListItem=function(){return this._oColumnListItem;};P.prototype.getCalendarRow=function(){if(!this._oColumnListItem){return null;}return this._oColumnListItem.getCells()[1];};P.prototype.applyFocusInfo=function(F){this.getCalendarRow().applyFocusInfo(F);return this;};P.prototype.addAggregation=function(A,o,s){if(b.AGGR_NONWORKING_DATES_NAME===A){this.getCalendarRow().addAggregation(b.AGGR_NONWORKING_DATES_NAME,this._buildCalendarRowDateRange(o),s);}return E.prototype.addAggregation.apply(this,arguments);};P.prototype.insertAggregation=function(A,o,I,s){if(P.AGGR_NONWORKING_DATES_NAME===A){this.getCalendarRow().insertAggregation(b.AGGR_NONWORKING_DATES_NAME,this._buildCalendarRowDateRange(o),I,s);}return E.prototype.insertAggregation.apply(this,arguments);};P.prototype.removeAggregation=function(A,o,s){var r;if(P.AGGR_NONWORKING_DATES_NAME===A&&this.getAggregation(P.AGGR_NONWORKING_DATES_NAME)){r=this.getCalendarRow().getAggregation(b.AGGR_NONWORKING_DATES_NAME).filter(function(n){return n.data(b.PCROW_FOREIGN_KEY_NAME)===o.getId();});if(r.length){this.getCalendarRow().removeAggregation("_nonWorkingDates",r[0]);}}return E.prototype.removeAggregation.apply(this,arguments);};P.prototype.removeAllAggregation=function(A,s){if(P.AGGR_NONWORKING_DATES_NAME===A){this.getCalendarRow().removeAllAggregation(b.AGGR_NONWORKING_DATES_NAME,s);}return E.prototype.removeAllAggregation.apply(this,arguments);};P.prototype.destroyAggregation=function(A,s){if(P.AGGR_NONWORKING_DATES_NAME===A){if(this.getCalendarRow()){this.getCalendarRow().destroyAggregation(b.AGGR_NONWORKING_DATES_NAME,s);}}return E.prototype.destroyAggregation.apply(this,arguments);};P.prototype._buildCalendarRowDateRange=function(s){var r=new D();if(s.getStartDate()){r.setStartDate(new Date(s.getStartDate().getTime()));}if(s.getEndDate()){r.setEndDate(new Date(s.getEndDate().getTime()));}r.data(b.PCROW_FOREIGN_KEY_NAME,s.getId());return r;};return P;});
