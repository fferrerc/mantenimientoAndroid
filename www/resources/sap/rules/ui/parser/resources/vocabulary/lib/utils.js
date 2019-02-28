jQuery.sap.declare("sap.rules.ui.parser.resources.vocabulary.lib.utils");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.utilsBase");jQuery.sap.require("sap.rules.ui.parser.infrastructure.util.constants");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.constants");jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.constantsBase");jQuery.sap.require("sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector");jQuery.sap.require("sap.rules.ui.parser.businessLanguage.lib.constants");jQuery.sap.require("sap.rules.ui.parser.infrastructure.errorHandling.hrfException");jQuery.sap.require("sap.rules.ui.parser.resources.common.lib.constants");jQuery.sap.require("sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory");sap.rules.ui.parser.resources.vocabulary.lib.utils=sap.rules.ui.parser.resources.vocabulary.lib.utils||{};sap.rules.ui.parser.resources.vocabulary.lib.utils.lib=(function(){var v=sap.rules.ui.parser.resources.vocabulary.lib.utilsBase.lib;var a=new v.utilsBaseLib();var u=sap.rules.ui.parser.infrastructure.util.constants.lib;var c=sap.rules.ui.parser.resources.vocabulary.lib.constants.lib;var r=sap.rules.ui.parser.ruleBody.lib.constantsBase.lib;var R=sap.rules.ui.parser.infrastructure.messageHandling.lib.responseCollector.lib.ResponseCollector;var b=sap.rules.ui.parser.businessLanguage.lib.constants.lib;var h=sap.rules.ui.parser.infrastructure.errorHandling.hrfException.lib;var d=sap.rules.ui.parser.resources.common.lib.constants.lib;function e(){}e.prototype.handleError=function(m,p,f){var g=JSON.stringify(R.getInstance().addMessage(m,p));if(f){f.allMsg+=g;}else{throw new h.HrfException(g,false);}};e.prototype.validateAliasNamesUniquenessAgainstOtherVocabularies=function(f,g,j,k,l,m){var i;var n;var p;var o;var q;for(i=0;i<f.length;i++){n=f[i];q=g[n];if(q&&(!l||q.isPrivate)){p=[c.PROPERTY_NAME_ALIASES,n,c.PROPERTY_NAME_ALIASES,q.vocaName];this.handleError("error_vocabulary_parameter_name_exists_in_other_voca",p,m);}if(j.hasOwnProperty(n)){if(j[n]===null){p=[n];this.handleError("error_vocabulary_alias_name_cant_be_reserved_word",p,m);}p=[c.PROPERTY_NAME_ALIASES,n,c.PROPERTY_NAME_DATA_OBJECTS,j[n]];this.handleError("error_vocabulary_parameter_name_exists_in_other_voca",p,m);}if(k.hasOwnProperty(n)){o=k[n];if(k[n].vocaName===null){p=[n,o.objectName];this.handleError("error_vocabulary_alias_name_exists_as_an_attribute_name_in_global_attribute",p,m);}p=[n,o.objectName,o.vocaName];this.handleError("error_vocabulary_alias_name_exists_as_an_attribute_name_in_other_vocabulary",p,m);}}};e.prototype.isAlpha=function(f){return(f>="A".charCodeAt(0)&&f<="Z".charCodeAt(0))||(f>="a".charCodeAt(0)&&f<="z".charCodeAt(0));};e.prototype.isNumeric=function(f){return f>="0".charCodeAt(0)&&f<="9".charCodeAt(0);};e.prototype.isAllowedSpecialChar=function(f){return f==="_".charCodeAt(0);};e.prototype.isReservedWord=function(n){var p=new sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib.parsingBackendMediatorLib();return p.isReservedWord(n);};e.prototype.isValidToken=function(n){var f;if(n.length<1){return false;}if(!this.isAlpha(n.charCodeAt(0))){return false;}var i;for(i=1;i<n.length;i++){f=n.charCodeAt(i);if(!this.isAlpha(f)&&!this.isNumeric(f)&&!this.isAllowedSpecialChar(f)){return false;}}return true;};e.prototype.isValidName=function(n){if(!this.isValidToken(n)){return false;}if(this.isReservedWord(n)===true){return false;}return true;};e.prototype.isValidSize=function(f,g){var s=f.replace(/\s+/g,'');var i=[];if(g===u.SQL_TYPES.DECIMAL){i=s.split(",");if((i.length!==2)||!/^\d+$/.test(i[0])||!/^\d+$/.test(i[1])||(parseInt(i[0],10)===0)){return false;}}else if(!/^\d+$/.test(s)||(parseInt(s,10)===0)){return false;}return true;};e.prototype.validateAliases=function(f,g,j){var i;var k=[];var l;var m;var p;var n={};for(i=0;i<f.length;i++){l=f[i][c.PROPERTY_NAME_ALIAS_NAME];m=f[i][c.PROPERTY_NAME_ALIAS_CONTENT];if(!this.isValidName(l)){p=[l];this.handleError("error_vocabulary_invalid_alias_name",p,j);}if(!m||0===m.length){p=[l];this.handleError("error_vocabulary_alias_content_couldnt_be_empty",p,j);continue;}if(n.hasOwnProperty(l)){p=[l];this.handleError("error_vocabulary_alias_name_already_exists",p,j);continue;}if(g){if(g.dataObjects.hasOwnProperty(l)){p=[l];this.handleError("error_vocabulary_invalid_alias_name_exist_as_om",p,j);continue;}if(g.attributes.hasOwnProperty(l)){p=[l,g.attributes[l]];this.handleError("error_vocabulary_alias_name_exists_as_an_attribute_name",p,j);continue;}}n[f[i][c.PROPERTY_NAME_ALIAS_NAME]]=f[i][c.PROPERTY_NAME_ALIAS_NAME];k.push(f[i][c.PROPERTY_NAME_ALIAS_NAME]);}return k;};e.prototype.validateValueLists=function(f,g,j){var k=[];var l=null;var m;var p;var n=g.valueLists;for(l in f){if(f.hasOwnProperty(l)){m=f[l];if(!this.isValidName(l)){p=[l];this.handleError("error_vocabulary_invalid_value_list_name",p,j);}if(!m||0===m.length){p=[l];this.handleError("error_vocabulary_value_list_content_couldnt_be_empty",p,j);}k.push(f[l]);}}var i;for(l in n){if(n.hasOwnProperty(l)){if(f.hasOwnProperty(l)===false){for(i=0;i<n[l].length;i++){p=[l,n[l][i].attribute,n[l][i].dataObject];this.handleError("error_vocabulary_value_list_does_not_exist",p,j);}}}}return k;};e.prototype.collectErrorMessages=function(f,g,s){var m=[];if(f===c.ALIAS_CONTENT_DECISION_TABLE){m=m.concat(s);}else if(f===c.ALIAS_CONTENT_EXPRESSION){var i={"description":g[b.attributesNamesEnum.errorDetails]};m=m.concat(i);}return m;};e.prototype.isAliasContentValid=function(f,g){var i=false;if(g===c.ALIAS_CONTENT_DECISION_TABLE){if(f.status==="Error"){i=false;}else{i=true;}}else if(g===c.ALIAS_CONTENT_EXPRESSION){if(f[b.attributesNamesEnum.isValid]===true){i=true;}else{i=false;}}return i;};e.prototype.reValidateAliasContent=function(f,g,i,j,k){var l=null;if(j===c.ALIAS_CONTENT_DECISION_TABLE){var m={};m[r.OUTPUT_FLAGS_ENUM.validationOutput]=true;m[r.OUTPUT_FLAGS_ENUM.unknownTokensOutput]=true;m[r.OUTPUT_FLAGS_ENUM.isAlias]=true;l=f.reValidateBusinessRule(i,k,m,null);}else if(j===c.ALIAS_CONTENT_EXPRESSION){l=f.validateAndGetExpressionActualReturnTypeRT(k,g,i,null,false);}return l;};e.prototype.getVocabularyFullName=function(f,g){var i="";if(g&&g.hasOwnProperty(c.PROPERTY_NAME_NAME)){i=g[c.PROPERTY_NAME_NAME];}else{if(f[d.PROPERTY_NAME_PACKAGE]===undefined){i=f[d.PROPERTY_NAME_NAME];}else{i=f[d.PROPERTY_NAME_PACKAGE]+"::"+f[d.PROPERTY_NAME_NAME];}}return i;};e.prototype.autoCompleteAliasType=function(f){if(!f[c.PROPERTY_NAME_TYPE]){f[c.PROPERTY_NAME_TYPE]=c.ALIAS_CONTENT_EXPRESSION;}};e.prototype.addErrorMessages=function(p,f,g,j){var k;var l=[];var i;var m,n='';for(i=0;i<f.length;++i){k=f[i];l=[g,k.description];m=R.getInstance().addMessage(p,l);n+=JSON.stringify(m);}if(j){R.getInstance().addMessage("error_vocabulary_invalid_alias_dependancy",j);}return n;};e.prototype.validateAliasContent=function(f,g,i,j,k){var l=null;if(j===c.ALIAS_CONTENT_DECISION_TABLE){var m={};m[r.OUTPUT_FLAGS_ENUM.validationOutput]=true;m[r.OUTPUT_FLAGS_ENUM.unknownTokensOutput]=true;m[r.OUTPUT_FLAGS_ENUM.isAlias]=true;l=f.validateBusinessRule(g,i,k,m,null);}else if(j===c.ALIAS_CONTENT_EXPRESSION){l=f.validateAndGetExpressionActualReturnTypeRT(k,g,i,null,false);}return l;};e.prototype.getValidatorInstance=function(f){var g;if(f===c.ALIAS_CONTENT_DECISION_TABLE){jQuery.sap.require("sap.rules.ui.parser.ruleBody.lib.ruleBodyValidator");var i=sap.rules.ui.parser.ruleBody.lib.ruleBodyValidator.lib;g=new i.RuleBodyValidator();}else{var p=new sap.rules.ui.parser.businessLanguage.lib.parsingBackendMediator.lib.parsingBackendMediatorLib();g=p;}return g;};e.prototype.getHanaDataType=function(m){return a.getHanaDataType(m);};e.prototype.getBusinessDataType=function(f){return a.getBusinessDataType(f);};e.prototype.isVocabularySuffix=function(s){return s==="hprvocabulary"||s==="hrfvocabulary";};e.prototype.calculateScope=function(f,g,i){var s=g;var j;var k;var l=null;var m=null;var n=sap.rules.ui.parser.resources.vocabulary.lib.vocabularyDataProviderFactory.lib;m=new n.vocaDataProviderFactoryLib();l=m.getVocabularyDataProvider();if(f[c.PROPERTY_NAME_VOCABULARY_SCOPE]){s=c.GLOBAL;}else if(f.hasOwnProperty(c.PROPERTY_NAME_DEPENDENCY)){k=f[c.PROPERTY_NAME_DEPENDENCY];if(k[0]&&this.isVocabularySuffix(k[0].suffix)){j=k[0][c.PROPERTY_NAME_DEPENDS_ON_PACKAGE]+"::"+k[0][c.PROPERTY_NAME_DEPENDS_ON_NAME];var o=l.getVocabulary(j);if(o.scope===c.GLOBAL){s=g;}else{s=o.scope;}}}return s;};return{utilsLib:e};}());