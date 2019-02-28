sap.ui.define(["sap/ovp/changeHandler/HideCardContainer","sap/ovp/changeHandler/UnhideCardContainer","sap/ovp/changeHandler/UnhideControl","sap/ovp/changeHandler/RemoveCardContainer","sap/ui/dt/OverlayRegistry","sap/ui/core/ComponentContainer","sap/m/MessageToast","sap/ovp/cards/rta/SettingsDialogConstants","sap/ovp/cards/SettingsUtils","sap/ovp/app/resources"],function(H,U,a,R,O,C,M,S,b,c){"use strict";return{"moveControls":{"changeHandler":"default","layers":{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"unhideControl":a,"unhideCardContainer":U,"hideCardContainer":H,"removeCardContainer":R,"editCardSettings":{changeHandler:{applyChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getContent(),g=f.newAppDescriptor,h=m.byId(g.id);o.setRevertData(f.oldAppDescriptor);if(h){if(g.settings.tabs){var D=g.settings.selectedKey;if(!D||D<1){D=1;}S.tabFields.forEach(function(j){var v=g.settings.tabs[D-1][j];if(j!=='entitySet'||(j==='entitySet'&&v)){delete g.settings[j];}if(v){g.settings[j]=v;}});}var i=h.getComponentInstance();i.destroy();}e.recreateRTAClonedCard(g);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getRevertData(),g=m.byId(f.id);if(g){var h=g.getComponentInstance();h.destroy();}e.recreateRTAClonedCard(f);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"newCardSettings":{changeHandler:{applyChange:function(o,d,p){var m=p.appComponent.getRootControl(),e=m.getController(),f=o.getContent();o.setRevertData(f.id);var n=new C(m.getId()+"--"+f.id),A=p.appComponent,u=e.getUIModel(),g=u.getProperty("/cards"),h=e.getLayout(),N=(f.id.indexOf("newStaticLinkListCard_N")!==-1)&&!b.checkClonedCard(f.id),j=(f.id.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(f.id);if(j){var s=f.settings.selectedKPI,k=new sap.ui.model.odata.v2.ODataModel(s.ODataURI,{'annotationURI':s.ModelURI,'defaultCountMode':sap.ui.model.odata.CountMode.None}),l=f.model;m.setModel(k,l);A.setModel(k,l);}f.settings.baseUrl=e._getBaseUrl();if(N||j){f.settings.newCard=true;}else{f.settings.cloneCard=true;}var I=-1,i;for(i=0;i<g.length;i++){if(f.id.lastIndexOf("customer."+g[i].id,0)===0){I=i;break;}}g.splice(I+1,0,f);u.setProperty("/cards",g);h.insertContent(n,I+1);setTimeout(function(){var q=O.getOverlay(n);q.setSelected(true);q.focus();var r=(N||j)?c.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_NEW"):c.getText("OVP_KEYUSER_TOAST_MESSAGE_FOR_CLONE");M.show(r,{duration:10000});},0);e.recreateRTAClonedCard(f);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl(),A=p.appComponent,e=m.getController(),s=o.getRevertData();var f=m.byId(s),u=e.getUIModel(),g=u.getProperty("/cards"),h=e.getLayout();var I=-1,i;for(i=0;i<g.length;i++){if(s===g[i].id){I=i;break;}}g.splice(I,1);u.setProperty("/cards",g);if(f){var j=f.getComponentInstance(),k=j.getComponentData(),n=(k.cardId.indexOf("newKPICard_N")!==-1)&&!b.checkClonedCard(s);if(n){var l=k.modelName,N=m.getModel(l);N.destroy();m.setModel(null,l);A.setModel(null,l);}j.destroy();}h.removeContent(I);f.destroy();o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"dragAndDropUI":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController(),d=o.getContent(),e=jQuery.extend(true,{},d),u=m.getUIModel(),f=u.getProperty("/cards"),g=m.getLayout(),v;v=e.position;e.position=e.oldPosition;e.oldPosition=v;o.setRevertData(e);v=f[d.position];f[d.position]=f[d.oldPosition];f[d.oldPosition]=v;u.setProperty("/cards",f);var t=g.getContent()[d.position],h=g.getContent()[d.oldPosition];g.removeContent(h);g.insertContent(h,d.position);g.removeContent(t);g.insertContent(t,d.oldPosition);setTimeout(function(){var i=O.getOverlay(h);i.setSelected(true);i.focus();},0);return true;},revertChange:function(o,d,p){var m=p.appComponent.getRootControl().getController(),e=o.getRevertData(),u=m.getUIModel(),f=u.getProperty("/cards"),g=m.getLayout(),v;v=f[e.position];f[e.position]=f[e.oldPosition];f[e.oldPosition]=v;u.setProperty("/cards",f);var t=g.getContent()[e.position],h=g.getContent()[e.oldPosition];g.removeContent(h);g.insertContent(h,e.position);g.removeContent(t);g.insertContent(t,e.oldPosition);setTimeout(function(){var i=O.getOverlay(h);i.setSelected(true);i.focus();},0);o.resetRevertData();return true;},completeChangeContent:function(o,s,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"manageCardsForEasyScanLayout":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.storeIncomingDeltaChanges(o.getContent());return true;},completeChangeContent:function(o,s,p){o.setContent(s.content);return;},revertChange:function(o,d,p){return;}},layers:{"USER":true}},"viewSwitch":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}},"visibility":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"USER":true}},"position":{changeHandler:{applyChange:function(o,p,P){var m=P.appComponent.getRootControl().getController();m.appendIncomingDeltaChange(o);return true;},completeChangeContent:function(o,s,p){return;},revertChange:function(o,d,p){return;}},layers:{"CUSTOMER_BASE":true,"CUSTOMER":true,"USER":true}}};},true);