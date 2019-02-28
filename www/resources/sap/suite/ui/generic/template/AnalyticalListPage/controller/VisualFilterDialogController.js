sap.ui.define(["sap/m/Button","sap/m/ButtonType","sap/m/Label","sap/m/Dialog","sap/m/Bar","sap/m/SearchField","sap/m/Toolbar","sap/m/ToolbarSpacer","sap/m/Title","sap/m/VBox","sap/m/HBox","sap/m/CheckBox","sap/m/Link","sap/m/List","sap/m/CustomListItem","sap/m/TextArea","sap/m/Text","sap/m/StandardListItem","sap/m/ListSeparators","sap/m/Popover","sap/ui/layout/form/SimpleForm","sap/ui/layout/GridData","sap/ui/core/mvc/Controller","sap/suite/ui/generic/template/AnalyticalListPage/util/FilterUtil","sap/m/SegmentedButton","sap/m/SegmentedButtonItem","sap/suite/ui/generic/template/AnalyticalListPage/util/V4Terms",'sap/ui/model/Filter',"sap/suite/ui/generic/template/AnalyticalListPage/controller/DropDownController","sap/suite/ui/generic/template/AnalyticalListPage/controller/DatePickerController","sap/m/OverflowToolbarButton","sap/ui/model/json/JSONModel","sap/m/OverflowToolbar","sap/m/OverflowToolbarLayoutData","sap/ui/core/CustomData","sap/ui/Device","sap/m/library","sap/ui/core/library","sap/ui/model/FilterOperator","sap/m/DatePicker","sap/base/Log"],function(B,a,L,D,b,S,T,c,d,V,H,C,f,g,h,j,k,l,m,P,n,G,o,F,p,q,r,s,t,u,O,J,v,w,x,y,z,A,E,I,K){"use strict";var M="_BASIC";var N="100%";var Q=0.33;var R=0.5;var U=o.extend("sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController",{init:function(e){K.setLevel(K.Level.WARNING,"VisualFilter");this.oState=e;this.oRb=sap.ui.getCore().getLibraryResourceBundle("sap.ui.comp");this.bIsTimeBasedLine;this.bSortOrder;},_createForm:function(){this._searchTriggered=false;this._restoreTriggered=false;var e=new J();var i=this.oState.alr_visualFilterBar.getModel('_visualFilterConfigModel');this._initialFilters=this.oState.alr_visualFilterBar.getModel("_filter").getJSON();this.oConfig=JSON.parse(i.getJSON());e.setData(this.oConfig);this.filterCompList=[];this.filterChartList=[];this._buildFiltersFromConfig(true);var _=new J();_.setData(JSON.parse(this._initialFilters));this.oVerticalBox=new V();this.oVerticalBox.setModel(this.oState.oController.getView().getModel("_templPriv"),"_templPriv");this.oVerticalBox.setModel(this.oState.oController.getView().getModel());this.oVerticalBox.setModel(this.oState.oController.getView().getModel("i18n"),"i18n");this.oVerticalBox.setModel(_,"_dialogFilter");this.oVerticalBox.setModel(e,'_visualFilterDialogModel');this._addFilterSwitch();this._addGroupsAndFilters();return this.oVerticalBox;},_toggle:function(){var e=this.oState.oSmartFilterbar.getFilterDialogContent();if(e&&(e.length===2)){if(e[0].getVisible()){e[0].setVisible(false);e[1].setVisible(true);e[1].getItems()[0].getContent()[1].addCustomData(new x({key:'isToggle',value:true}));if(this.oState.alr_visualFilterBar.getLazyLoadVisualFilter()){this.oState.alr_visualFilterBar.updateVisualFilterBindings.apply(this,[true,true]);}}else{e[0].setVisible(true);e[1].setVisible(false);e[0].getToolbar().getContent()[1].addCustomData(new x({key:'isToggle',value:true}));}}},_addFilterSwitch:function(){var e=[new q({icon:"sap-icon://filter-fields",width:"inherit",key:"compact",tooltip:"{i18n>FILTER_COMPACT}"}),new q({icon:"sap-icon://filter-analytics",width:"inherit",key:"visual",tooltip:"{i18n>FILTER_VISUAL}"})];var i=new p({width:"inherit",selectedKey:"visual",items:e}).addEventDelegate({onAfterRendering:function(X){if(X.srcControl.getCustomData()[0]&&X.srcControl.getCustomData()[0].getValue()){X.srcControl.focus();X.srcControl.removeAllCustomData();}}});i.attachSelect(function(X){var Y=X.getSource();Y.setSelectedKey("visual");this._toggle();}.bind(this));var W=new v({design:z.ToolbarDesign.Transparent,content:[new c(),i]}).addStyleClass("sapSmartTemplatesAnalyticalListPageFilterDialogToolbar");this.oVerticalBox.addItem(W);},_searchDialog:function(){this._searchTriggered=true;},_updateFilterBarFromDialog:function(){var e=this.oState.alr_visualFilterBar.getModel('_filter'),i=this.oVerticalBox.getModel('_dialogFilter'),W=jQuery.sap.equal(e.getJSON(),i.getJSON());if(!W){e.setData(JSON.parse(i.getJSON()));}var X=this.oState.alr_visualFilterBar.getModel('_visualFilterConfigModel'),Y=this._getDialogConfigModel(),Z=jQuery.sap.equal(X.getJSON(),Y.getJSON());if(!Z){X.setData(JSON.parse(Y.getJSON()));this.oState.alr_visualFilterBar.updateVisualFilterBindings(true);}if(this.oState.alr_visualFilterBar.getLazyLoadVisualFilter()){this.oState.alr_visualFilterBar.updateVisualFilterBindings(true);}},_closeDialog:function(){if(this._searchTriggered){this._updateFilterBarFromDialog();if(this._restoreTriggered){this._restoreTriggered=false;this.oState.filterBarController._afterSFBVariantLoad();}}this.oVerticalBox.destroyItems();},_restoreDialog:function(){var e=this.oState.alr_visualFilterBar._oCurrentVariant.config;if(e){this.oConfig.filterCompList.forEach(function(i){if(e[i.component.properties.parentProperty]){jQuery.extend(true,i,e[i.component.properties.parentProperty]);}});}else{this.oConfig=this.oState.alr_visualFilterBar._getStandardVariantConfig();}this._getDialogConfigModel().setData(this.oConfig);this._reloadForm();this._restoreTriggered=true;},_buildFiltersFromConfig:function(e){var i;this.filterCompList=[];this.filterChartList=[];for(i=0;i<this.oConfig.filterCompList.length;i++){var W=this.oConfig.filterCompList[i].component.properties.sortOrder;if(W.constructor===Object&&W.value){this.oConfig.filterCompList[i].component.properties.sortOrder=W.value;}this.filterCompList.push({obj:{shownInFilterBar:this.oConfig.filterCompList[i].shownInFilterBar,shownInFilterDialog:this.oConfig.filterCompList[i].shownInFilterDialog,cellHeight:this.oConfig.filterCompList[i].cellHeight,component:{type:this.oConfig.filterCompList[i].component.type,cellHeight:this.oConfig.filterCompList[i].component.cellHeight},group:{label:this.oConfig.filterCompList[i].group.label,name:this.oConfig.filterCompList[i].group.name}},searchVisible:e===true||this.oConfig.filterCompList[i].searchVisible===undefined||this.oConfig.filterCompList[i].searchVisible});}},_rebuildConfig:function(){var i;var e={filterCompList:[]};for(i=0;i<this.filterCompList.length;i++){e.filterCompList.push({shownInFilterBar:this.filterCompList[i].obj.shownInFilterBar&&this.filterCompList[i].obj.shownInFilterDialog,shownInFilterDialog:this.filterCompList[i].obj.shownInFilterDialog,cellHeight:this.filterCompList[i].obj.cellHeight,group:{label:this.filterCompList[i].obj.group.label,name:this.filterCompList[i].obj.group.name},component:{type:this.filterCompList[i].obj.component.type,cellHeight:this.filterCompList[i].obj.component.cellHeight,properties:{scaleFactor:this.filterChartList[i].getScaleFactor(),numberOfFractionalDigits:this.filterChartList[i].getNumberOfFractionalDigits(),sortOrder:this.filterChartList[i].getSortOrder(),filterRestriction:this.oConfig.filterCompList[i].component.properties.filterRestriction,entitySet:this.filterChartList[i].getEntitySet(),isDropDown:this.oConfig.filterCompList[i].component.properties.isDropDown,width:this.oConfig.filterCompList[i].component.properties.width,height:this.oConfig.filterCompList[i].component.properties.height,dimensionField:this.filterChartList[i].getDimensionField(),dimensionFieldDisplay:this.filterChartList[i].getDimensionFieldDisplay(),dimensionFieldIsDateTime:this.filterChartList[i].getDimensionFieldIsDateTime(),dimensionFilter:this.filterChartList[i].getDimensionFilter(),unitField:this.filterChartList[i].getUnitField(),isCurrency:this.filterChartList[i].getIsCurrency(),isMandatory:this.oConfig.filterCompList[i].component.properties.isMandatory,measureField:this.filterChartList[i].getMeasureField(),outParameter:this.oConfig.filterCompList[i].component.properties.outParameter,inParameters:this.oConfig.filterCompList[i].component.properties.inParameters,parentProperty:this.oConfig.filterCompList[i].component.properties.parentProperty,chartQualifier:this.oConfig.filterCompList[i].component.properties.chartQualifier}}});}return e;},_reloadForm:function(){this.oVerticalBox.destroyItems();this._buildFiltersFromConfig();this._addFilterSwitch();this._addGroupsAndFilters();},_addGroupsAndFilters:function(){var i;var e;var W;var X=[];var Y=0;for(i=0;i<this.filterCompList.length;i++){if(!Array.isArray(this.filterCompList[i])){if(this.filterCompList[i].searchVisible===false){continue;}if(!(X.indexOf(this.filterCompList[i].obj.group.name)>-1)){if(W){this.oVerticalBox.addItem(W);}e=this.filterCompList[i].obj.group.name;X.push(e);W=new g({showSeparators:"None",showNoData:false});W.setWidth("100%");W.setLayoutData(new G({span:"L12 M12 S12"}));W.addStyleClass("sapUiSmallMarginTop");Y++;this._addGroupToolbar(W,this.filterCompList[i].obj.group.label,this.filterCompList[i].obj.group.name);}if(this.filterCompList[i].obj.shownInFilterDialog){this.filterCompList[i].toolbar=this._addChartCustomToolbar(this.oConfig.filterCompList[i],i);this.filterCompList[i].overlay=this._addChartOverlay(this.oConfig.filterCompList[i],i);var Z=this,$=new V(),_=this.oConfig.filterCompList[i].component.properties.parentProperty;$.setModel(this._getDialogConfigModel(),'_visualFilterDialogModel');$.bindAggregation('items',{path:"_visualFilterDialogModel>/filterCompList",factory:function(d1,e1){var f1=e1.getProperty('component/type'),g1=e1.getProperty('component/properties'),h1=e1.getPath().split("/")[2];this.filterChartList[h1]=this._addChart(f1,g1,h1);return this.filterChartList[h1];}.bind(this),filters:new s("component/properties/parentProperty",E.EQ,_)});var a1=this.filterChartList[i].getParentProperty().replace(/[^\w]/gi,'')+"checkBox";var b1=[new V({items:[Z.filterCompList[i].toolbar,Z.filterCompList[i].overlay,$]}).setWidth("100%").addStyleClass("sapUiSmallMarginEnd")];if(y.system.desktop){b1[0].setWidth("80%");b1.splice(1,0,new V({items:[new L({text:"{i18n>SHOW_ON_FILTER_BAR}",labelFor:a1}).addStyleClass("sapUiTinyMarginTop"),new C({id:a1,text:"",selected:Z.oConfig.filterCompList[i].shownInFilterBar}).data("idx",i).attachSelect(null,Z._onCheckBoxSelect,Z)]}).setAlignItems("Center"));b1[1].setWidth("20%");}var c1=new H({items:b1}).addStyleClass("sapUiSmallMarginTop").setWidth("100%");W.addItem(new h({content:c1}));}}if(W){this.oVerticalBox.addItem(W);}}if(Y==1&&e===M){F.executeFunction(W,"mAggregations.headerToolbar.setVisible",[false]);}},_onCheckBoxSelect:function(e){var i=e.getSource().data("idx");this.selectCheckBox(i,e.getSource().getSelected());},_addGroupToolbar:function(e,i,W){var X=new d({text:i});var Y=new T({content:[X,new c()]});if(W!=M){Y.addContent(this._createMoreFiltersLink(W,X));}e.setHeaderToolbar(Y);},selectCheckBox:function(i,e){var W=this._getDialogConfigModel();var X=jQuery.extend(true,{},W);X.setProperty('/filterCompList/'+i+'/shownInFilterBar',e);W.setData(X.getData());this.oConfig=W.getData();this.oState.oSmartFilterbar._oVariantManagement.currentVariantSetModified(true);},_addChartOverlay:function(e,i){var W=new V({width:"100%",height:e.component.properties.height,items:[new L({text:{path:'_visualFilterDialogModel>/filterCompList/'+i+'/overlayMessage',formatter:function(X){return this.getModel("i18n").getResourceBundle().getText(X);}}})],visible:{path:'_visualFilterDialogModel>/filterCompList/'+i+'/showChartOverlay',formatter:function(X){return X;}}});W.addStyleClass("sapUiOverlay");W.addStyleClass("sapSmartTemplatesAnalyticalListPageVFOverflow");return W;},_formatTitle:function(e,i){var W=this.oVerticalBox.getModel("i18n").getResourceBundle();var X=e.titleMD;var Y=e.titleUnitCurr;if(i==="tooltipMD"){return Y==""?X:W.getText("VIS_FILTER_TITLE_MD_WITH_UNIT_CURR",[X,Y]);}else if(i==="titleUnitCurr"){return Y.length>0?"| "+Y:"";}},_addChartCustomToolbar:function(e,i){var W=this;var X=e.component.properties.parentProperty,Y=e.component.properties,Z=F.getPropertyNameDisplay(this.oState.alr_visualFilterBar.getModel(),e.component.properties.entitySet,e.component.properties.dimensionField),$=X.replace(/[^\w]/gi,''),_=this.oState.alr_visualFilterBar._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(e.component.properties.entitySet),a1=e.component.properties.sortOrder[0].Descending.Boolean,b1=F.readProperty(e,"component.type")==="Line"&&F.readProperty(e,"component.properties.dimensionFieldIsDateTime"),c1=this.oState.alr_visualFilterBar._resolveChartType(e.component.type),d1=this._getChartTypeIconLink(c1),rb=this.oVerticalBox.getModel("i18n").getResourceBundle(),f1=W._getChartTitle(e,i),g1=new d({text:f1.titleMD,tooltip:this._formatTitle(f1,"tooltipMD"),titleStyle:A.TitleLevel.H6}),h1=new d({text:this._formatTitle(f1,"titleUnitCurr"),tooltip:"",titleStyle:A.TitleLevel.H6});if(this.oConfig.filterCompList[i].component.properties.isMandatory){g1.addStyleClass("sapMLabelRequired");}var i1=function(){var e1=this.oConfig.filterCompList[i].component.properties.entitySet,t1=this._getVisibleMeasureList(e1),u1=Object.keys(t1).length>1;if(!u1){K.warning("Change measure button has been disabled in the dialog as only one visible measure exists in the collection "+e1,"","VisualFilter");}return u1;};var j1=this.oState.oSmartFilterbar.getControlByKey(e.component.properties.parentProperty);this.oState.oSmartFilterbar.ensureLoadedValueHelp(e.component.properties.parentProperty);var k1=j1.getShowValueHelp&&j1.getShowValueHelp()&&!Y.dimensionFieldIsDateTimeOffset,l1=j1 instanceof I,m1=j1.getMetadata().getName()==="sap.m.DateTimePicker",n1=(l1&&!m1)?"sap-icon://appointment-2":"",o1=(Y.isDropDown)?"sap-icon://slim-arrow-down":"",p1=k1?"sap-icon://value-help":n1||o1,q1,r1=[new B({type:"Transparent",icon:"sap-icon://line-chart-time-axis",visible:false,press:function(e1){W._showLineChartTimeAxisPopup(e1);}}).data("idx",i),new B({type:"Transparent",icon:(k1||Y.isDropDown||l1)?p1:"",visible:{path:"_dialogFilter>/"+X,formatter:function(e1){if(k1||Y.isDropDown||(l1&&!m1)){return true;}else{if(!e1){return false;}if(typeof e1==="object"){if(e1 instanceof Date){return true;}return(e1.value||(e1.items&&e1.items.length)||(e1.ranges&&e1.ranges.length))?true:false;}return true;}}},text:{path:"_dialogFilter>/"+X,formatter:function(e1){var t1=W.filterChartList[i];var u1=t1.getFilterRestriction();q1=0;if(e1){if(u1==='single'){q1=1;}else{if(typeof e1==="object"){if(e1.value){q1++;}if(e1.items){q1+=e1.items.length;}if(e1.ranges){q1+=e1.ranges.length;}}else{q1++;}}}return q1?"("+q1+")":"";}},enabled:{path:'_visualFilterDialogModel>/filterCompList/'+i+'/showChartOverlay',formatter:function(e1){return!e1;}},press:function(e1){if(k1){j1.fireValueHelpRequest.call(j1);}else if(Y.isDropDown){var t1=W.oState.alr_visualFilterBar._isEntitytypeSearchable(this.getModel(),Y.entitySet),u1=this.getModel("visualFilter")||this.getModel();t.createDropdown(e1.getSource(),W.filterChartList[e1.getSource().data("idx")],u1,Z,Y,t1);}else if(l1&&!m1){u._createDatePicker(e1.getSource(),W.filterChartList[e1.getSource().data("idx")]);}else{sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController.launchAllFiltersPopup(e1.getSource(),W.filterChartList[e1.getSource().data("idx")],e1.getSource().getModel('i18n'));}},tooltip:{path:"_dialogFilter>/"+X,formatter:function(){return F.getTooltipForValueHelp(k1,Z,rb,q1,l1);}},layoutData:new w({priority:z.OverflowToolbarPriority.NeverOverflow})}).data("idx",i),new O({type:"Transparent",icon:(a1?"sap-icon://sort-descending":"sap-icon://sort-ascending"),visible:!b1,tooltip:"{i18n>VISUAL_FILTER_SORT_ORDER}",text:"{i18n>VISUAL_FILTER_SORT_ORDER}",press:function(e1){W._showChartSortPopup(e1);},layoutData:new w({closeOverflowOnInteraction:false,priority:(!y.system.desktop)?z.OverflowToolbarPriority.AlwaysOverflow:z.OverflowToolbarPriority.High})}).data("idx",i),new O({type:"Transparent",icon:d1,tooltip:"{i18n>VISUAL_FILTER_CHART_TYPE}",text:"{i18n>VISUAL_FILTER_CHART_TYPE}",press:function(e1){W._showChartTypesPopup(e1);},layoutData:new w({closeOverflowOnInteraction:false,priority:(!y.system.desktop)?z.OverflowToolbarPriority.AlwaysOverflow:z.OverflowToolbarPriority.High})}).data("idx",i),new O({id:"template::VisualFilterDialog::MeasureChangeButton::"+_+"::"+$,type:"Transparent",icon:"sap-icon://measure",tooltip:"{i18n>VISUAL_FILTER_MEASURE}",text:"{i18n>VISUAL_FILTER_MEASURE}",enabled:i1.apply(W),press:function(e1){W._showChartMeasuresPopup(e1);},layoutData:new w({closeOverflowOnInteraction:false,priority:(!y.system.desktop)?z.OverflowToolbarPriority.AlwaysOverflow:z.OverflowToolbarPriority.High})}).data("idx",i)];if((y.system.tablet||y.system.phone)&&!y.system.desktop){r1.splice(2,0,new C({tooltip:"{i18n>SHOW_ON_FILTER_BAR}",text:"{i18n>SHOW_ON_FILTER_BAR}",selected:W.oConfig.filterCompList[i].shownInFilterBar,layoutData:new w({closeOverflowOnInteraction:false,priority:z.OverflowToolbarPriority.AlwaysOverflow})}).data("idx",i).attachSelect(null,W._onCheckBoxSelect,W));r1[2].addStyleClass("sapSmartTemplatesAnalyticalListPageVFDShowInFilterBarCozy");}var s1=new v({design:z.ToolbarDesign.Transparent,content:[g1,h1,new c(),r1]}).addStyleClass("sapSmartTemplatesAnalyticalListPageFilterDialogTitleToolbar");s1.getContent()[0].addStyleClass("sapUiTinyMarginTop");s1.getContent()[0].addStyleClass("sapSmartTemplatesAnalyticalListPageVFDialogChartTitle");s1.getContent()[1].addStyleClass("sapUiTinyMarginTop");s1.setWidth("100%");return s1;},_addChart:function(i,W,X){var Y;var Z=this;var $=W.selectFilters&&W.selectFilters.SelectOptions;var _={selectFilters:W.selectFilters,scaleFactor:W.scaleFactor,numberOfFractionalDigits:W.numberOfFractionalDigits,sortOrder:W.sortOrder,filterRestriction:W.filterRestriction,isDropDown:W.isDropDown,width:N,height:W.height,labelWidthPercent:Q,entitySet:W.entitySet,dimensionField:W.dimensionField,dimensionFieldDisplay:W.dimensionFieldDisplay,dimensionFieldIsDateTime:W.dimensionFieldIsDateTime,dimensionFieldIsDateTimeOffset:W.dimensionFieldIsDateTimeOffset,unitField:W.unitField,isCurrency:W.isCurrency,isMandatory:W.isMandatory,measureField:W.measureField,dimensionFilter:W.dimensionFilter,outParameter:W.outParameter,inParameters:W.inParameters,parentProperty:W.parentProperty,textArrangement:W.textArrangement,chartQualifier:W.chartQualifier,lazyLoadVisualFilter:this.oState.alr_visualFilterBar.getLazyLoadVisualFilter()};var a1="/filterCompList/"+X;if(i==="Donut"){_.labelWidthPercent=R;}i=this.oState.alr_visualFilterBar._resolveChartType(i);var Y=this.oState.alr_visualFilterBar._createFilterItemOfType(i,_);Y.setModel(this.oVerticalBox.getModel('_dialogFilter'),'_dialogFilter');Y.setModel(this._getDialogConfigModel(),'_visualFilterDialogModel');Y.data("idx",X);Y.addCustomData(new x({key:'sPath',value:a1}));if(_.dimensionFieldIsDateTime){Y.addCustomData(new x({key:'stringdate',value:W.stringdate}));}Y.bindProperty('visible',{path:'_visualFilterDialogModel>/filterCompList/'+X+'/showChartOverlay',formatter:function(e){return!e;}});Y.bindProperty('dimensionFilter',{path:'_dialogFilter>/'+Y.getParentProperty()});var b1=Y.getInParameters(),c1=[];if(b1&&b1.length>0){b1.forEach(function(e){c1.push({path:"_dialogFilter>/"+e.localDataProperty});});}if(Z.oState.alr_visualFilterBar.getEntitySet()===Y.getEntitySet()){var d1=Z.oState.alr_visualFilterBar._smartFilterContext.determineMandatoryFilterItems();if(d1&&d1.length>0){d1.forEach(function(e){if(!e.data("isCustomField")){c1.push({path:'_dialogFilter>/'+e.getName()});}});}}if(c1&&c1.length>0){Y.bindProperty('dimensionFilterExternal',{parts:c1,formatter:function(){var b1=this.getInParameters(),e1=this.getParentProperty();var f1,g1;if(Z.oState.alr_visualFilterBar.getEntitySet()===this.getEntitySet()){var d1=Z.oState.alr_visualFilterBar._smartFilterContext.determineMandatoryFilterItems();d1.forEach(function(v1){var w1=v1.getName();var x1=b1&&b1.some(function(e){return e.localDataProperty===w1;});if(w1.indexOf("$Parameter")===-1&&!x1){b1.push({localDataProperty:w1,valueListProperty:w1});}});}if(!(Z.oState.alr_visualFilterBar.getEntitySet()===this.getEntitySet()&&Z.oState.alr_visualFilterBar._smartFilterContext.getAnalyticBindingPath()!=="")&&(Z.oState.alr_visualFilterBar._smartFilterContext.getAnalyticBindingPath()===""||Z.oState.alr_visualFilterBar._smartFilterContext.getAnalyticBindingPath().indexOf("P_DisplayCurrency")!=-1)){var h1=this.getMeasureField();var i1=Z.oState.alr_visualFilterBar.getModel();var j1=i1.getMetaModel();var k1=j1.getODataEntityType(Z.oState.alr_visualFilterBar._oMetadataAnalyser.getEntityTypeNameFromEntitySetName(this.getEntitySet()));var l1=j1.getODataEntitySet(this.getEntitySet());var m1=j1.getODataProperty(k1,h1);var n1=Z.oState.alr_visualFilterBar.getProperty("displayCurrency");var o1=m1&&m1[r.ISOCurrency];if(n1&&o1){var p1=o1.Path;for(var q1=(b1.length-1);q1>-1;q1--){var r1=b1[q1].valueListProperty;var s1=b1[q1].localDataProperty;if(r1===p1){var t1=Z.oState.alr_visualFilterBar._smartFilterContext.getFilterData();if(!t1[s1]){g1=j1.getODataProperty(k1,p1);var u1=g1&&F.isPropertyNonFilterable(l1,g1.name);if(!u1){f1=new s({aFilters:[new s({path:p1,operator:"EQ",value1:n1,value2:undefined})],and:false});}}break;}}}}return Z.oState.alr_visualFilterBar._getFiltersForFilterItem(b1,e1,f1,p1,$);}});}Y._updateBinding();Y._bAllowBindingUpdateOnPropertyChange=true;Y.attachFilterChange(function(e){Z.oState.alr_visualFilterBar.fireFilterChange();});Y.attachTitleChange(function(e){var X=e.getSource().data("idx");if(Z.filterCompList[X].toolbar.getContent().length>0){if(_.isMandatory){Z.filterCompList[X].toolbar.getContent()[0].addStyleClass("sapMLabelRequired");}var e1=Z.filterCompList[X].toolbar.getContent()[0];var f1=Z.filterCompList[X].toolbar.getContent()[1];var g1=Z._getChartTitle(Z.filterCompList[X].obj,X);e1.setText(g1.titleMD);var h1=Z._formatTitle(g1,"tooltipMD");e1.setTooltip(h1);f1.setText(Z._formatTitle(g1,"titleUnitCurr"));var i1=g1.titleUnitCurr.split(" ");if(g1.titleUnitCurr==""){f1.setVisible(false);}else{f1.setVisible(true);var j1=i1.length>1?"4.15rem":"2.4rem";f1.setWidth(j1);}}});return Y;},_createMoreFiltersLink:function(e,W){var X=this;var Y=0;var i;var Z=new f();for(i=0;i<this.filterCompList.length;i++){if(this.filterCompList[i].searchVisible&&this.filterCompList[i].obj.group.name===e&&!this.filterCompList[i].obj.shownInFilterDialog){Y++;}}if(Y>0){Z.setText(this.oRb.getText("FILTER_BAR_SHOW_MORE_FILTERS",[Y]));}else{Z.setText(this.oRb.getText("FILTER_BAR_SHOW_CHANGE_FILTERS"));}Z.attachPress(function($){X._createAddRemoveFiltersDialog(e,Z);});if(W){Z.addAriaLabelledBy(W);}return Z;},_showChartMeasuresPopup:function(e){var i=this;var W=e.getSource().data("idx");var X=this.filterChartList[W].getProperty("entitySet");var Y=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog(e.getSource().getModel('i18n'),"VISUAL_FILTER_MEASURES");var Z=e.getSource().getModel("@i18n");if(Z){Y.setModel(Z,"@i18n");}var $=new g({mode:z.ListMode.SingleSelectLeft,includeItemInSelection:true});$.data("idx",W);Y.addContent($);var _=this._getVisibleMeasureList(X);$.addStyleClass("sapUiSizeCompact");if(_){for(var a1 in _){var b1=new l({title:_[a1].label?_[a1].label:_[a1].name,tooltip:(_[a1].fieldInfo&&_[a1].fieldInfo.quickInfo)||_[a1].label||_[a1].name}).data("measureName",_[a1].name);$.addItem(b1);if(this.filterChartList[W].getMeasureField()===_[a1].name){$.setSelectedItem(b1);}}}$.attachSelectionChange(function(e){var W=e.getSource().data("idx"),c1=e.getSource().getSelectedItem().data("measureName");i.filterChartList[W].setProperty("unitField",_[c1].fieldInfo.unit);var d1=i.filterCompList[W].toolbar.getContent()[0];var e1=i.filterCompList[W].toolbar.getContent()[1];var f1=i._getChartTitle(i.filterCompList[W].obj,W);d1.setText(f1.titleMD);e1.setText(i._formatTitle(f1,"titleUnitCurr"));i.oConfig.filterCompList[W].component.properties.measureField=c1;if(!i.filterChartList[W]._chart.getPoints){var g1=jQuery.extend(true,[],i.filterChartList[W].getSortOrder());g1[0].Field.String=c1;i.filterChartList[W].setSortOrder(g1);i._updateVisualFilterConfigModel(W,'/component/properties/sortOrder',g1);}var h1={bUpdateBinding:true,value:c1};i.filterChartList[W].setMeasureField(h1);i._updateVisualFilterConfigModel(W,'/component/properties/measureField',h1);i._updateVisualFilterConfigModel(W,'/component/properties/measureField',c1);i._updateVisualFilterConfigModel(W,'/component/properties/unitField',_[c1].fieldInfo.unit);if(Y){Y.close();}});Y.attachAfterClose(function(){Y.destroy();Y=null;});Y.openBy(e.getSource());},_showChartTypesPopup:function(e){var W=this,X=e.getSource(),Y=X.getModel('i18n'),Z=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog(Y,"VISUAL_FILTER_CHART_TYPES"),$=this.oState.alr_visualFilterBar._getSupportedFilterItemList(),_=[];for(var i=0;i<$.length;i++){var a1=$[i];var b1=new l({title:"{i18n>"+a1.textKey+"}",icon:a1.iconLink,selected:X.getIcon()===a1.iconLink}).data("type",a1.type);_.push(b1);}var c1=new g({mode:z.ListMode.SingleSelectMaster,items:_});c1.data("button",X);c1.addStyleClass("sapUiSizeCompact");c1.setModel(Y,"i18n");Z.addContent(c1);c1.attachSelectionChange(function(e){var d1=e.getSource().data("button").data("idx"),e1=e.getSource().getSelectedItem().data("type"),f1=W.filterChartList[d1],g1=f1.getDimensionField(),h1=f1.getMeasureField(),i1=f1.getDimensionFieldIsDateTime(),j1=F.readProperty(W.oConfig,"filterCompList."+d1+".component.properties.sortOrder.0.Field.String"),k1=W._getDialogConfigModel(),l1=k1.getProperty('/filterCompList/'),m1=jQuery.extend(true,{},l1[d1]),n1=F.readProperty(m1,"component.properties.sortOrder.0.Field.String");e.getSource().data("button").setIcon(W._getChartTypeIconLink(e1));if(j1&&n1){if(e1==="Line"){W.oConfig.filterCompList[d1].component.properties.sortOrder[0].Field.String=g1;m1.component.properties.sortOrder[0].Field.String=g1;if(i1){W.bSortOrder=W.oConfig.filterCompList[d1].component.properties.sortOrder[0].Descending.Boolean;W.oConfig.filterCompList[d1].component.properties.sortOrder[0].Descending.Boolean=true;m1.component.properties.sortOrder[0].Descending.Boolean=true;W.bIsTimeBasedLine=true;}}else{W.oConfig.filterCompList[d1].component.properties.sortOrder[0].Field.String=h1;m1.component.properties.sortOrder[0].Field.String=h1;if(W.bIsTimeBasedLine){W.oConfig.filterCompList[d1].component.properties.sortOrder[0].Descending.Boolean=W.bSortOrder;m1.component.properties.sortOrder[0].Descending.Boolean=W.bSortOrder;W.bIsTimeBasedLine=false;}}}m1.component.type=e1;k1.setProperty('/filterCompList/'+d1,m1);W.oState.oSmartFilterbar._oVariantManagement.currentVariantSetModified(true);W.oState.alr_visualFilterBar.updateVisualFilterBindings.apply(W,[true,true]);if(Z){Z.close();}});Z.attachAfterClose(function(){Z.destroy();Z=null;});Z.openBy(e.getSource());},_showLineChartTimeAxisPopup:function(e){var i=e.getSource().data("idx");var W=e.getSource();var X=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog(e.getSource().getModel('i18n'),"VISUAL_FILTER_LINE_CHART_TIME_LINE");var Y=new g({mode:z.ListMode.SingleSelectLeft,items:[new l({title:"{i18n>VISUAL_FILTER_LINE_CHART_TIME_LINE_DAYS}"}).data("idx",i),new l({title:"{i18n>VISUAL_FILTER_LINE_CHART_TIME_LINE_MONTH}"}).data("idx",i),new l({title:"{i18n>VISUAL_FILTER_LINE_CHART_TIME_LINE_QUARTERS}"}).data("idx",i),new l({title:"{i18n>VISUAL_FILTER_LINE_CHART_TIME_LINE_YEARS}"}).data("idx",i)]});Y.data("button",W);Y.addStyleClass("sapUiSizeCompact");X.addContent(Y);Y.attachSelectionChange(function(e){X.close();});X.attachAfterClose(function(){X.destroy();X=null;});X.openBy(e.getSource());},_showChartSortPopup:function(e){var i=this;var W=e.getSource().data("idx");var X=e.getSource();var Y=e.getSource().getModel('i18n');var Z=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog(Y,"VISUAL_FILTER_SORTING");var $=new g({mode:z.ListMode.SingleSelectLeft,includeItemInSelection:true,items:[new l({title:Y.getResourceBundle().getText("VISUAL_FILTER_SORTING_ASCENDING")}).data("idx",W),new l({title:Y.getResourceBundle().getText("VISUAL_FILTER_SORTING_DESCENDING")}).data("idx",W)]});$.data("button",X);$.addStyleClass("sapUiSizeCompact");if(this.filterChartList[W].getSortOrder()[0].Descending.Boolean){$.setSelectedItem($.getItems()[1],true);}else{$.setSelectedItem($.getItems()[0],true);}Z.addContent($);$.attachSelectionChange(function(e){var X=e.getSource().data("button");var W=X.data("idx");var _=jQuery.extend(true,[],i.filterChartList[W].getSortOrder());_[0].Descending.Boolean=e.getSource().getItems()[1].isSelected();if(_[0].Descending.Boolean){X.setIcon("sap-icon://sort-descending");}else{X.setIcon("sap-icon://sort-ascending");}var a1={bUpdateBinding:true,value:_};i.filterChartList[W].setSortOrder(a1);i._updateVisualFilterConfigModel(W,'/component/properties/sortOrder',a1);i._updateVisualFilterConfigModel(W,'/component/properties/sortOrder',_);if(Z){Z.close();}});Z.attachAfterClose(function(){Z.destroy();Z=null;});Z.openBy(e.getSource());},_createAddRemoveFiltersDialog:function(e,W){var i;var X=this;var Y=new D();Y.setTitle(this.oRb.getText("SELECT_FILTER_FIELDS"));Y.addStyleClass("sapUiPopupWithPadding");Y.addStyleClass("sapUiCompAddRemoveFilterDialog");Y.addStyleClass("sapUiSizeCompact");Y.setVerticalScrolling(true);var Z=new b();var $=new S({placeholder:this.oRb.getText("FILTER_BAR_SEARCH")});this._oSearchField=$;$.attachLiveChange(function(d1){X._onAddRemoveFiltersSearch(d1);});Z.addContentRight($);Y.setSubHeader(Z);this.addRemoveList=new g({mode:z.ListMode.MultiSelect});this.addRemoveList.setShowSeparators(m.None);Y.addContent(this.addRemoveList);for(i=0;i<this.filterCompList.length;i++){if(this.filterCompList[i].obj.group.name===e&&this.filterCompList[i].searchVisible){var _=this._getChartTitle(this.filterCompList[i].obj,i,true);var a1=new l({title:_.titleMD}).data("idx",i);this.addRemoveList.addItem(a1);if(this.filterCompList[i].obj.shownInFilterDialog){this.addRemoveList.setSelectedItem(a1,true);}}}this.addRemoveList.attachSelectionChange(function(d1){if(d1){var e1=d1.getParameters();if(e1){var a1=e1.listItem;var f1=a1.data("idx");if(a1){var g1={bVisible:e1.selected,propertyName:X.oConfig.filterCompList[f1].component.properties.parentProperty};X.oState.alr_visualFilterBar.fireFilterChange(g1);}}}});var b1=new B({text:this.oRb.getText("FORM_PERS_DIALOG_OK")});b1.attachPress(function(){var i;var d1=X.addRemoveList.getItems();var e1=X._getDialogConfigModel(),f1=jQuery.extend(true,{},e1);for(i=0;i<d1.length;i++){var g1=d1[i].data("idx");var h1=d1[i].isSelected();f1.setProperty('/filterCompList/'+g1+'/shownInFilterBar',h1);f1.setProperty('/filterCompList/'+g1+'/shownInFilterDialog',h1);}e1.setData(f1.getData());X.oConfig=JSON.parse(e1.getJSON());X.oState.alr_visualFilterBar.updateVisualFilterBindings.apply(this,[true,true]);X.oState.oSmartFilterbar._oVariantManagement.currentVariantSetModified(true);X._reloadForm();Y.close();});Y.addAggregation("buttons",b1);Y.setInitialFocus(this._oSearchField);Y.setContentHeight("23.25rem");var c1=new B({text:this.oRb.getText("FORM_PERS_DIALOG_CANCEL"),press:function(){Y.close();}});Y.addAggregation("buttons",c1);Y.attachAfterClose(function(){Y.destroy();Y=null;});Y.open();},_onAddRemoveFiltersSearch:function(e){var i;if(!e){return;}var W=e.getParameters();if(!W){return;}var X=(W.newValue?W.newValue:"").toLowerCase();var Y=this.addRemoveList.getItems();for(i=0;i<Y.length;i++){var Z=(Y[i].getTitle()).toLowerCase();Y[i].setVisible(Z.indexOf(X)>=0);}},_getChartTypeIconLink:function(i){var e=this.oState.alr_visualFilterBar._getSupportedFilterItemMap();var W=e[i];return!W?"":W.iconLink;},_getChartTitle:function(e,i,W){var X="";if(this.filterChartList[i]){if(W){e.component.properties=this.filterChartList[i].getP13NConfig();X=this.oState.alr_visualFilterBar.getTitleByFilterItemConfig(e);}else{X=this.filterChartList[i].getTitle();}}else{e.component.properties=this.oConfig.filterCompList[i].component.properties;X=this.oState.alr_visualFilterBar.getTitleByFilterItemConfig(e);}return X;},_adjustToolbarIcons:function(i){if(this.filterCompList[i].obj.component.type==="Line"){this.filterCompList[i].toolbar.getContent()[1].getItems()[1].setVisible(true);this.filterCompList[i].toolbar.getContent()[1].getItems()[2].setVisible(false);}else{this.filterCompList[i].toolbar.getContent()[1].getItems()[1].setVisible(false);this.filterCompList[i].toolbar.getContent()[1].getItems()[2].setVisible(true);}},_updateVisualFilterConfigModel:function(i,e,W,X){var Y=this._getDialogConfigModel();Y.setProperty('/filterCompList/'+i+e,W);if(X){var Z=jQuery.extend(true,{},Y.getProperty('/filterCompList/'+i));Y.setProperty('/filterCompList/'+i,Z);this.oState.alr_visualFilterBar.updateVisualFilterBindings.apply(this,[true,true]);}this.oConfig=Y.getData();this.oState.oSmartFilterbar._oVariantManagement.currentVariantSetModified(true);},_getVisibleMeasureList:function(e){var i={},W=this.oState.alr_visualFilterBar._getMeasureMap()[e];for(var X in W){var Y=W[X];if(!(Y.fieldInfo[r.Hidden]&&Y.fieldInfo[r.Hidden].Bool==="true")){i[Y.name]=Y;}}return i;},_triggerSearchInFilterDialog:function(e){var i;if(!e){return;}var W=e.getParameters();if(!W){return;}var X=(W.newValue?W.newValue:"").toLowerCase();for(i=0;i<this.oConfig.filterCompList.length;i++){var Y=this.oConfig.filterCompList[i].component.properties;var Z=this._getChartTitle(this.oConfig.filterCompList[i],i).titleMD.toLowerCase();var $=this._getLabelForDimensionsAndMeasures(Y,Y.parentProperty),_=this._getLabelForDimensionsAndMeasures(Y,Y.measureField),a1=($.indexOf(X)>=0)||(_.indexOf(X)>=0)||(Z.indexOf(X)>=0);this.oConfig.filterCompList[i].searchVisible=a1;}this._reloadForm();},_getDialogConfigModel:function(){return this.oVerticalBox.getModel('_visualFilterDialogModel');},_getLabelForDimensionsAndMeasures:function(e,i){var W=this.oState.alr_visualFilterBar._oMetadataAnalyser,X=this.oVerticalBox.getModel().getMetaModel(),Y=W.getEntityTypeNameFromEntitySetName(e.entitySet),Z=X.getODataEntityType(Y),$=X.getODataProperty(Z,i)[r.Label];$=$&&$.String?$.String:"";return $;}});sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog=function(i,e){if(this._oPopoverDialog){this._oPopoverDialog.destroy();}this._oPopoverDialog=new P();this._oPopoverDialog.setTitle(i.getResourceBundle().getText(e));this._oPopoverDialog.setPlacement(sap.m.PlacementType.PreferredBottomOrFlip);this._oPopoverDialog.addStyleClass("sapUiPopupWithPadding");return this._oPopoverDialog;};sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createFilterItemSelectedList=function(e,W){var X=new g({mode:z.ListMode.Delete}),Y,Z=e.getFilterRestriction();X.data("chart",e);if(Z==='multiple'){Y=jQuery.extend(true,{},e.getDimensionFilter());var $=(Y&&Y.items)?Y.items:undefined,_=(Y&&Y.ranges)?Y.ranges:undefined,a1=(Y&&Y.value)?Y.value:null;Y=jQuery.extend(true,{},e.getDimensionFilter());if($){for(var i=0;i<$.length;i++){var b1=new l({title:$[i].text?$[i].text:$[i].key});if(b1){b1.addCustomData(new x({key:'items',value:i}));}X.addItem(b1);}}if(_){for(var i=0;i<_.length;i++){var b1=new l({title:_[i].tokenText?_[i].tokenText:F.createTitleFromCode(_[i])});b1.addCustomData(new x({key:'ranges',value:i}));X.addItem(b1);}}if(a1){var b1=new l({title:a1});b1.addCustomData(new x({key:'value'}));X.addItem(b1);}}else{X.addItem(new l({title:e.getDimensionFilter()}));}X.attachDelete(function(c1){var d1=c1.getParameter("listItem"),e1=X.data('chart'),f1;if(Z==='single'){f1=null;}else{f1=jQuery.extend(true,{},e1.getDimensionFilter());var g1=d1.getCustomData()[0],h1=g1.getKey(),i1=f1[h1];if(h1!=='value'){var j1=g1.getValue();i1.splice(j1,1);}else{f1.value=null;}}X.removeItem(d1);e1.setDimensionFilter(f1);e1.fireFilterChange();W.removeContent(X);var k1=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createFilterItemSelectedList(e1,W);if(k1.getItems().length>0){W.addContent(k1);W.focus();}else{W.close();}});return X;};sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController.launchAllFiltersPopup=function(e,i,W){var X=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createPopoverDialog(W,"VISUAL_FILTER_ALL_SELECTED_FILTERS"),Y=sap.suite.ui.generic.template.AnalyticalListPage.controller.VisualFilterDialogController._createFilterItemSelectedList(i,X);X.addContent(Y);X.addStyleClass("sapUiSizeCompact");X.addStyleClass("sapSmartTemplatesAnalyticalListPageSelectedLinkDialog");var Z=new b();var $=new B({text:W.getResourceBundle().getText("CLEAR_FILTERS_ALL"),press:function(_){var a1=Y.data('chart'),b1=a1.getFilterRestriction(),c1;if(b1==='multiple'){c1=jQuery.extend(true,{},a1.getDimensionFilter());c1.items=[];c1.ranges=[];c1.value=null;}else{c1=null;}X.removeContent(Y);a1.setDimensionFilter(c1);a1.fireFilterChange();X.close();}});Z.addContentRight($);X.setFooter(Z);X.attachAfterClose(function(){X.destroy();X=null;});X.openBy(e);};return U;});
