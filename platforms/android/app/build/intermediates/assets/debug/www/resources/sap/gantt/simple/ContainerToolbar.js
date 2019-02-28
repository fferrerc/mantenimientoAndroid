sap.ui.define(["sap/ui/core/Core","sap/gantt/library","sap/ui/base/ManagedObjectObserver","sap/ui/core/Item","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/m/ToolbarSpacer","sap/m/FlexBox","sap/m/FlexDirection","sap/m/Button","sap/m/Select","sap/m/ViewSettingsDialog","sap/m/ViewSettingsCustomTab","sap/m/PlacementType","sap/m/CheckBox","sap/m/Slider","sap/m/Popover","../control/AssociateContainer"],function(C,l,M,a,O,b,T,F,c,B,S,V,d,P,e,f,g,A){"use strict";var h=O.extend("sap.gantt.simple.ContainerToolbar",{metadata:{properties:{showBirdEyeButton:{type:"boolean",defaultValue:false},showLegendButton:{type:"boolean",defaultValue:false},showSettingButton:{type:"boolean",defaultValue:true},showTimeZoomControl:{type:"boolean",defaultValue:true},zoomControlType:{type:"sap.gantt.config.ZoomControlType",defaultValue:l.config.ZoomControlType.SliderWithButtons},stepCountOfSlider:{type:"int",defaultValue:10},infoOfSelectItems:{type:"object[]",defaultValue:[]},zoomLevel:{type:"int",defaultValue:0}},aggregations:{settingItems:{type:"sap.gantt.config.SettingItem",multiple:true},legendContainer:{type:"sap.ui.core.Control",multiple:false,visibility:"public"}},events:{zoomStopChange:{parameters:{index:{type:"int"},selectedItem:{type:"sap.ui.core.Item"}}},birdEyeButtonPress:{}}}});h.prototype.init=function(){O.prototype.init.apply(this,arguments);this.mSettingsConfig={};this._oRb=C.getLibraryResourceBundle("sap.gantt");this.oObserver=new M(this.observePropertiesChanges.bind(this));this.oObserver.observe(this,{properties:["showBirdEyeButton","showLegendButton","showTimeZoomControl","showSettingButton","zoomControlType","infoOfSelectItems"]});this.bShallUpdateContent=true;this.bZoomControlTypeChanged=false;this._bSuppressZoomStopChange=false;this.oToolbarSpacer=new T();};h.prototype.observePropertiesChanges=function(o){this.bShallUpdateContent=true;this.bZoomControlTypeChanged=o.name==="zoomControlType";};h.prototype.exit=function(){this.oObserver.disconnect();};h.prototype.applySettings=function(s,i){s=s||{};if(!s.settingItems){s.settingItems=l.config.DEFAULT_TOOLBAR_SETTING_ITEMS.map(function(o){return o.clone();});}O.prototype.applySettings.apply(this,arguments);this._createControlsOnly();return this;};h.prototype.onBeforeRendering=function(){if(this.bShallUpdateContent===true){this.updateToolbarContents();this.bShallUpdateContent=false;this.bZoomControlTypeChanged=false;}};h.prototype.updateToolbarContents=function(){var n=function(o){return this.getContent().indexOf(o)===-1;}.bind(this);if(n(this.oToolbarSpacer)){this._addToolbarContent(this.oToolbarSpacer);}var i=this.getContent().indexOf(this.oToolbarSpacer)+1;var I=function(s,o){if(s&&n(o)){this.insertContent(o,i);i++;}else if(!s&&!n(o)){this.removeContent(o);}else if(s&&!n(o)){i++;}}.bind(this);I(this.getShowBirdEyeButton(),this._genBirdEyeButton());if(this.bZoomControlTypeChanged){var p=[this._oZoomOutButton,this._oZoomSlider,this._oSelect,this._oZoomInButton];p.forEach(function(o){if(!n(o)){this.removeContent(o);}}.bind(this));}var t=this._genTimeZoomGroupControls();if(t){t.forEach(function(o){I(this.getShowTimeZoomControl(),o);}.bind(this));}I(this.getShowLegendButton(),this._genLegend());I(this.getShowSettingButton(),this._genSettings());};h.prototype._addToolbarContent=function(v){if(jQuery.isArray(v)){for(var m=0;m<v.length;m++){this.addContent(v[m]);}}else if(v){this.addContent(v);}};h.prototype._createControlsOnly=function(){this._genBirdEyeButton();this._genTimeZoomGroupControls();this._genLegend();this._genSettings();};h.prototype._genBirdEyeButton=function(){if(this._oBirdEyeButton==null){var i=function(r){var s=r.getText("TXT_BRIDEYE"),t=r.getText("TXT_BRIDEYE_RANGE_VISIBLE_ROWS"),j=r.getText("TLTP_BRIDEYE_ON_VISIBLE_ROWS");return s+"("+t+"): "+j;};this._oBirdEyeButton=new B({icon:"sap-icon://show",tooltip:i(this._oRb),press:function(E){this.fireBirdEyeButtonPress();}.bind(this)});}return this._oBirdEyeButton;};h.prototype._getSelectItems=function(){var s=[],I=this.getInfoOfSelectItems();if(I.length>0){if(I[0]instanceof a){s=I;}else{for(var i=0;i<I.length;i++){var o=new a({key:I[i].key,text:I[i].text});s.push(o);}}}return s;};h.prototype._genTimeZoomGroupControls=function(){var Z=l.config.ZoomControlType;var z=this.getZoomControlType();var L=new b({priority:sap.m.OverflowToolbarPriority.NeverOverflow});var u=function(j){jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=-1;this.setZoomLevel(j,true);};this.fireEvent("_zoomControlTypeChange",{zoomControlType:z});if(z===Z.None){return[];}if(z===Z.Select){if(this._oSelect){return[this._oSelect];}var s=this._getSelectItems();this._oSelect=new S({items:s,selectedItem:s[this.getZoomLevel()],layoutData:L,change:function(E){var o=E.getSource();var j=o.getSelectedItem();var k=o.indexOfItem(j);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,u,[k,j]);}.bind(this)});return[this._oSelect];}else{if(this._oZoomSlider){this._oZoomSlider.setMax(this.getStepCountOfSlider()-1);if(z===Z.SliderOnly){return[this._oZoomSlider];}else if(z===Z.ButtonsOnly){return[this._oZoomOutButton,this._oZoomInButton];}else{return[this._oZoomOutButton,this._oZoomSlider,this._oZoomInButton];}}this._oZoomSlider=new f({width:"200px",layoutData:L,max:this.getStepCountOfSlider()-1,value:this.getZoomLevel(),min:0,step:1,liveChange:function(E){var j=parseInt(E.getParameter("value"),10);jQuery.sap.clearDelayedCall(this._iLiveChangeTimer);this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,u,[j]);}.bind(this)});var i=function(j){return function(E){this._iLiveChangeTimer=jQuery.sap.delayedCall(200,this,function(){var k=parseInt(j?this._oZoomSlider.stepUp(1).getValue():this._oZoomSlider.stepDown(1).getValue(),10);u.call(this,k);});};};this._oZoomInButton=new sap.m.Button({icon:"sap-icon://zoom-in",tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_IN"),layoutData:L.clone(),press:i(true).bind(this)});this._oZoomOutButton=new B({icon:"sap-icon://zoom-out",tooltip:this._oRb.getText("TLTP_SLIDER_ZOOM_OUT"),layoutData:L.clone(),press:i(false).bind(this)});return[this._oZoomOutButton,this._oZoomSlider,this._oZoomInButton];}};h.prototype._genSettings=function(){if(this._oSettingsButton){return this._oSettingsButton;}var i=this.getSettingItems().map(function(s){return new e({name:s.getKey(),text:s.getDisplayText(),tooltip:s.getTooltip(),selected:s.getChecked()}).addStyleClass("sapUiSettingBoxItem");});this._oSettingsBox=new F({direction:c.Column,items:i}).addStyleClass("sapUiSettingBox");this._oSettingsDialog=new V({title:this._oRb.getText("SETTINGS_DIALOG_TITLE"),customTabs:[new d({content:this._oSettingsBox})],confirm:function(){this._fireSettingItemChangedEvent();}.bind(this),cancel:function(){this.updateSettingItems(this.mSettingsConfig);}.bind(this)});this._oSettingsButton=new B({icon:"sap-icon://action-settings",tooltip:this._oRb.getText("TLTP_CHANGE_SETTINGS"),layoutData:new b({priority:sap.m.OverflowToolbarPriority.High}),press:function(E){this._oSettingsDialog.open();}.bind(this)});return this._oSettingsButton;};h.prototype._genLegend=function(){if(this._oLegendButton){return this._oLegendButton;}if(!this._oLegendPop){this._oLegendPop=new g({placement:P.Bottom,showArrow:false,showHeader:false});}this._oLegendButton=new B({icon:"sap-icon://legend",type:sap.m.ButtonType.Default,tooltip:this._oRb.getText("TLTP_SHOW_LEGEND"),layoutData:new b({priority:sap.m.OverflowToolbarPriority.High,closeOverflowOnInteraction:false}),press:function(E){var L=this._oLegendPop;if(L.isOpen()){L.close();}else{L.openBy(this._oLegendButton);}}.bind(this)});return this._oLegendButton;};h.prototype.updateZoomLevel=function(z){this._bSuppressZoomStopChange=true;this.setZoomLevel(z);};h.prototype.setZoomLevel=function(z,i){if(!isNaN(z)){var j=this.getZoomLevel();if(j!==z){this.setProperty("zoomLevel",z,i);if(this._oZoomSlider){this._oZoomSlider.setValue(z);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z});}}if(this._oSelect){this._oSelect.setSelectedItem(this._oSelect.getItems()[z]);if(!this._bSuppressZoomStopChange){this.fireZoomStopChange({index:z,selectedItem:this._oSelect.getSelectedItem()});}}if(this._oZoomOutButton&&this._oZoomInButton){var m=this._oZoomSlider.getMax(),k=this._oZoomSlider.getMin();if(z===m){this._oZoomInButton.setEnabled(false);this._oZoomOutButton.setEnabled(true);}else if(z===k){this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(false);}else{this._oZoomInButton.setEnabled(true);this._oZoomOutButton.setEnabled(true);}}}}this._bSuppressZoomStopChange=false;return this;};h.prototype.setLegendContainer=function(L){this.setAggregation("legendContainer",L);if(!this._oLegendPop){this._oLegendPop=new g({placement:P.Bottom,showArrow:false,showHeader:false});}if(L){this._oLegendPop.removeAllContent();this._oLegendPop.addContent(new A({content:L}));}};h.prototype._fireSettingItemChangedEvent=function(){var s=this._oSettingsBox.getItems();var m=[];for(var i=0;i<s.length;i++){var j=s[i].getName(),p=j.substr(4),o=this.mSettingsConfig[p],n=s[i].getSelected();if(o!==n){m.push({name:j,value:n});}}if(m.length>0){this.fireEvent("_settingsChange",m);}};h.prototype.updateSettingsConfig=function(m){Object.keys(m).forEach(function(p){this.mSettingsConfig[p]=m[p];}.bind(this));this.updateSettingItems(m);};h.prototype.updateSettingItems=function(m){var s=this._oSettingsBox.getItems();Object.keys(m).forEach(function(p){var o=s.filter(function(i){return i.getName().endsWith(p);})[0];if(o){o.setSelected(m[p]);}});};h.prototype.getAllToolbarItems=function(){return this.getContent();};h.prototype.setInfoOfSelectItems=function(i,s){this.setProperty("infoOfSelectItems",i,s);var t=this;if(this._oSelect){var j=this._getSelectItems();this._oSelect.removeAllItems();j.forEach(function(k){t._oSelect.addItem(k);});}};return h;},true);
