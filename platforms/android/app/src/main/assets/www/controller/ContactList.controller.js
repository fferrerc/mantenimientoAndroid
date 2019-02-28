sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/controller/BaseController",
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/StringUtils",
	"ABMcontactos/TGN-ABMcontactos/Utils/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (BaseController, models, StringUtils,formatter,Filter, FilterOperator) {
	"use strict";

	return BaseController.extend("ABMcontactos.TGN-ABMcontactos.controller.ContactList", {
		
		onInit: function(){
			
			//Validate selectedVisit or go back to mainList
			try{
				this._getState("/oVisitDetailContext").getObject();
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.getRoute("ContactList").attachPatternMatched(this._onRouteMatched, this);
			}catch(e){
				this.getRouter().navTo("MainList");
			}

		},
		
		formatter: formatter,
		
		_onRouteMatched: function(oEvent){
			
			// Filter contacts for only those belonging to the same recipient.
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			var oFilters = new Filter({
				filters: [
					new sap.ui.model.Filter("RecipientId", FilterOperator.EQ, parseInt(oArgs.RecipientId,10)),
					new sap.ui.model.Filter("Type", FilterOperator.EQ, oArgs.RecipientType),
					new sap.ui.model.Filter("Office", FilterOperator.EQ, parseInt(oArgs.RecipientOffice,10))
				],
				and: true
			});
			
			var oContactsBinding = this.getView().byId("contactsTable").getBinding("items"); 
			oContactsBinding.filter(oFilters);
			
						
			this._setNativeBackBehaviour(this.onCancel,this);
			
			this.getView().byId("contactsTable").removeSelections(true); 
			this._setState("/bContactSelected", false);
			this._setState("/oSelectedContactContext", null);
		},

		onContactItemPress: function (oEvent) {
			var oSelectedContactContext = oEvent.getSource().getSelectedItem().getBindingContext("WorkOrderModel");
			this._setState("/oSelectedContactContext", oSelectedContactContext);
			this._setState("/bContactSelected", true);
		},

		onEditContact: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oSelectedContactContext = this._getState("/oSelectedContactContext");
			var oSelectedContact = oSelectedContactContext.getObject();
			this._setState("/bNewContact", false);
			oRouter.navTo("Contact", oSelectedContact);
		},

		onAddContact: function () { 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var oSelectedVisitContext = this._getState("/oVisitDetailContext");
			var oSelectedVisit = oSelectedVisitContext.getObject();
			this._setState("/bNewContact", true);
			oRouter.navTo("Contact", {
				Id: this.generateId(),
				RecipientId: oSelectedVisit.RecipientId,
				Type: oSelectedVisit.RecipientType,
				Office: oSelectedVisit.RecipientOffice
			});
			
		},

		onSelectContact: function (oEvent) {
			models.selectVisitsContact(this._getState("/oSelectedContactContext").getObject(), function(){});
			this._onNavBack();
		},
		onCancel:function(oEvent){
			this._onNavBack();
		}

	});

});