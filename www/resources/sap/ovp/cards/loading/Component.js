sap.ui.define(["sap/ovp/cards/generic/Component","sap/ovp/cards/loading/State","jquery.sap.global"],function(C,L,q){"use strict";var l=C.extend("sap.ovp.cards.loading.Component",{metadata:{properties:{"footerFragment":{"type":"string","defaultValue":"sap.ovp.cards.loading.LoadingFooter"},"state":{"type":"string","defaultValue":L.LOADING},"controllerName":{"type":"string","defaultValue":"sap.ovp.cards.loading.Loading"}},version:"1.61.0",library:"sap.ovp"}});return l;});
