sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/Utils/formatter",
	"ABMcontactos/TGN-ABMcontactos/model/models"
], function (BaseController,formatter,models) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.WorkOrderList", {
		formatter: formatter,
		
		onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("WorkOrderList").attachPatternMatched(this._onRouteMatched, this);
		},
		
		_onRouteMatched : function(oEvent){
					this._setNativeBackBehaviour(this.onExit,this);
        			var oModel = this.getModel("WorkOrderModel");
        			models.updateWOStatus();
        			this._setOnlineMode();
        			oModel.refresh(true);
        },
		_setOnlineMode: function(){
			models.setOnlineMode();
		},
		onExit: function(){
			if(navigator && navigator.app && navigator.app.exitApp) navigator.app.exitApp();
		},
		pressSync: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("SyncProgress");

		},
		onWorkOrderPress: function (oEvent) {
			var oRouter = this.getOwnerComponent().getRouter();
			var oSelectedWorkOrderContext = oEvent.getSource().getBindingContext("WorkOrderModel");
			this._setState("/oSelectedWorkOrderContext", oSelectedWorkOrderContext);
			var oWorkOrder = oSelectedWorkOrderContext.getObject();
			oRouter.navTo("VisitsList", {
				Id: oWorkOrder.Id
			});
		}

	});

});