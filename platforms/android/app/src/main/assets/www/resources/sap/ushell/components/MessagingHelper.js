sap.ui.define(["sap/ushell/services/Message"],function(M){'use strict';return{getLocalizedText:g,showLocalizedError:a,showLocalizedErrorHelper:b,showLocalizedMessage:s};function g(m,p){return sap.ushell.resources.i18n.getText(m,p);}function s(m,p,t){if(sap.ushell.Container){sap.ushell.Container.getService("Message").show(t||M.Type.INFO,g(m,p),p);}}function a(m,p){s(m,p,M.Type.ERROR);}function b(m,p){return function(){a(m,p);};}});