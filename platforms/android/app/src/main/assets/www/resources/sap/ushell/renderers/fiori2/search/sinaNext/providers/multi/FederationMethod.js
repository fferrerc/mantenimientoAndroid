sinaDefine(['./FederationType'],function(F){"use strict";var m={};m.ranking={};m.ranking.sort=function(r){var c=[];for(var j=0;j<r.length;j++){c=c.concat(r[j]);}c.sort(function(a,b){var d=b.score-a.score;return d;});return c;};m.roundRobin={};m.roundRobin.sort=function(r){var s=[];for(var i=0;i<r.length;i++){s=m.roundRobin.mergeMultiResults(s,r[i],i+1);}return s;};m.roundRobin.mergeMultiResults=function(f,s,a){if(a<1){return[];}if(a===1){return s;}var b=f.length;var c=s.length;var r=[];for(var k=0;k<b;k++){r.push(f[k]);}for(var i=0;i<b;i++){if(i>=c){break;}r.splice(a*(i+1)-1,0,s[i]);}if(c>b){r=r.concat(s.slice(b-c));}return r;};m.advancedRoundRobin={};m.advancedRoundRobin.sort=function(c){var d=[];for(var j=0;j<c.length;j++){d=d.concat(c[j]);}var e={};for(var i=0;i<d.length;i++){var f=d[i].dataSource.id;if(!e[f]){e[f]=[];}e[f].push(d[i]);}var g=[];var h=0;for(var k in e){var l=e[k][0];var f=l.dataSource.id;var s=l.score;g.push({dataSourceId:f,score:s,index:h});h++;}g.sort(function(a,b){var t=b.score-a.score;if(t===0){t=a.index-b.index;}return t;});var n=[];var o=0;for(var r=0;r<d.length;){var p=g[o];var q=e[p.dataSourceId];if(q.length>0){n.push(q.shift());r++;}o=(o+1)%g.length;}return n;};return m;});
