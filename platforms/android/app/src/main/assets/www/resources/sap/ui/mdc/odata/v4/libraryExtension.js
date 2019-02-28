/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/util/XMLPreprocessor','sap/ui/mdc/odata/v4/PhantomUtil',"sap/ui/mdc/odata/v4/ValueListHelper","sap/ui/mdc/odata/v4/field/FieldRuntime","sap/ui/mdc/odata/v4/table/TableRuntime"],function(X,P){"use strict";X.plugIn(P.resolve.bind("sap.ui.mdc.odata.v4.Table"),"sap.ui.mdc.odata.v4","Table");X.plugIn(P.resolve.bind("sap.ui.mdc.odata.v4.Form"),"sap.ui.mdc.odata.v4","Form");X.plugIn(P.resolve.bind("sap.ui.mdc.odata.v4.Field"),"sap.ui.mdc.odata.v4","Field");});
