/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/DataType','sap/ui/core/library'],function(D){"use strict";sap.ui.getCore().initLibrary({name:"sap.ui.layout",version:"1.52.16",dependencies:["sap.ui.core"],types:["sap.ui.layout.BackgroundDesign","sap.ui.layout.GridIndent","sap.ui.layout.GridPosition","sap.ui.layout.GridSpan","sap.ui.layout.BlockBackgroundType","sap.ui.layout.form.GridElementCells","sap.ui.layout.form.SimpleFormLayout"],interfaces:[],controls:["sap.ui.layout.AlignedFlowLayout","sap.ui.layout.DynamicSideContent","sap.ui.layout.FixFlex","sap.ui.layout.Grid","sap.ui.layout.HorizontalLayout","sap.ui.layout.ResponsiveFlowLayout","sap.ui.layout.ResponsiveSplitter","sap.ui.layout.ResponsiveSplitterPage","sap.ui.layout.Splitter","sap.ui.layout.VerticalLayout","sap.ui.layout.BlockLayoutCell","sap.ui.layout.BlockLayoutRow","sap.ui.layout.BlockLayout","sap.ui.layout.form.Form","sap.ui.layout.form.FormLayout","sap.ui.layout.form.GridLayout","sap.ui.layout.form.ResponsiveGridLayout","sap.ui.layout.form.ResponsiveLayout","sap.ui.layout.form.SimpleForm"],elements:["sap.ui.layout.GridData","sap.ui.layout.ResponsiveFlowLayoutData","sap.ui.layout.SplitterLayoutData","sap.ui.layout.form.FormContainer","sap.ui.layout.form.FormElement","sap.ui.layout.form.GridContainerData","sap.ui.layout.PaneContainer","sap.ui.layout.SplitPane","sap.ui.layout.form.GridElementData"],extensions:{flChangeHandlers:{"sap.ui.layout.BlockLayout":{"moveControls":"default"},"sap.ui.layout.BlockLayoutRow":{"moveControls":"default","hideControl":"default","unhideControl":"default"},"sap.ui.layout.BlockLayoutCell":"sap/ui/layout/flexibility/BlockLayoutCell","sap.ui.layout.form.SimpleForm":"sap/ui/layout/flexibility/SimpleForm","sap.ui.layout.Grid":{"moveControls":"default","hideControl":"default","unhideControl":"default"},"sap.ui.layout.FixFlex":{"moveControls":"default","hideControl":"default","unhideControl":"default"},"sap.ui.layout.form.Form":"sap/ui/layout/flexibility/Form","sap.ui.layout.form.FormContainer":"sap/ui/layout/flexibility/FormContainer","sap.ui.layout.form.FormElement":"sap/ui/layout/flexibility/FormElement","sap.ui.layout.HorizontalLayout":{"moveControls":"default","hideControl":"default","unhideControl":"default"},"sap.ui.layout.Splitter":{"moveControls":"default","hideControl":"default","unhideControl":"default"},"sap.ui.layout.VerticalLayout":{"moveControls":"default","hideControl":"default","unhideControl":"default"}}}});sap.ui.layout.BackgroundDesign={Solid:"Solid",Transparent:"Transparent",Translucent:"Translucent"};sap.ui.layout.GridIndent=D.createType('sap.ui.layout.GridIndent',{isValid:function(v){return/^(([Xx][Ll](?:[0-9]|1[0-1]))? ?([Ll](?:[0-9]|1[0-1]))? ?([Mm](?:[0-9]|1[0-1]))? ?([Ss](?:[0-9]|1[0-1]))?)$/.test(v);}},D.getType('string'));sap.ui.layout.GridPosition={Left:"Left",Right:"Right",Center:"Center"};sap.ui.layout.GridSpan=D.createType('sap.ui.layout.GridSpan',{isValid:function(v){return/^(([Xx][Ll](?:[1-9]|1[0-2]))? ?([Ll](?:[1-9]|1[0-2]))? ?([Mm](?:[1-9]|1[0-2]))? ?([Ss](?:[1-9]|1[0-2]))?)$/.test(v);}},D.getType('string'));sap.ui.layout.BlockBackgroundType={Default:"Default",Light:"Light",Mixed:"Mixed",Accent:"Accent",Dashboard:"Dashboard"};sap.ui.layout.BlockRowColorSets={ColorSet1:"ColorSet1",ColorSet2:"ColorSet2",ColorSet3:"ColorSet3",ColorSet4:"ColorSet4"};sap.ui.layout.BlockLayoutCellColorSet={ColorSet1:"ColorSet1",ColorSet2:"ColorSet2",ColorSet3:"ColorSet3",ColorSet4:"ColorSet4",ColorSet5:"ColorSet5",ColorSet6:"ColorSet6",ColorSet7:"ColorSet7",ColorSet8:"ColorSet8",ColorSet9:"ColorSet9",ColorSet10:"ColorSet10",ColorSet11:"ColorSet11"};sap.ui.layout.BlockLayoutCellColorShade={ShadeA:"ShadeA",ShadeB:"ShadeB",ShadeC:"ShadeC",ShadeD:"ShadeD"};sap.ui.layout.form=sap.ui.layout.form||{};sap.ui.layout.form.GridElementCells=D.createType('sap.ui.layout.form.GridElementCells',{isValid:function(v){return/^(auto|full|([1-9]|1[0-6]))$/.test(v);}},D.getType('string'));sap.ui.layout.form.SimpleFormLayout={ResponsiveLayout:"ResponsiveLayout",GridLayout:"GridLayout",ResponsiveGridLayout:"ResponsiveGridLayout"};sap.ui.layout.SideContentVisibility={AlwaysShow:"AlwaysShow",ShowAboveL:"ShowAboveL",ShowAboveM:"ShowAboveM",ShowAboveS:"ShowAboveS",NeverShow:"NeverShow"};sap.ui.layout.SideContentFallDown={BelowXL:"BelowXL",BelowL:"BelowL",BelowM:"BelowM",OnMinimumWidth:"OnMinimumWidth"};sap.ui.layout.SideContentPosition={End:"End",Begin:"Begin"};if(!sap.ui.layout.form.FormHelper){sap.ui.layout.form.FormHelper={createLabel:function(t){throw new Error("no Label control available!");},createButton:function(i,p,c){throw new Error("no Button control available!");},setButtonContent:function(b,t,T,i,I){throw new Error("no Button control available!");},addFormClass:function(){return null;},setToolbar:function(t){return t;},bArrowKeySupport:true,bFinal:false};}return sap.ui.layout;});
