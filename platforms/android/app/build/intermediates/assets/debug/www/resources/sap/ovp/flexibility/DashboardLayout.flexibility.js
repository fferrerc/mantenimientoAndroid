sap.ui.define(["sap/ovp/changeHandler/HideCardContainer","sap/ovp/changeHandler/UnhideCardContainer","sap/ovp/changeHandler/UnhideControl","sap/ovp/changeHandler/RemoveCardContainer","sap/ui/dt/OverlayRegistry","sap/ui/core/ComponentContainer","sap/m/MessageToast","sap/ovp/cards/rta/SettingsDialogConstants","sap/ovp/cards/SettingsUtils","sap/ovp/app/resources"],function(H,U,a,R,O,C,M,S,b,c){"use strict";return{"moveControls":{"changeHandler":"default","layers":{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"unhideControl":a,"unhideCardContainer":U,"hideCardContainer":H,"removeCardContainer":R,"editCardSettings":{changeHandler:{applyChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getContent(),g=f.newAppDescriptor,h=m.byId(g.id),i=e.getLayout(),l=i.getDashboardLayoutModel(),L=i.getDashboardLayoutUtil(),j=l.getCardById(g.id),k=L.calculateCardProperties(g.id),n=g.settings.defaultSpan&&g.settings.defaultSpan.rows,N=g.settings.defaultSpan&&g.settings.defaultSpan.cols,q=l.getColCount()+1,r=[],F=false;o.setRevertData(f.oldAppDescriptor);if(h){if(g.settings.tabs){var D=g.settings.selectedKey;if(!D||D<1){D=1;}S.tabFields.forEach(function(t){var v=g.settings.tabs[D-1][t];if(t!=='entitySet'||(t==='entitySet'&&v)){delete g.settings[t];}if(v){g.settings[t]=v;}});}if(typeof n==='number'){if(n===0){j.dashboardLayout.showOnlyHeader=true;n=Math.ceil((k.headerHeight+2*L.CARD_BORDER_PX)/L.getRowHeightPx());}else{j.dashboardLayout.showOnlyHeader=false;if(g.template==='sap.ovp.cards.list'||g.template==='sap.ovp.cards.table'){j.dashboardLayout.noOfItems=n;}}}if(N){if(j.dashboardLayout.column+N>q){j.dashboardLayout.maxColSpan=N;N=q-j.dashboardLayout.column;}F=true;}if(F){l._arrangeCards(j,{row:n,column:N},'resize',r);l._removeSpaceBeforeCard(r);L._positionCards(l.aCards);F=false;}var s=h.getComponentInstance();s.destroy();}e.recreateRTAClonedCard(g);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getRevertData(),g=m.byId(f.id),h=e.getLayout(),l=h.getDashboardLayoutModel(),L=h.getDashboardLayoutUtil(),i=l.getCardById(f.id),j=f.settings.defaultSpan&&f.settings.defaultSpan.rowSpan,k=f.settings.defaultSpan&&f.settings.defaultSpan.colSpan,s=f.settings.defaultSpan&&f.settings.defaultSpan.showOnlyHeader,n=[];if(g){i.dashboardLayout.rowSpan=j;i.dashboardLayout.colSpan=k;i.dashboardLayout.showOnlyHeader=s;l._arrangeCards(i,{row:j,column:k},'resize',n);l._removeSpaceBeforeCard(n);L._positionCards(l.aCards);var q=g.getComponentInstance();q.destroy();}e.recreateRTAClonedCard(f);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"newCardSettings":{changeHandler:{applyChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getContent();o.setRevertData(f.id);var n=new C(m.getId()+"--"+f.id),A=p.appComponent,u=e.getUIModel(),g=u.getProperty("/cards"),h=e.getLayout(),l=h.getDashboardLayoutUtil(),L=h.getDashboardLayoutModel(),N=(f.id.indexOf("newStaticLinkListCard_N")!==-1)&&!b.checkClonedCard(f.id),j=(f.id.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(f.id);if(j){var s=f.settings.selectedKPI,k=new sap.ui.model.odata.v2.ODataModel(s.ODataURI,{'annotationURI':s.ModelURI,'defaultCountMode':sap.ui.model.odata.CountMode.None}),q=f.model;m.setModel(k,q);A.setModel(k,q);}f.settings.baseUrl=e._getBaseUrl();if(N||j){f.settings.newCard=true;L._setCardSpanFromDefault(f);f.dashboardLayout.row=1;f.dashboardLayout.column=1;}else{f.settings.cloneCard=true;}var I=-1,i;for(i=0;i<g.length;i++){if(f.id.lastIndexOf("customer."+g[i].id,0)===0){I=i;var r=L.getCardById(g[i].id);f.dashboardLayout=jQuery.extend(true,{},r.dashboardLayout);var t=f.dashboardLayout.column+f.dashboardLayout.colSpan;f.dashboardLayout.column=t<L.getColCount()?t:1;break;}}g.splice(I+1,0,f);l.getCards().splice(I+1,0,f);u.setProperty("/cards",g);h.insertContent(n,I+1);setTimeout(function(){var v=O.getOverlay(n);v.setSelected(true);v.focus();var w=(N||j)?c.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_NEW"):c.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_CLONE");M.show(w,{duration:10000});},0);e.recreateRTAClonedCard(f);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl(),A=p.appComponent,e=m.getController(),s=o.getRevertData();var f=m.byId(s),u=e.getUIModel(),g=u.getProperty("/cards"),h=e.getLayout(),l=h.getDashboardLayoutUtil(),L=h.getDashboardLayoutModel(),k=l.getCards();var I=-1,i,j,n=-1;for(i=0;i<g.length;i++){if(s===g[i].id){I=i;break;}}g.splice(I,1);for(j=0;j<k.length;j++){if(s===k[j].id){n=j;break;}}k.splice(n,1);L._removeSpaceBeforeCard();u.setProperty("/cards",g);if(f){var q=f.getComponentInstance(),r=q.getComponentData(),N=(r.cardId.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(s);if(N){var t=r.modelName,v=m.getModel(t);v.destroy();m.setModel(null,t);A.setModel(null,t);}q.destroy();}h.removeContent(I);f.destroy();o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"dragAndDropUI":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController(),d=o.getContent(),e=m.getLayout(),l=e.getDashboardLayoutUtil(),L=e.getDashboardLayoutModel(),f=L.getCardById(d.cardId),s='C'+L.getColCount(),g=[];o.setRevertData(d);L._arrangeCards(f,{row:d.dashboardLayout[s].row,column:d.dashboardLayout[s].column},'drag',g);L._removeSpaceBeforeCard(g);l._positionCards(L.aCards);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl().getController(),e=o.getContent(),f=m.getLayout(),l=f.getDashboardLayoutUtil(),L=f.getDashboardLayoutModel(),g=L.getCardById(e.cardId),s='C'+L.getColCount(),h=[];L._arrangeCards(g,{row:e.dashboardLayout[s].oldRow,column:e.dashboardLayout[s].oldColumn},'drag',h);if(e.dashboardLayout[s].oldColSpan){L._arrangeCards(g,{row:e.dashboardLayout[s].rowSpan,column:e.dashboardLayout[s].oldColSpan},'resize',h);}L._removeSpaceBeforeCard(h);l._positionCards(L.aCards);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"manageCardsForDashboardLayout":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.storeIncomingDeltaChanges(o.getContent());return true;},completeChangeContent:function(o,s,p){o.setContent(s.content);return;},revertChange:function(o,d,p){return;}},layers:{"USER":true}},"viewSwitch":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"visibility":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"USER":true}},"dragOrResize":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"VENDOR":true,"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"manageCardsForEasyScanLayout":{changeHandler:{applyChange:function(o,p,P){return true;},completeChangeContent:function(o,s,p){o.setContent(s.content);return;},revertChange:function(o,d,p){return;}},layers:{"USER":true}}};},true);