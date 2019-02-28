sap.ui.define(["jquery.sap.global","sap/ui/base/Object","sap/ui/core/mvc/ControllerExtension","sap/ui/generic/app/navigation/service/NavError","sap/ui/generic/app/navigation/service/SelectionVariant","sap/ui/comp/state/UIState","sap/base/Log"],function(q,B,C,N,S,U,L){"use strict";var d="sap.suite.ui.generic.template.customData",a="sap.suite.ui.generic.template.extensionData",b="sap.suite.ui.generic.template.genericData";var I=["INIT","DATA_SUITE","CANCEL","RESET","SET_VM_ID"];function n(o){if(o){for(var p in o){o[p]=null;}}}function f(o,O){var k=Object.keys(o);if(k.length!==Object.keys(O).length){return true;}for(var i=0;i<k.length;i++){var K=k[i];var p=o[K];var P=O[K];if(p.length!==P.length){return true;}for(var j=0;j<p.length;j++){if(p[j]!==P[j]){return true;}}}return false;}function l(m,D){if(sap.ui.support){var i=L.getLevel();if(i<L.Level.INFO){L.setLevel(L.Level.INFO);}}var s;if(typeof D==="string"){s=D;}else{s="";var c="";for(var k in D){s=s+c+k+": "+D[k];c="; ";}}L.info(m,s,"sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");}function g(s,c,t){var o=t.oCommonUtils.getNavigationHandler();var e=c.getOwnerComponent().getSmartVariantManagement();var r={appStateKey:"",urlParams:{},selectionVariant:"",tableVariantId:""};var h=false;var j=null;var A=Promise.resolve();var D=false;var k=false;var E=c.byId("editStateFilter");var m;var p=null;var u=null;s.oSmartFilterbar.setSuppressSelection(true);var v=(function(){var i;return function(){i=i||s.oSmartFilterbar.getNonVisibleCustomFilterNames();return i;};})();function w(){return D;}function x(){var d1={};var e1=[];var f1=v();for(var i=0;i<f1.length;i++){var g1=f1[i];if(s.oSmartFilterbar.isVisibleInFilterBarByName(g1)){e1.push(g1);}}var h1={suppressDataSelection:!D,visibleCustomFields:e1};d1[b]=h1;if(E){h1.editStateFilter=E.getSelectedKey();var i1=t.oComponentUtils.getTemplatePrivateModel();var j1=i1.getProperty("/listReport/activeObjectEnabled");h1.activeStateFilter=j1;}var k1=s.oMultipleViewsHandler.getContentForIappState();if(k1){var l1=k1.mode==="single"?"tableViewData":"tableTabData";h1[l1]=k1.state;}if(s.oWorklistData.bWorkListEnabled){var m1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";var n1={"searchString":m1};h1.Worklist=n1;}var o1={};d1[d]=o1;c.getCustomAppStateDataExtension(o1);var p1;var q1=true;var r1=function(s1,t1){if(!(s1 instanceof C)){throw new Error("State must always be set with respect to a ControllerExtension");}if(!q1){throw new Error("State must always be provided synchronously");}if(t1){p1=p1||Object.create(null);var u1=s1.getMetadata().getNamespace();p1[u1]=t1;}};c.templateBaseExtension.provideExtensionAppStateData(r1);q1=false;if(p1){d1[a]=p1;}return d1;}function y(){var d1=JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant());var e1=new S(d1);var f1=c.getVisibleSelectionsWithDefaults();for(var i=0;i<f1.length;i++){if(!e1.getValue(f1[i])){e1.addSelectOption(f1[i],"I","EQ","");}}if(c.byId('template::PageVariant')&&c.byId('template::PageVariant').currentVariantGetModified()&&e1.getID()){e1.setID("");}if(s.oWorklistData.bWorkListEnabled){var g1=s.oWorklistData.oSearchField?s.oWorklistData.oSearchField.getValue():"";e1.addSelectOption("Worklist.SearchField","I","EQ",g1);}var h1={selectionVariant:e1.toJSONString(),tableVariantId:(!e&&s.oSmartTable.getCurrentVariantId())||"",customData:x()};return h1;}function z(){l("fnStoreCurrentAppStateAndAdjustURL called",{bAppStateDirty:k,bDataAreShownInTable:D});if(!k){return;}k=false;try{p=o.storeInnerAppStateWithImmediateReturn(y(),true);}catch(i){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: "+i);return;}if(p instanceof N){k=true;p=null;return;}p.promise.fail(function(d1){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Error when persisting appState"+d1);});l("Result received from storeInnerAppStateWithImmediateReturn",{appStateKey:p.appStateKey,sAppStateKeyInUrl:u});if(u===p.appStateKey){p=null;}else{l("Call NavigationHandler.replaceHash",{appStateKey:p.appStateKey});o.replaceHash(p.appStateKey);}}function R(d1,e1){var f1=t.oComponentUtils.getTemplatePrivateModel();if(d1&&d1.editStateFilter!==undefined){if(E){E.setSelectedKey((d1.editStateFilter===null)?0:d1.editStateFilter);f1.setProperty("/listReport/vDraftState",(d1.editStateFilter===null)?0:d1.editStateFilter);}f1.setProperty("/listReport/activeObjectEnabled",!!d1.activeStateFilter);}var g1=d1&&d1.visibleCustomFields;if(g1&&g1.length>0){var h1=s.oSmartFilterbar.getAllFilterItems();for(var i=0;i<h1.length;i++){var i1=h1[i];var j1=i1.getName();if(g1.indexOf(j1)!==-1){i1.setVisibleInFilterBar(true);}}}D=e1&&!(d1&&d1.suppressDataSelection);if(D&&!s.oWorklistData.bWorkListEnabled){s.oSmartFilterbar.search();_(D);}}function F(i){c.restoreCustomAppStateDataExtension(i||{});}function G(i){if(!i){return;}var d1=true;var e1=function(f1){if(!(f1 instanceof C)){throw new Error("State must always be retrieved with respect to a ControllerExtension");}var g1=f1.getMetadata().getNamespace();if(!d1){throw new Error("State must always be restored synchronously");}return i[g1];};c.templateBaseExtension.restoreExtensionAppStateData(e1);d1=false;}function H(i,d1){i=i||{};if(i.hasOwnProperty(d)&&i.hasOwnProperty(b)){G(i[a]);F(i[d]);R(i[b],d1);}else{if(i._editStateFilter!==undefined){R({editStateFilter:i._editStateFilter});delete i._editStateFilter;}F(i);}}function J(){return A.then(function(){if(r.appStateKey){return{"sap-iapp-state":[r.appStateKey]};}return r.urlParams;});}function K(i){var d1=t.oComponentUtils.getTemplatePrivateModel();d1.setProperty("/generic/bDataAreShownInTable",i);}function M(i,d1){l("changeIappState called",{bFilterOrSettingsChange:i,bDataAreShown:d1,bDataAreShownInTable:D,bIsTransferringUrlStateToPageState:h,bAppStateDirty:k});K(d1);if(h){return;}if(i||d1!==D){D=d1;if(!k){k=true;if(!s.oSmartFilterbar.isDialogOpen()){if(j){z();}else{setTimeout(z,0);}}}}}function O(i){var d1=s.oSmartFilterbar.determineMandatoryFilterItems(),e1;for(var f1=0;f1<d1.length;f1++){if(d1[f1].getName().indexOf("P_DisplayCurrency")!==-1){if(i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0]&&i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low){e1=i.oDefaultedSelectionVariant.getSelectOption("DisplayCurrency")[0].Low;if(e1){i.oSelectionVariant.addParameter("P_DisplayCurrency",e1);}}break;}}}function P(i,d1,e1){l("fnAdaptToAppState called",{sNavType:e1,sAppStateKeyInUrl:u,sAppStateKey:i.appStateKey,storingInformationAppStateKey:p&&p.appStateKey});s.oSmartFilterbar.setSuppressSelection(false);s.sNavType=e1;var f1=i.appStateKey||"";if(h){return;}if(u===null){u=f1;}else if(f1!==u){return;}h=true;var g1=i.selectionVariant||"";var h1=(!e&&i.tableVariantId)||"";var i1=(!f1&&d1)||{};var j1=i.oSelectionVariant||"";var k1={selectionVariant:j1,urlParameters:d1,selectedQuickVariantSelectionKey:""};var l1=new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant()));var m1=l1.getSelectOption(d);var n1=l1.getSelectOption(b);if((r.appStateKey!==f1||r.selectionVariant!==g1||r.tableVariantId!==h1||f(r.urlParams,i1))&&e1!==sap.ui.generic.app.navigation.service.NavType.initial){if(!p||p.appStateKey!==f1){var o1=i&&i.bNavSelVarHasDefaultsOnly;if((i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("DisplayCurrency")===-1)&&(i.oSelectionVariant.getSelectOptionsPropertyNames().indexOf("P_DisplayCurrency")===-1)&&(i.oSelectionVariant.getParameterNames().indexOf("P_DisplayCurrency")===-1)){O(i);}if(!s.oWorklistData.bWorkListEnabled){if(!o1||s.oSmartFilterbar.isCurrentVariantStandard()){k1.selectionVariant=i.oSelectionVariant;if(e1!==sap.ui.generic.app.navigation.service.NavType.iAppState){c.modifyStartupExtension(k1);c1(k1.selectionVariant,r,g1);a1(k1.selectionVariant.toJSONObject(),true,false);}else{c1(k1.selectionVariant,r,g1);a1(k1.selectionVariant.toJSONObject(),!o1,false);}}else{b1(l1,m1,n1,true);k1.selectionVariant=l1;c.modifyStartupExtension(k1);b1(k1.selectionVariant,m1,n1,false);if(!q.sap.equal(k1.selectionVariant,new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())))){c1(k1.selectionVariant,r,g1);a1(k1.selectionVariant.toJSONObject(),true,false);}}}if(h1!==r.tableVariantId){s.oSmartTable.setCurrentVariantId(h1);}i.customData=i.customData||{};var p1=s.oMultipleViewsHandler.getMode();if(p1){var q1=p1==="single"?"tableViewData":"tableTabData";if(i.customData[b]&&i.customData[b][q1]){s.oMultipleViewsHandler.restoreFromIappState(i.customData[b][q1]);}}if(s.oWorklistData.bWorkListEnabled){s.oWorklistData.oWorklistSavedData=i.customData[b]&&i.customData[b]["Worklist"]?i.customData[b]["Worklist"]:{};s.oWorklistHandler.restoreWorklistStateFromIappState();}H(i.customData,true);}r={appStateKey:f1,urlParams:i1,selectionVariant:g1,tableVariantId:h1};}if(e1!==sap.ui.generic.app.navigation.service.NavType.iAppState){if(e1===sap.ui.generic.app.navigation.service.NavType.initial){b1(l1,m1,n1,true);k1.selectionVariant=l1;c.modifyStartupExtension(k1);b1(k1.selectionVariant,m1,n1,false);if(!q.sap.equal(k1.selectionVariant,new S(JSON.stringify(s.oSmartFilterbar.getUiState().getSelectionVariant())))){c1(k1.selectionVariant,r,g1);a1(k1.selectionVariant.toJSONObject(),true,false);}}if(k1.selectedQuickVariantSelectionKey){var p1=s.oMultipleViewsHandler.getMode();if(p1){if(c&&c.getOwnerComponent&&c.getOwnerComponent().getModel){var r1=c.getOwnerComponent().getModel("_templPriv");r1.setProperty("/listReport/multipleViews/selectedKey",k1.selectedQuickVariantSelectionKey);}}}}if(j){j();j=null;}if(e1!==sap.ui.generic.app.navigation.service.NavType.iAppState&&!D){var s1=(e1===sap.ui.generic.app.navigation.service.NavType.xAppState||e1===sap.ui.generic.app.navigation.service.NavType.URLParams)&&!i.bNavSelVarHasDefaultsOnly;D=s1||s.bLoadListAndFirstEntryOnStartup||m||s.oSmartFilterbar.isCurrentVariantExecuteOnSelectEnabled()||s.oMultipleViewsHandler.getEnableAutoBinding();K(D);if(D){s.oSmartFilterbar.search();_(D);}}if(e1==="initial"&&s.oWorklistData.bWorkListEnabled){if(s.oSmartFilterbar.isCurrentVariantStandard()){s.oWorklistHandler.restoreWorklistStateFromIappState();}}p=null;h=false;}function Q(){if(!j){A=new Promise(function(d1){j=d1;});}var i=new Promise(function(d1,e1){var f1=o.parseNavigation();f1.done(function(g1,h1,i1){P(g1,h1,i1);d1();});f1.fail(function(g1,h1,i1){L.warning(g1.getErrorCode(),"app state could not be parsed - continuing with empty state","sap.suite.ui.generic.template.ListReport.controller.IappStateHandler");P({},h1,sap.ui.generic.app.navigation.service.NavType.initial);d1();});});return i;}function T(){var i=y();s.oSmartFilterbar.setFilterData({_CUSTOM:i.customData});}function V(){M(true,D);}function W(i){var d1=i.getParameter("context");var e1=s.oSmartFilterbar.getFilterData();if(e1._CUSTOM!==undefined){if(s.oWorklistData.bWorkListEnabled){var f1=e1._CUSTOM[b]["Worklist"];s.oSmartFilterbar.setSuppressSelection(false);s.oWorklistData.oSearchField.setValue(f1.searchString);s.oWorklistData.oSearchField.fireSearch();}else{H(e1._CUSTOM);}}else{var g1=x();n(g1[d]);n(g1[b]);H(g1);}if(I.indexOf(d1)<0){D=i.getParameter("executeOnSelect");M(true,D);}}function X(){if(!e){M(true,D);}}function Y(){if(!e){M(true,D);}}function Z(i){var d1=i.getParameter("arguments");var e1=d1&&d1["?query"];u=(e1&&e1["sap-iapp-state"])||"";if(p){if(p.appStateKey!==u){L.error("ListReport.fnStoreCurrentAppStateAndAdjustURL: Got AppstateKey "+u+" expected "+p.appStateKey);return false;}Q();return true;}return false;}function $(){m=s.oSmartTable.getEnableAutoBinding();s.oSmartFilterbar.attachFiltersDialogClosed(z);}function _(D){if(c&&c.getOwnerComponent&&c.getOwnerComponent().getModel){var i=c.getOwnerComponent().getModel("_templPriv");if(D){i.setProperty("/listReport/isHeaderExpanded",false);}else{i.setProperty("/listReport/isHeaderExpanded",true);}}}function a1(i,d1,e1){var f1=new U({selectionVariant:i});s.oSmartFilterbar.setUiState(f1,{replace:d1,strictMode:e1});}function b1(i,d1,e1,f1){if(i&&(d1||e1)){if(f1){i.removeSelectOption(d);i.removeSelectOption(b);}else{i.massAddSelectOption(d,d1);i.massAddSelectOption(b,e1);}}}function c1(d1,r,e1){if(d1&&(r.selectionVariant!==e1||s.sNavType==="initial")){var f1=d1.getParameterNames().concat(d1.getSelectOptionsPropertyNames());for(var i=0;i<f1.length;i++){s.oSmartFilterbar.addFieldToAdvancedArea(f1[i]);}}}s.getCurrentAppState=y;return{areDataShownInTable:w,parseUrlAndApplyAppState:Q,getUrlParameterInfo:J,changeIappState:M,onSmartFilterBarInitialise:$,onBeforeSFBVariantFetch:T,onAfterSFBVariantSave:V,onAfterSFBVariantLoad:W,onAfterTableVariantSave:X,onAfterApplyTableVariant:Y,isStateChange:Z};}return B.extend("sap.suite.ui.generic.template.ListReport.controller.IappStateHandler",{constructor:function(s,c,t){q.extend(this,g(s,c,t));}});});
