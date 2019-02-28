jQuery.sap.declare("sap.rules.ui.parser.businessLanguage.lib.numberConversion");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parseUtils");sap.rules.ui.parser.businessLanguage.lib.numberConversion=sap.rules.ui.parser.businessLanguage.lib.numberConversion||{};sap.rules.ui.parser.businessLanguage.lib.numberConversion.lib=(function(){var c=sap.rules.ui.parser.businessLanguage.lib.constants.lib;var p=sap.rules.ui.parser.businessLanguage.lib.parseUtils.lib;var a=new p.parseUtilsLib();var i=function(l){if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l.locale.hasOwnProperty(c.propertiesEnum.localeSettings)&&l.locale.localeSettings.hasOwnProperty(c.propertiesEnum.number)&&l.locale.localeSettings.number.hasOwnProperty(c.propertiesEnum.groupSeparator)&&l.locale.localeSettings.number.groupSeparator===','){return true;}return false;};var b=function(l){if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l.locale.hasOwnProperty(c.propertiesEnum.localeSettings)&&l.locale.localeSettings.hasOwnProperty(c.propertiesEnum.number)&&l.locale.localeSettings.number.hasOwnProperty(c.propertiesEnum.decimalSeparator)&&l.locale.localeSettings.number.decimalSeparator==='.'){return true;}return false;};var d=function(l){if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l.locale.hasOwnProperty(c.propertiesEnum.localeSettings)&&l.locale.localeSettings.hasOwnProperty(c.propertiesEnum.number)&&l.locale.localeSettings.number.hasOwnProperty(c.propertiesEnum.groupSeparator)&&l.locale.localeSettings.number.groupSeparator==='.'){return true;}return false;};var e=function(l){if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l.locale.hasOwnProperty(c.propertiesEnum.localeSettings)&&l.locale.localeSettings.hasOwnProperty(c.propertiesEnum.number)&&l.locale.localeSettings.number.hasOwnProperty(c.propertiesEnum.decimalSeparator)&&l.locale.localeSettings.number.decimalSeparator===','){return true;}return false;};var f=function(l){if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l.locale.hasOwnProperty(c.propertiesEnum.localeSettings)&&l.locale.localeSettings.hasOwnProperty(c.propertiesEnum.number)&&l.locale.localeSettings.number.hasOwnProperty(c.propertiesEnum.groupSeparator)&&l.locale.localeSettings.number.groupSeparator===' '){return true;}return false;};var g=function(n){var r=new RegExp(/^\d+(\.\d+)?$/);return r.test(n);};var h=function(n,l){var m=n;if(l&&l.hasOwnProperty(c.propertiesEnum.locale)){if(i(l)&&b(l)){m=n.replace(/\,/g,"");}else if(d(l)&&e(l)){m=n.replace(/\./g,"").replace(/\,/g,'.');}else if(f(l)&&e(l)){m=n.replace(/\,/g,'.');}}return m;};var j=function(n,l){var m=null;var o=null;var q=null;function r(l){var o=null;if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.localeSettings)&&l[c.propertiesEnum.locale][c.propertiesEnum.localeSettings].hasOwnProperty(c.propertiesEnum.number)){o=l[c.propertiesEnum.locale][c.propertiesEnum.localeSettings][c.propertiesEnum.number];}return o;}function s(l){var u=null;if(l&&l.hasOwnProperty(c.propertiesEnum.locale)&&l[c.propertiesEnum.locale].hasOwnProperty(c.propertiesEnum.convert)){u=l[c.propertiesEnum.locale][c.propertiesEnum.convert];}return u;}function t(n,o){var u=[];var q=n;if(g(n)&&o&&o.hasOwnProperty(c.propertiesEnum.groupSeparator)&&o.hasOwnProperty(c.propertiesEnum.decimalSeparator)){u=n.split(".");if(o.groupSeparator!==' '){u[0]=u[0].replace(/\B(?=(\d{3})+(?!\d))/g,o[c.propertiesEnum.groupSeparator]);}q=u.join(o[c.propertiesEnum.decimalSeparator]);}return q;}o=r(l);m=s(l);if(o){if(m[c.propertiesEnum.source]===c.CODE_TEXT&&m[c.propertiesEnum.target]===c.DISPLAY_TEXT){q=t(n,o);}else if(m[c.propertiesEnum.source]===c.DISPLAY_TEXT&&m[c.propertiesEnum.target]===c.CODE_TEXT){q=h(n,l);}}return q;};var k=function(s,m,l,n){var o=s.indexOf(l);var q={};q.args=[];if(o>3){q.key="error_in_expression_enter_suggestions_format_instead_message";q.args[0]='Number';q.args[1]=a.getLocaleFormat(m,false).DECIMAL;q.args[2]=s;m.parseResult.cursorPosition=n;a.handleError(q.key,q.args,m);}};return{"convertNumber":j,"convertNumberToNativeFormat":h,"isNumberFormatFlagsOfGroupSeparatorComma":i,"isNumberFormatFlagsOfDecimalSeparatorDot":b,"isNumberFormatFlagsOfGroupSeparatorDot":d,"isNumberFormatFlagsOfDecimalSeparatorComma":e,"isNumberFormatFlagsOfGroupSeparatorSpace":f,"isValidNumberWithGroupSeperator":k};}());