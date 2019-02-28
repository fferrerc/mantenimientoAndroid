jQuery.sap.declare("sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseUtils");sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator=sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator||{};sap.rules.ui.parser.businessLanguage.lib.valueHelpValidator.lib=(function(){var c=sap.rules.ui.parser.businessLanguage.lib.constants.lib;var p=sap.rules.ui.parser.businessLanguage.lib.parseUtils.lib;var a=new p.parseUtilsLib();function g(k,l){var i=0;for(i=0;i<l.length;++i){if(l[i].id===k){return i;}}return-1;}function b(i,k){if((k===c.TYPE_STRING)||(k===c.TYPE_DATE)||(k===c.TYPE_TIMESTAMP)||(k===c.TYPE_TIME)){return i.slice(1,-1);}return i;}function d(t,i,m){var k={};k.id=t.info.id;var l=m.vocaRTServ.getValueList(m.vocabulary,t.info.id);if(l.hasOwnProperty(c.propertiesEnum.metadata)&&l.hasOwnProperty(c.propertiesEnum.businessType)){var n=l[c.propertiesEnum.metadata];n.businessDataType=l[c.propertiesEnum.businessType];k.metadata=n;}k.values=[];k.values.push(b(t.token,k.metadata.businessDataType));i.push(k);}function e(k,l){var i=0;for(i=0;i<l.length;++i){if(k===l[i]){return;}}l.push(k);}function f(k,l,m,r){var n=[];var o=0;var t=r.tokens||a.buildTokenTypes(k,l,m);var i=0;for(i=0;i<t.length;++i){if(t[i].tokenType===c.tokenTypesEnum.valueList){o=g(t[i].info.id,n);if(o===-1){d(t[i],n,m);}else{e(b(t[i].token,n[o].metadata.businessDataType),n[o].values);}}}if(n.length>0){r[c.propertiesEnum.valueHelp]={};r[c.propertiesEnum.valueHelp][c.propertiesEnum.info]=n;}}function h(k,l,t,m,n,o,r){if(t.length===0){t=a.buildTokenTypes(m,n,o);}var q=null;var s=o.vocaRTServ.getValueList(o.vocabulary,l);if(s.hasOwnProperty(c.propertiesEnum.businessType)){q=s[c.propertiesEnum.businessType];}var u={args:[]};var w={};var i=0;for(i=0;i<t.length;++i){if((t[i].tokenType===c.tokenTypesEnum.valueList)&&(t[i].info.id===l)&&(b(t[i].token,q)===k)){u.key="error_in_expression_invalid_value_from_external_list_message";u.args[0]=b(t[i].token,q);o.parseResult.cursorPosition=t[i].start;a.handleError(u.key,u.args,o);w=o.parseResult.getParseResults();r.status=w.status;r.errorDetails=w.errorDetails;r.errorID=w.errorID;r.cursorPosition=w.cursorPosition;return true;}}return false;}function v(k,l,m,n,r){var t=r.tokens||[];var o="";var q=[];var s=false;var i=0;for(i=0;i<k.length;++i){if(!k[i].hasOwnProperty(c.propertiesEnum.values)){continue;}q=k[i][c.propertiesEnum.values];for(o in q){if(q.hasOwnProperty(o)){if(!q[o]){s=h(o,k[i][c.propertiesEnum.id],t,l,m,n,r);if(s){return;}}}}}}var j=function(i,k,m,r){if(m.flags[c.propertiesEnum.valueHelp]&&m.flags[c.propertiesEnum.valueHelp].hasOwnProperty(c.propertiesEnum.collectInfo)&&m.flags[c.propertiesEnum.valueHelp][c.propertiesEnum.collectInfo]===true){f(i,k,m,r);}if(m.flags[c.propertiesEnum.valueHelp]&&m.flags[c.propertiesEnum.valueHelp].hasOwnProperty(c.propertiesEnum.info)){v(m.flags[c.propertiesEnum.valueHelp][c.propertiesEnum.info],i,k,m,r);}};return{"handleExternalValueHelp":j,"getValueHelpIndexInInfoArray":g};}());