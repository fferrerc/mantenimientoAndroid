sap.ui.define(['sap/ushell/renderers/fiori2/search/userpref/SearchPrefsModel'],function(S){"use strict";var m=sap.ushell.renderers.fiori2.search.userpref.SearchPrefs={};jQuery.extend(m,{model:new S(),getEntry:function(){return{title:sap.ushell.resources.i18n.getText('sp.userProfiling'),editable:true,isSearchPrefsActive:this.model.isSearchPrefsActive.bind(this.model),value:this.model.shortStatus.bind(this.model),onSave:this.model.savePreferences.bind(this.model),onCancel:this.model.cancelPreferences.bind(this.model),content:function(){return this.model.asyncInit().then(function(){var u=sap.ui.view({id:'searchPrefsView',type:sap.ui.core.mvc.ViewType.JS,viewName:'sap.ushell.renderers.fiori2.search.userpref.SearchPrefsDialog'});u.setModel(this.model);return u;}.bind(this));}.bind(this)};}});return m;});
