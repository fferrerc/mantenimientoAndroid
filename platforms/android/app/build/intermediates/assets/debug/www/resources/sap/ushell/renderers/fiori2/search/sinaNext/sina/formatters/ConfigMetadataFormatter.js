sinaDefine(['../../core/core','./ConfigFormatter'],function(c,C){"use strict";var m={type:'object',typeName:'DataSources',properties:[{name:'dataSources',multiple:true,getElementId:function(d){return d.id;},type:{type:'object',typeName:'DataSource',properties:[{name:'label',type:'string'},{name:'labelPlural',type:'string'},{name:'attributesMetadata',multiple:true,getElementId:function(a){return a.id;},type:{type:'object',typeName:'AttributeMetadata',properties:[{name:'label',type:'string'}]}}]}}]};return C.derive({_init:function(a){return C.prototype._init.apply(this,[m,a]);}});});
