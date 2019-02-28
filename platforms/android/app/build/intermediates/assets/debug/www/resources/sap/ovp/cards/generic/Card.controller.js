sap.ui.define(["sap/ui/core/mvc/Controller","sap/ovp/cards/ActionUtils","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/generic/app/navigation/service/PresentationVariant","sap/ovp/cards/CommonUtils","sap/ovp/cards/OVPCardAsAPIUtils","sap/ui/core/ResizeHandler","sap/ui/core/format/NumberFormat","sap/ovp/cards/AnnotationHelper","sap/ui/model/odata/AnnotationHelper","sap/m/MessageBox","sap/ui/generic/app/navigation/service/NavError","sap/ui/core/CustomData","sap/ui/model/FilterOperator","sap/ui/model/json/JSONModel","sap/m/Dialog","sap/m/Button","sap/m/MessageToast","sap/ui/core/TextDirection","sap/ovp/cards/loading/State","sap/ui/generic/app/library","jquery.sap.global","sap/ovp/app/resources"],function(C,A,S,P,a,O,R,N,b,c,M,d,e,F,J,D,B,f,T,L,G,q,g){"use strict";return C.extend("sap.ovp.cards.generic.Card",{onInit:function(){this.oCardComponent=this.getOwnerComponent();this.oCardComponentData=this.oCardComponent&&this.oCardComponent.getComponentData();this.oMainComponent=this.oCardComponentData&&this.oCardComponentData.mainComponent;this.sCardId=this.oCardComponentData.cardId;var s=this.getView().mPreprocessors.xml[0].ovpCardProperties.oData.state;if(s!=="Loading"&&s!=="Error"){var h=this.getView().byId("ovpCardHeader");if(!!h){h.attachBrowserEvent("click",this.onHeaderClick.bind(this));h.addEventDelegate({onkeydown:function(E){if(!E.shiftKey&&(E.keyCode==13||E.keyCode==32)){E.preventDefault();this.onHeaderClick();}}.bind(this)});}}var n=this.getView().byId("kpiNumberValue");if(n){n.addEventDelegate({onAfterRendering:function(){var $=n.$();var i=$.find(".sapMNCValueScr");var j=$.find(".sapMNCScale");i.attr("aria-label",i.text());j.attr("aria-label",j.text());var k=this.getView().byId("ovpCardHeader").getDomRef();var o=this.getOwnerComponent().getComponentData();if(!!o&&!!o.appComponent){var l=o.appComponent;if(!!l.getModel("ui")){var u=l.getModel("ui");if(!!u.getProperty("/containerLayout")&&u.getProperty("/containerLayout")==="resizable"){var m=o.appComponent.getDashboardLayoutUtil();if(!!m){m.setKpiNumericContentWidth(k);}}}}}.bind(this)});}},exit:function(){if(this.resizeHandlerId){R.deregister(this.resizeHandlerId);}},onAfterRendering:function(){var o=this.getCardPropertiesModel();this.enableClick=true;var s=o.getProperty("/contentFragment");var h=this.getOwnerComponent().getComponentData();this._handleCountHeader();this._handleKPIHeader();var i=o.getProperty("/selectedKey");if(i&&o.getProperty("/state")!=='Loading'){var j=this.getView().byId("ovp_card_dropdown");if(j){j.setSelectedKey(i);}}try{var h=this.getOwnerComponent().getComponentData();if(h&&h.appComponent){var k=h.appComponent;if(k.getModel('ui')){var u=k.getModel('ui');if(u.getProperty('/containerLayout')==='resizable'){var l=k.getDashboardLayoutUtil();if(l){this.oDashboardLayoutUtil=l;this.cardId=h.cardId;if(l.isCardAutoSpan(h.cardId)){this.resizeHandlerId=R.register(this.getView(),function(U){q.sap.log.info('DashboardLayout autoSize:'+U.target.id+' -> '+U.size.height);l.setAutoCardSpanHeight(U);});}}}}}}catch(m){q.sap.log.error("DashboardLayout autoSpan check failed.");}if(this.oDashboardLayoutUtil&&this.oDashboardLayoutUtil.isCardAutoSpan(this.cardId)){var $=q("#"+this.oDashboardLayoutUtil.getCardDomId(this.cardId));if(this.oView.$().outerHeight()>$.innerHeight()){this.oDashboardLayoutUtil.setAutoCardSpanHeight(null,this.cardId,this.oView.$().height());}}var I=0;if(h&&h.mainComponent){var n=h.mainComponent;if(n.bGlobalFilterLoaded){I=this.checkNavigation();}}else if(O.checkIfAPIIsUsed(this)){I=this.checkAPINavigation();}var p=this.getCardPropertiesModel();var r=p.getProperty("/state");if(r!=="Loading"&&r!=="Error"){var t=p.getProperty("/template");if(t==="sap.ovp.cards.stack"){if(!I){var v=this.getView().byId('ViewAll');if(v){v=v.getDomRef();q(v).remove();}}}}if(I){if(s?s!=="sap.ovp.cards.quickview.Quickview":true){if(s==="sap.ovp.cards.stack.Stack"){var w=this.getView().getDomRef();var x=q(w).find('.sapOvpCardContentRightHeader');if(x.length!==0){x.addClass('sapOvpCardNavigable');}}else{this.getView().addStyleClass("sapOvpCardNavigable");}}if(s&&s==="sap.ovp.cards.quickview.Quickview"){var H=this.byId("ovpCardHeader");if(H){H.addStyleClass("sapOvpCardNavigable");}}}else{if(s){this.getView().addStyleClass("ovpNonNavigableItem");var H=this.byId("ovpCardHeader");if(H){H.$().removeAttr('role');H.addStyleClass('ovpNonNavigableItem');}var y=this.checkLineItemNavigation();if(!y){switch(s){case"sap.ovp.cards.list.List":var z=this.getView().byId("listItem");if(z){z.setType("Inactive");}break;case"sap.ovp.cards.table.Table":var z=this.getView().byId("tableItem");if(z){z.setType("Inactive");}break;case"sap.ovp.cards.linklist.LinkList":if(!this.checkNavigationForLinkedList()){var z=this.getView().byId("ovpCLI");if(z){z.setType("Inactive");}}break;}}}}var E=this.getView().byId("ovp_card_dropdown");var K=this.getView().byId("toolbar");if(K){var Q=K.getDomRef();q(Q).attr("aria-label",E.getSelectedItem().getText());}},checkNavigation:function(){var o=this.getCardPropertiesModel();if(this.checkHeaderNavForChart()){return 0;}var E=this.getEntityType();if(E){if(o){var i=o.getProperty("/identificationAnnotationPath");var s=i;var h=o.getProperty("/contentFragment");if(h&&(h==="sap.ovp.cards.stack.Stack"||h==="sap.ovp.cards.quickview.Quickview")){var j=(i)?i.split(","):[];if(j&&j.length>1){if(h==="sap.ovp.cards.stack.Stack"){s=j[0];}else{s=j[1];}}}var r=E[s];if(this.isNavigationInAnnotation(r)){return 1;}if(o&&o.getProperty("/template")==="sap.ovp.cards.charts.analytical"){var k=o.getProperty("/kpiAnnotationPath");if(E&&k){var l=E[k];if(l&&l.Detail){var m=l.Detail.SemanticObject&&l.Detail.SemanticObject.String;var n=l.Detail.Action&&l.Detail.Action.String;if(m&&n){return 1;}}}}}}else if(o&&o.getProperty("/template")==="sap.ovp.cards.linklist"&&o.getProperty("/staticContent")&&o.getProperty("/targetUri")){return 1;}return 0;},checkNavigationForLinkedList:function(){if(this.getEntityType()){var E=this.getEntityType();var l=E['com.sap.vocabularies.UI.v1.LineItem'];if(l&&(l[0].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||l[0].RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithUrl")){return true;}}return false;},checkLineItemNavigation:function(){if(this.getEntityType()){var E=this.getEntityType();var o=this.getCardPropertiesModel();if(o){var s=o.getProperty("/annotationPath");var r=E[s];return this.isNavigationInAnnotation(r);}}},isNavigationInAnnotation:function(r){if(r&&r.length){for(var i=0;i<r.length;i++){var I=r[i];if(I.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"||I.RecordType==="com.sap.vocabularies.UI.v1.DataFieldForAction"||I.RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"){return 1;}}}return 0;},checkAPINavigation:function(){var o=this.getOwnerComponent().getComponentData(),h=o.fnCheckNavigation&&typeof o.fnCheckNavigation==="function",i=h?o.fnCheckNavigation:null;if(i){if(i()){return true;}}else{if(this.checkNavigation()){return true;}}return false;},onHeaderClick:function(){if(O.checkIfAPIIsUsed(this)){if(this.checkAPINavigation()){a.onHeaderClicked();}}else{var o=this.getCardPropertiesModel();var t=o.getProperty("/template");var s=o.getProperty("/targetUri");if(t=="sap.ovp.cards.linklist"&&o.getProperty("/staticContent")!==undefined&&s){window.location.href=s;}else if(o.getProperty("/staticContent")!==undefined&&s===""){return;}else if(this.checkHeaderNavForChart()){return;}else{this.doNavigation(this.getView().getBindingContext());}}},checkHeaderNavForChart:function(){var o=this.getCardPropertiesModel();var t=o.getProperty("/template");var n=o.getProperty("/navigation");if(n=="noHeaderNav"&&(t=="sap.ovp.cards.charts.analytical"||"sap.ovp.cards.charts.smart.chart")){return true;}else{return false;}},resizeCard:function(h){q.sap.log.info(h);if(this.resizeHandlerId){R.deregister(this.resizeHandlerId);this.resizeHandlerId=null;}},_handleCountHeader:function(){var h=this.getView().byId("ovpCountHeader");if(h){var i=this.getCardItemsBinding();if(i){this.setHeaderCounter(i,h);i.attachDataReceived(function(){this.setHeaderCounter(i,h);}.bind(this));i.attachChange(function(){this.setHeaderCounter(i,h);}.bind(this));}}},setHeaderCounter:function(i,h){var t=i.getLength();var j=i.getCurrentContexts().length;var o,k="";var n=N.getIntegerInstance({minFractionDigits:0,maxFractionDigits:1,decimalSeparator:".",style:"short"});j=parseFloat(j,10);var l=this.getOwnerComponent().getComponentData();if(l&&l.appComponent){var m=l.appComponent;if(m.getModel('ui')){var u=m.getModel('ui');if(u.getProperty('/containerLayout')!=='resizable'){if(t!==0){t=n.format(Number(t));}if(j!==0){j=n.format(Number(j));}}else{o=m.getDashboardLayoutUtil().dashboardLayoutModel.getCardById(l.cardId);}}}if(j===0){k="";}else if(o&&o.dashboardLayout.showOnlyHeader){k=g.getText("Count_Header_Total",[t]);}else if(t!=j){k=g.getText("Count_Header",[j,t]);}h.setText(k);var p=h.$();p.attr("aria-label",k);},_handleKPIHeader:function(){var k,s;if(this.getView()&&this.getView().getDomRef()){k=this.getView().getDomRef().getElementsByClassName("numericContentHbox");s=this.getView().getDomRef().getElementsByClassName("noDataSubtitle");}else{return;}if(k||s){var K=this.getKPIBinding();if(K){K.attachDataReceived(function(E){var U=E.getParameter("data")&&E.getParameter("data").results&&E.getParameter("data").results[0];this._setSubTitleWithUnitOfMeasure(U);var t=K.getLength();if(k[0]){k[0].style.visibility=null;if(t===0){k[0].style.visibility='hidden';}else{k[0].style.visibility='visible';}}if(s.length!==0){s[0].style.display="none";if(t===0){s[0].style.display="flex";}}}.bind(this));}}},getKPIBinding:function(){var n=this.byId("kpiHBoxNumeric"),k=n&&n.getBindingInfo("items")&&n.getBindingInfo("items").binding;return k;},_setSubTitleWithUnitOfMeasure:function(U){var o=this.getCardPropertiesModel();if(!!o){var h=o.getData();var s=this.getView().byId("SubTitle-Text");if(!!s){s.setText(h.subTitle);if(!!h&&!!h.entityType&&!!h.dataPointAnnotationPath){var E=o.getData().entityType;var i=h.dataPointAnnotationPath.split("/");var j=i.length===1?E[h.dataPointAnnotationPath]:E[i[0]][i[1]];var m;if(j&&j.Value&&j.Value.Path){m=j.Value.Path;}else if(j&&j.Description&&j.Description.Value&&j.Description.Value.Path){m=j.Description.Value.Path;}if(!!m){var p=a.getUnitColumn(m,E);var u;if(!!p&&!!U){u=U[p];}else{u=a.getUnitColumn(m,E,true);}var k=g.getText("SubTitle_IN");if(!!h.subTitle&&!!k&&!!u){s.setText(h.subTitle+" "+k+" "+u);var l=s.getAggregation("customData");if(l){var n;for(n in l){var r=l[n];if(r.getKey()==="aria-label"){r.setValue(h.subTitle+" "+k+" "+u);break;}}}}}}}}},getCardItemsBinding:function(){},onActionPress:function(E){var s=E.getSource(),o=this._getActionObject(s),h=s.getBindingContext();if(o.type.indexOf("DataFieldForAction")!==-1){this.doAction(h,o);}else{this.doNavigation(h,o);}},_getActionObject:function(s){var h=s.getCustomData();var o={};for(var i=0;i<h.length;i++){o[h[i].getKey()]=h[i].getValue();}return o;},doNavigation:function(o,n){if(!this.enableClick){return;}this.enableClick=false;setTimeout(function(){this.enableClick=true;}.bind(this),1000);if(!this.oMainComponent){return;}if(!n){n=this.getEntityNavigationEntries(o)[0];}var h=q.extend(true,{},o);var i=q.extend(true,{},n);var j=this.oMainComponent.doCustomNavigation&&this.oMainComponent.doCustomNavigation(this.sCardId,h,i);var E=this.oMainComponent.templateBaseExtension&&this.oMainComponent.templateBaseExtension.doExtensionNavigation&&this.oMainComponent.templateBaseExtension.doExtensionNavigation(this.sCardId,h,i);var k;if(j){k=j;}if(E){k=E;}if(k){var t=k.type;if(t&&typeof t==="string"&&t.length>0){t=t.split(".").pop().split("/").pop().toLowerCase();switch(t){case"datafieldwithurl":k.type="com.sap.vocabularies.UI.v1.DataFieldWithUrl";break;case"datafieldforintentbasednavigation":k.type="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation";break;}n=k;}}function p(){if(n){switch(n.type){case"com.sap.vocabularies.UI.v1.DataFieldWithUrl":this.doNavigationWithUrl(o,n);break;case"com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation":this.doIntentBasedNavigation(o,n,false);break;case"com.sap.vocabularies.UI.v1.KPIDetailType":this.doIntentBasedNavigation(o,n,false);break;}}}if(!this.oMainComponent.oAppStatePromise){p.call(this);}else{this.oMainComponent.oAppStatePromise.then(p.bind(this));}},doNavigationWithUrl:function(o,n){if(!sap.ushell.Container){return;}var p=sap.ushell.Container.getService("URLParsing");if(!(p.isIntentUrl(n.url))){window.open(n.url);}else{var h=p.parseShellHash(n.url);var w=h.appSpecificRoute?true:false;this.doIntentBasedNavigation(o,h,w);}},fnHandleError:function(E){if(E instanceof d){if(E.getErrorCode()==="NavigationHandler.isIntentSupported.notSupported"){M.show(g.getText("OVP_NAV_ERROR_NOT_AUTHORIZED_DESC"),{title:g.getText("OVP_GENERIC_ERROR_TITLE")});}else{M.show(E.getErrorCode(),{title:g.getText("OVP_GENERIC_ERROR_TITLE")});}}},doCrossApplicationNavigation:function(I,n){var s="#"+I.semanticObject+'-'+I.action;if(I.params){var o=this.oCardComponent&&this.oCardComponent.getComponentData();var h=o&&o.appComponent;if(h){var p=h._formParamString(I.params);s=s+p;}}var t=this;if(!sap.ushell.Container){return;}sap.ushell.Container.getService("CrossApplicationNavigation").isIntentSupported([s]).done(function(r){if(r[s].supported===true){if(!!n.params){if(typeof n.params=='string'){try{n.params=JSON.parse(n.params);}catch(k){q.sap.log.error("Could not parse the Navigation parameters");return;}}}var o=t.getOwnerComponent().getComponentData();var l=o?o.globalFilter:undefined;var u=l&&l.getUiState({allFilters:false});var m=u?JSON.stringify(u.getSelectionVariant()):"{}";l=q.parseJSON(m);if(!n.params){n.params={};}if(!!l&&!!l.SelectOptions){for(var i=0;i<l.SelectOptions.length;i++){var v=l.SelectOptions[i].Ranges;if(!!v){var w=[];for(var j=0;j<v.length;j++){if(v[j].Sign==="I"&&v[j].Option==="EQ"){w.push(v[j].Low);}}n.params[l.SelectOptions[i].PropertyName]=w;}}}sap.ushell.Container.getService("CrossApplicationNavigation").toExternal(n);}else{var E=new d("NavigationHandler.isIntentSupported.notSupported");t.fnHandleError(E);}}).fail(function(){q.sap.log.error("Could not get authorization from isIntentSupported");});},doIntentBasedNavigation:function(o,i,u){if(!sap.ushell.Container){return;}var p,n,h,E=o?o.getObject():null;var j=this.getCardPropertiesModel(),s=j.getProperty("/customParams");if(o&&typeof o.getAllData==="function"&&s){h=o.getAllData();}else if(j.getProperty("/staticContent")){h={iStaticLinkListIndex:i.iStaticLinkListIndex,bStaticLinkListIndex:true};}if(E&&E.__metadata){delete E.__metadata;}var k=a.getNavigationHandler();if(k){if(i){p=this._getEntityNavigationParameters(E,h,o);n={target:{semanticObject:i.semanticObject,action:i.action},appSpecificRoute:i.appSpecificRoute,params:p.sNavSelectionVariant};var l={};if(p.sNavPresentationVariant){l.presentationVariant=p.sNavPresentationVariant;}if(u){if(i&&i.semanticObject&&i.action){var m=this.getCardPropertiesModel().getProperty("/staticParameters");n.params=(!!m)?m:{};this.doCrossApplicationNavigation(i,n);}}else{k.navigate(n.target.semanticObject,n.target.action,n.params,null,this.fnHandleError,l);}}}},doAction:function(o,h){this.actionData=A.getActionInfo(o,h,this.getEntityType());if(this.actionData.allParameters.length>0){this._loadParametersForm();}else{this._callFunction();}},getEntityNavigationEntries:function(o,s){var n=[];var E=this.getEntityType();var h=this.getCardPropertiesModel();var j=h.getProperty("/template");if(!E){return n;}if(!s&&!o){if(!this.oCardComponentData.settings.identificationAnnotationPath){var k=h.getProperty("/kpiAnnotationPath");if(k&&j==="sap.ovp.cards.charts.analytical"){s=k;var r=E[s];var l=r&&r.Detail;var m=l.SemanticObject&&l.SemanticObject.String;var p=l.Action&&l.Action.String;if(l.RecordType==="com.sap.vocabularies.UI.v1.KPIDetailType"){if(m&&p){n.push({type:l.RecordType,semanticObject:m,action:p,label:""});}else{q.sap.log.error("Invalid Semantic object and action configured for annotation "+l.RecordType);}}}}}if(!s){var I=h.getProperty("/identificationAnnotationPath");var t=(I)?I.split(","):[];if(t&&t.length>1){s=t[0];}else{s=I;}}var u=E[s];if(q.isArray(u)){u=b.sortCollectionByImportance(u);for(var i=0;i<u.length;i++){if(u[i].RecordType==="com.sap.vocabularies.UI.v1.DataFieldForIntentBasedNavigation"){n.push({type:u[i].RecordType,semanticObject:u[i].SemanticObject.String,action:u[i].Action.String,label:u[i].Label?u[i].Label.String:null});}if(u[i].RecordType==="com.sap.vocabularies.UI.v1.DataFieldWithUrl"&&!u[i].Url.UrlRef){var v=this.getView().getModel();var w=v.oMetaModel;var x=w.createBindingContext(E.$path);var y=c.format(x,u[i].Url);var z=new e({key:"url",value:y});if(o&&j==="sap.ovp.cards.charts.analytical"){v=o.getModel();}z.setModel(v);z.setBindingContext(o);var U=z.getValue();n.push({type:u[i].RecordType,url:U,value:u[i].Value.String,label:u[i].Label?u[i].Label.String:null});}}}return n;},getModel:function(){return this.getView().getModel();},getMetaModel:function(){if(this.getModel()){return this.getModel().getMetaModel();}},getCardPropertiesModel:function(){if(!this.oCardPropertiesModel||q.isEmptyObject(this.oCardPropertiesModel)){this.oCardPropertiesModel=this.getView().getModel("ovpCardProperties");}return this.oCardPropertiesModel;},getEntitySet:function(){if(!this.entitySet){var E=this.getCardPropertiesModel().getProperty("/entitySet");this.entitySet=this.getMetaModel().getODataEntitySet(E);}return this.entitySet;},getEntityType:function(){if(!this.entityType){if(this.getMetaModel()&&this.getEntitySet()){this.entityType=this.getMetaModel().getODataEntityType(this.getEntitySet().entityType);}}return this.entityType;},getCardContentContainer:function(){if(!this.cardContentContainer){this.cardContentContainer=this.getView().byId("ovpCardContentContainer");}return this.cardContentContainer;},_processCustomParameters:function(o,s,h){var j=this.getCardPropertiesModel();if(!this.oMainComponent||!j){return;}var k;if(o&&o.bStaticLinkListIndex){var l=j.getProperty("/staticContent");k=l[o.iStaticLinkListIndex]["customParams"];o=null;}else{k=j.getProperty("/customParams");}if(!k||!this.oMainComponent.onCustomParams){return;}var m=this.oMainComponent.onCustomParams(k);if(!m||!q.isFunction(m)){return;}var n=q.extend(true,{},o);var p=q.extend(true,{},s);var r=m(n,p);if(!r||(!q.isArray(r)&&!q.isPlainObject(r))){return;}var I=q.isPlainObject(r);if(I&&q.isEmptyObject(r)){return;}var t=I&&(r.bIgnoreEmptyString||r.ignoreEmptyString);var u=I?(r.aSelectionVariant||r.selectionVariant):r;if(!q.isArray(u)){return;}var i,v,w,x,V,y;v=u.length;for(i=0;i<v;i++){w=u[i];if(!w){continue;}x=w.path;V=w.value1;y=w.value2;if(!x||typeof x!=="string"||x===""){q.sap.log.error("Custom Variant property path '"+x+"' should be valid string");continue;}if(!(V||V===0||(V===""&&t))){continue;}V=V.toString();y=y&&y.toString();if(V===""&&t){s.removeSelectOption(x);}if(o){delete o[x];}if(h){delete h[x];}s.addSelectOption(x,w.sign,w.operator,V,y);}if(t){this._removeEmptyStringsFromSelectionVariant(s);}return t;},_getEntityNavigationParameters:function(E,o,h){var j={};var s,p,k;var l=this.getOwnerComponent().getComponentData();var m=l?l.globalFilter:undefined;var n=this.getCardPropertiesModel();var r=n&&n.getProperty("/staticContent");if(!r){var t=b.getCardSelections(this.getCardPropertiesModel());var u=t.filters;var v=t.parameters;var w=this.getEntityType();u&&u.forEach(function(a1){a1.path=a1.path.replace("/",".");switch(a1.operator){case F.NE:a1.operator=F.EQ;a1.sign="E";break;case F.Contains:a1.operator="CP";var b1=a1.value1;a1.value1="*"+b1+"*";break;case F.EndsWith:a1.operator="CP";var b1=a1.value1;a1.value1="*"+b1;break;case F.StartsWith:a1.operator="CP";var b1=a1.value1;a1.value1=b1+"*";}});t.filters=u;if(h&&E&&E.hasOwnProperty("$isOthers")){var x=h.getOtherNavigationDimensions();for(var y in x){var z=x[y];for(var i=0;i<z.length;i++){t.filters.push({path:y,operator:"EQ",value1:z[i],sign:"E"});}}}v&&v.forEach(function(a1){a1.path=a1.path.replace("/",".");});t.parameters=v;var H=b.getCardSorters(this.getCardPropertiesModel());if(E){var y;for(var i=0;w.property&&i<w.property.length;i++){y=w.property[i].name;var I=E[y];if(E.hasOwnProperty(y)){if(q.isArray(E[y])&&E[y].length===1){j[y]=E[y][0];}else if(q.type(I)!=="object"){j[y]=I;}}}}var K=n&&n.getProperty("/kpiAnnotationPath");var Q=n&&n.getProperty("/template");if(K&&Q==="sap.ovp.cards.charts.analytical"){var U=w[K];var V=U&&U.Detail;if(V&&V.RecordType==="com.sap.vocabularies.UI.v1.KPIDetailType"){j["kpiID"]=U.ID.String;}}p=H&&new P(H);s=this._buildSelectionVariant(m,t);k=n&&n.getProperty("/staticParameters");}else{var W=m&&m.getUiState({allFilters:false});var X=W?JSON.stringify(W.getSelectionVariant()):"{}";s=new S(X);if(r[o.iStaticLinkListIndex].params){k=r[o.iStaticLinkListIndex].params;}else if(r[o.iStaticLinkListIndex].staticParameters){k=r[o.iStaticLinkListIndex].staticParameters;}}var Y;if(o&&!o.bStaticLinkListIndex){Y=this._processCustomParameters(o,s,j);}else if(o&&o.bStaticLinkListIndex){Y=this._processCustomParameters(o,s);}else{Y=this._processCustomParameters(j,s);}var Z=Y?G.navigation.service.SuppressionBehavior.ignoreEmptyString:undefined;if(k){for(var y in k){if(!j.hasOwnProperty(y)){j[y]=k[y];}}}var $=a.getNavigationHandler();var _=$&&$.mixAttributesAndSelectionVariant(j,s.toJSONString(),Z);if(!r){this._removeSensitiveAttributesFromNavSelectionVariant(w,_);}return{sNavSelectionVariant:_?_.toJSONString():null,sNavPresentationVariant:p?p.toJSONString():null};},_removeSensitiveAttributesFromNavSelectionVariant:function(E,n){for(var i=0;i<E.property.length;i++){if(E.property[i]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"]&&E.property[i]["com.sap.vocabularies.PersonalData.v1.IsPotentiallySensitive"].Bool){delete n._mSelectOptions[E.property[i].name];}}},_removeEmptyStringsFromSelectionVariant:function(s){var p=s.getParameterNames();for(var i=0;i<p.length;i++){if(s.getParameter(p[i])===""){s.removeParameter(p[i]);}}var h=s.getSelectOptionsPropertyNames();for(i=0;i<h.length;i++){var k=s.getSelectOption(h[i]);for(var j=0;j<k.length;j++){if(k[j].Low===""&&!k[j].High){k.splice(j,1);j--;}}if(k.length===0){s.removeSelectOption(h[i]);}}return s;},_buildSelectionVariant:function(o,h){var u=o&&o.getUiState({allFilters:false});var s=u?JSON.stringify(u.getSelectionVariant()):"{}";var k=new S(s);var l,v,V,p;var m=h.filters;var n=h.parameters;for(var i=0;i<m.length;i++){l=m[i];if(l.path&&l.operator&&typeof l.value1!=="undefined"){v=l.value1.toString();V=(typeof l.value2!=="undefined")?l.value2.toString():undefined;k.addSelectOption(l.path,l.sign,l.operator,v,V);}}var r,t,w;for(var j=0;j<n.length;j++){p=n[j];if(!p.path||!p.value){continue;}r=p.path.split("/").pop();r=r.split(".").pop();if(r.indexOf("P_")===0){t=r;w=r.substr(2);}else{t="P_"+r;w=r;}if(k.getParameter(t)){continue;}if(k.getParameter(w)){continue;}k.addParameter(r,p.value);}return k;},_loadParametersForm:function(){var p=new J();p.setData(this.actionData.parameterData);var t=this;var o=new D('ovpCardActionDialog',{title:this.actionData.sFunctionLabel,afterClose:function(){o.destroy();}}).addStyleClass("sapUiNoContentPadding");var h=new B({text:this.actionData.sFunctionLabel,press:function(E){var m=A.getParameters(E.getSource().getModel(),t.actionData.oFunctionImport);o.close();t._callFunction(m,t.actionData.sFunctionLabel);}});var i=new B({text:"Cancel",press:function(){o.close();}});o.setBeginButton(h);o.setEndButton(i);var j=function(E){var m=A.mandatoryParamsMissing(E.getSource().getModel(),t.actionData.oFunctionImport);h.setEnabled(!m);};var k=A.buildParametersForm(this.actionData,j);o.addContent(k);o.setModel(p);o.open();},_callFunction:function(u,h){var p={batchGroupId:"Changes",changeSetId:"Changes",urlParameters:u,forceSubmit:true,context:this.actionData.oContext,functionImport:this.actionData.oFunctionImport};var t=this;var o=new Promise(function(r,i){var m=t.actionData.oContext.getModel();var s;s="/"+p.functionImport.name;m.callFunction(s,{method:p.functionImport.httpMethod,urlParameters:p.urlParameters,batchGroupId:p.batchGroupId,changeSetId:p.changeSetId,headers:p.headers,success:function(j,k){r(k);},error:function(j){j.actionText=h;i(j);}});});o.then(function(r){return f.show(g.getText("Toast_Action_Success"),{duration:1000});},function(E){var i=a.showODataErrorMessages(E);if(i===""&&E.actionText){i=g.getText("Toast_Action_Error")+' "'+E.actionText+'"'+".";}return M.error(i,{title:g.getText("OVP_GENERIC_ERROR_TITLE"),onClose:null,styleClass:"",initialFocus:null,textDirection:T.Inherit});});},setErrorState:function(){var o=this.getOwnerComponent();if(!o||!o.oContainer){return;}var h=o.oContainer;var i=this.getCardPropertiesModel();var j={name:"sap.ovp.cards.loading",componentData:{model:this.getView().getModel(),settings:{category:i.getProperty("/category"),title:i.getProperty("/title"),description:i.getProperty("/description"),entitySet:i.getProperty("/entitySet"),state:L.ERROR,template:i.getProperty("/template")}}};var l=sap.ui.component(j);h.setComponent(l);setTimeout(function(){o.destroy();},0);},changeSelection:function(s,h,o){if(!h){var i=this.getView().byId("ovp_card_dropdown");s=parseInt(i.getSelectedKey(),10);}var t={};if(!h){t=this.getCardPropertiesModel().getProperty("/tabs")[s-1];}else{t=o.tabs[s-1];}var u={cardId:this.getOwnerComponent().getComponentData().cardId,selectedKey:s};for(var p in t){u[p]=t[p];}if(O.checkIfAPIIsUsed(this)){O.recreateCard(u,this.getOwnerComponent().getComponentData());}else{this.getOwnerComponent().getComponentData().mainComponent.recreateCard(u);}},getItemHeight:function(o,s,h){if(!!o){var i=o.getView().byId(s);var H=0;if(!!i){if(h){if(i.getItems()[0]&&i.getItems()[0].getDomRef()){H=q(i.getItems()[0].getDomRef()).outerHeight(true);}}else{if(i.getDomRef()){H=q(i.getDomRef()).outerHeight(true);}}}return H;}},getHeaderHeight:function(){var h=this.getItemHeight(this,'ovpCardHeader'),o=this.getOwnerComponent()?this.getOwnerComponent().getComponentData():null;if(o&&o.appComponent){var i=o.appComponent.getDashboardLayoutUtil(),j=i.getDashboardLayoutModel().getCardById(o.cardId);if(h!==0){j.dashboardLayout.headerHeight=h;}}return h;}});});