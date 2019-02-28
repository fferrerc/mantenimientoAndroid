sap.ui.define(['sap/ushell/renderers/fiori2/search/SearchShellHelper','sap/ushell/renderers/fiori2/search/SearchConfiguration'],function(S,a){"use strict";return sap.ui.core.Control.extend("sap.ushell.renderers.fiori2.search.controls.SearchNoResultScreen",{metadata:{properties:{searchBoxTerm:"string"}},renderer:function(r,c){var s=S.getSearchInput();var b;if(s){b=s.getAriaDescriptionIdForNoResults();}var e=$('<div>').text(c.getSearchBoxTerm()).html();r.write('<div class="sapUshellSearch-no-result"');r.writeControlData(c);r.write('>');r.write('<div class="sapUshellSearch-no-result-icon">');r.writeIcon(sap.ui.core.IconPool.getIconURI("travel-request"));r.write('</div><div class="sapUshellSearch-no-result-text" role="alert">');r.write('<div ');if(b){r.write('id="'+b+'" ');}r.write('class="sapUshellSearch-no-result-info">'+sap.ushell.resources.i18n.getText("no_results_info",e).replace('<b>"&1"</b>','<b>"'+e+'"</b>'));r.write('</div>');c.renderAppFinderLink(r,c);r.write('<div class="sapUshellSearch-no-result-tips">'+sap.ushell.resources.i18n.getText("no_results_tips")+'</div> ');r.write('</div></div>');},renderAppFinderLink:function(r,c){if(!a.getInstance().isLaunchpad()){return;}var m=c.getModel();if(m.getDataSource()!==m.appDataSource){return;}var l=sap.ushell.resources.i18n.getText('no_results_link_appfinder','xxxx');var i=l.indexOf('xxxx');var p=l.slice(0,i);var s=l.slice(i+4);r.write('<div class="sapUshellSearch-no-result-info">');r.write(p);var b=new sap.m.Link({text:sap.ushell.resources.i18n.getText('appFinderTitle'),press:function(){var C=sap.ushell&&sap.ushell.Container&&(sap.ushell.Container.getService("SmartNavigation")||sap.ushell.Container.getService("CrossApplicationNavigation"));C.toExternal({target:{shellHash:'#Shell-home&/appFinder/catalog'}});}});r.renderControl(b);r.write(s);r.write('</div>');}});});