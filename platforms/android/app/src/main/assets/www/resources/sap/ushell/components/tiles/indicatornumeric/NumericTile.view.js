sap.ui.define(['sap/ui/core/mvc/JSView','sap/ui/model/analytics/odata4analytics','sap/ushell/components/tiles/indicatorTileUtils/smartBusinessUtil'],function(J,o,s){"use strict";sap.ui.getCore().loadLibrary("sap.suite.ui.commons");sap.ui.jsview("sap.ushell.components.tiles.indicatornumeric.NumericTile",{getControllerName:function(){return"sap.ushell.components.tiles.indicatornumeric.NumericTile";},createContent:function(c){var h="Lorem ipsum";var a="Lorem ipsum";var t=sap.ushell.components.tiles.indicatorTileUtils.util.getTileTitleSubtitle(this.getViewData().chip);if(t.title&&t.subTitle){h=t.title;a=t.subTitle;}var g={subheader:a,header:h,footerNum:"",footerComp:"",scale:"",unit:"",value:"",size:"Auto",frameType:"OneByOne",state:sap.m.LoadState.Loading,valueColor:sap.m.ValueColor.Neutral,indicator:sap.m.DeviationIndicator.None,title:"",footer:"",description:""};this.oNVConfContS=new sap.m.NumericContent({value:"{/value}",scale:"{/scale}",unit:"{/unit}",indicator:"{/indicator}",valueColor:"{/valueColor}",size:"{/size}",formatterValue:true,truncateValueTo:5,nullifyValue:false});this.oNVConfS=new sap.ushell.components.tiles.sbtilecontent({unit:"{/unit}",size:"{/size}",footer:"{/footerNum}",content:this.oNVConfContS});this.oGenericTile=new sap.m.GenericTile({subheader:"{/subheader}",frameType:"{/frameType}",size:"{/size}",header:"{/header}",tileContent:[this.oNVConfS]});var G=new sap.ui.model.json.JSONModel();G.setData(g);this.oGenericTile.setModel(G);return this.oGenericTile;}});},true);
