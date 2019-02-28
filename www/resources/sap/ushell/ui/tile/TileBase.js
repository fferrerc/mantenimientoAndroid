/*!
 * Copyright (c) 2009-2017 SAP SE, All Rights Reserved
 */
sap.ui.define(['sap/ui/core/Control','sap/ushell/library','./TileBaseRenderer'],function(C,l){"use strict";var T=C.extend("sap.ushell.ui.tile.TileBase",{metadata:{library:"sap.ushell",properties:{title:{type:"string",group:"Data",defaultValue:null},subtitle:{type:"string",group:"Data",defaultValue:null},icon:{type:"string",group:"Data",defaultValue:null},info:{type:"string",group:"Data",defaultValue:null},infoState:{type:"sap.ushell.ui.tile.State",defaultValue:sap.ushell.ui.tile.State.Neutral},targetURL:{type:"string",group:"Behavior",defaultValue:null},highlightTerms:{type:"any",group:"Appearance",defaultValue:[]}},aggregations:{content:{type:"sap.ui.core.Control",multiple:true,singularName:"content"}},events:{press:{}}}});T.prototype.ontap=function(e){this.firePress({});};T.prototype.onsapenter=function(e){this.firePress({});};T.prototype.onsapspace=function(e){this.firePress({});};return T;});
