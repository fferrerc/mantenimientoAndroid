sinaDefine(['../../core/core','../../sina/ComplexCondition','../../sina/ComparisonOperator','./typeConverter','../../sina/AttributeType'],function(c,C,a,t,A){"use strict";var b=c.defineClass({_init:function(d){this.dataSource=d;},convertSinaToOdataOperator:function(s){switch(s){case a.Eq:return':EQ(S)';case a.Lt:return':LT';case a.Gt:return':GT';case a.Le:return':LE';case a.Ge:return':GE';case a.Co:return':EQ';case a.Bw:return':EQ';case a.Ew:return':EQ';case'And':return"AND";case'Or':return"OR";default:throw new c.Exception('unknow comparison operator '+s);}},serializeComplexCondition:function(d){var r={"Id":1,"OperatorType":this.convertSinaToOdataOperator(d.operator),"SubFilters":[]};var s=d.conditions;for(var i=0;i<s.length;++i){var e=s[i];r.SubFilters.push(this.serialize(e));}var f="";if(r.SubFilters.length>1){f=r.SubFilters.join(' '+r.OperatorType+' ');}else if(r.SubFilters.length===1){f=r.SubFilters[0];}if(r.SubFilters.length>1){f='('+f+')';}return f;},serializeSimpleCondition:function(d){var m;var e;var f;m=this.dataSource.getAttributeMetadata(d.attribute);e=m.type;f={"ConditionAttribute":d.attribute,"ConditionOperator":this.convertSinaToOdataOperator(d.operator),"ConditionValue":t.sina2Odata(e,d.value,{operator:d.operator})};var q='';if(e===A.String||e===A.Longtext||e===A.Timestamp){q='"';}return'('+f.ConditionAttribute+f.ConditionOperator+':'+q+f.ConditionValue+q+')';},serializeBetweenCondition:function(d){var m;var e;m=this.dataSource.getAttributeMetadata(d.conditions[0].attribute);e=m.type;var q='';if(e===A.Date||e===A.Time||e===A.Timestamp){q='\\"';}var r=d.conditions[0].attribute+this.convertSinaToOdataOperator(d.conditions[0].operator)+':'+q+t.sina2Odata(e,d.conditions[0].value,{operator:d.conditions[0].operator})+q;r+=" AND ";r+=d.conditions[1].attribute+this.convertSinaToOdataOperator(d.conditions[1].operator)+":"+q+t.sina2Odata(e,d.conditions[1].value,{operator:d.conditions[1].operator})+q;r="("+r+")";return r;},serialize:function(d){if(d instanceof C){if(d.operator==="And"&&d.conditions.length>1&&d.conditions[0]&&(d.conditions[0].operator==="Ge"||d.conditions[0].operator==="Gt"||d.conditions[0].operator==="Le"||d.conditions[0].operator==="Lt")){return this.serializeBetweenCondition(d);}else{return this.serializeComplexCondition(d);}}else{return this.serializeSimpleCondition(d);}}});return{serialize:function(d,e){var s=new b(d);return s.serialize(e);}};});
