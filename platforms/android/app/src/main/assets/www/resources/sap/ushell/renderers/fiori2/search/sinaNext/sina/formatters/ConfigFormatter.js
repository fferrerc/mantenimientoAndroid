sinaDefine(['../../core/core','./Formatter','../../configurationEngine/configuratorFactory'],function(c,F,a){"use strict";return F.derive({_init:function(t,b){this.type=t;this.configuration=b;},initAsync:function(){return a.createConfiguratorAsync({type:this.type,configuration:this.configuration}).then(function(b){this.configurator=b;}.bind(this));},formatAsync:function(o){return this.configurator.configureAsync(o);},format:function(o){return this.configurator.configure(o);}});});
