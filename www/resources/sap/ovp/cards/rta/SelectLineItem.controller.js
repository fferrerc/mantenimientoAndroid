sap.ui.define(["jquery.sap.global","sap/ui/core/mvc/Controller","sap/ui/model/Filter","sap/ui/model/FilterOperator"],function(q,C,F,a){'use strict';return C.extend("sap.ovp.cards.rta.SelectLineItem",{onInit:function(){},onAfterRendering:function(){},_filterTable:function(e,f,I){var Q=e.getParameter("query"),g=null,b=[];for(var i=0;i<f.length;i++){b.push(new F(f[i],a.Contains,Q));}if(Q){g=new F(b,false);}this.getView().byId(I).getBinding("items").filter(g,"Application");},filterTable:function(e){var v=this.getView(),m=v.getModel(),l;this._filterTable(e,["Label","VisibleFields"],"LineItemTable");l=v.byId("LineItemTable").getBinding("items").getLength();m.setProperty("/NoOfLineItem",l);m.refresh(true);},onItemPress:function(e){var s=e.getSource(),S=s.getBindingContext(),v=S.getObject();this.updateLineItemPath(v);}});});
