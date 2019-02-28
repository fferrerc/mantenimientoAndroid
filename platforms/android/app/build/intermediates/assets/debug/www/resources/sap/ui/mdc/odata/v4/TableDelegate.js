/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/mdc/TableDelegate"],function(T){"use strict";var O=Object.assign({},T);O.fetchProperties=function(t){var p=[],o,e,E,m,M,P;E=t._oBindingInfo.path;m=t.getModel(t._oBindingInfo.model);M=m.getMetaModel();e=M.getObject(E+"/");for(var k in e){o=e[k];if(o&&o.$kind==="Property"){P=M.getObject(E+"/"+k+"@");p.push({name:k,label:P["@com.sap.vocabularies.Common.v1.Label"],description:P["@com.sap.vocabularies.Common.v1.Text"]&&P["@com.sap.vocabularies.Common.v1.Text"].$Path,maxLength:o.$MaxLength,type:o.$Type});}}return p;};return O;},false);
