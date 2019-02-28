/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2018 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/core/Element','sap/ui/mdc/chart/Item'],function(E,C){"use strict";var P=E.extend("sap.ui.mdc.chart.P13nDialogChartItem",{metadata:{library:"sap.ui.mdc",properties:{key:{type:"string"},text:{type:"string"},tooltip:{type:"string"},role:{type:"string"},visible:{type:"boolean",defaultValue:false}},defaultAggregation:"availableRoles",aggregations:{availableRoles:{type:"sap.ui.core.Item",multiple:true,singularName:"availableRoleType"},roleDependentTypes:{type:"sap.ui.core.Item",multiple:true,singularName:"roleDependentType"}}}});return P;},true);
