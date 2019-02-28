sap.ui.define(["jquery.sap.global","sap/ovp/cards/AnnotationHelper","sap/ui/model/odata/AnnotationHelper","sap/ui/model/FilterOperator"],function(q,C,O,F){"use strict";function g(i){var s=[];var S,D;var P=i.getProperty("/sortBy");if(P){var j=i.getProperty("/sortOrder");if(j&&j.toLowerCase()!=="descending"){D=false;}else{D=true;}S={path:P,descending:D};s.push(S);}return s;}function a(s,S){var t=[];var u=s.getProperty("/filters");if(u){t=t.concat(u);}var v=S&&S.SelectOptions;var w,P,R;if(v){for(var i=0;i<v.length;i++){w=v[i];P=w.PropertyName.PropertyPath;for(var j=0;j<w.Ranges.length;j++){R=w.Ranges[j];if(R.Sign.EnumMember){var x={path:P,operator:R.Option.EnumMember.split("/")[1],value1:C.getPrimitiveValue(R.Low),value2:C.getPrimitiveValue(R.High),sign:R.Sign.EnumMember==="com.sap.vocabularies.UI.v1.SelectionRangeSignType/I"?"I":"E"};if(x.sign==="E"&&x.operator!==F.EQ){q.sap.log.error("Exclude sign is supported only with EQ operator");continue;}if(x.sign==="E"&&x.operator===F.EQ){x.operator=F.NE;x.sign="I";}if(x.operator==="CP"&&x.sign==="I"){var I=F.Contains;var V=x.value1;if(V){var y=V.indexOf('*');var z=V.lastIndexOf('*');if(y>-1){if((y===0)&&(z!==(V.length-1))){I=F.EndsWith;V=V.substring(1,V.length);}else if((y!==0)&&(z===(V.length-1))){I=F.StartsWith;V=V.substring(0,V.length-1);}else{V=V.substring(1,V.length-1);}}}x.operator=I;x.value1=V;}t.push(x);}}}}return t;}function f(i,E,H){var M=i.getSetting("ovpCardProperties");var j=M.getProperty("/metaModel");var s=j.getODataEntityType(E.entityType);var t="/"+E.name;var S=s[M.getProperty("/selectionAnnotationPath")];var I;var u=M.getProperty("/layoutDetail");if(u==='resizable'){var v=M.getProperty("/cardLayout");if(v){if(M.getProperty("/listFlavor")==="standard"){var w="";for(var x in H){w+=x;}var R=M.getProperty("/cardLayout/iRowHeigthPx");if(R===undefined){R=16;}var y;if(M.getProperty("/densityStyle")==="cozy"){y=72;if((w.indexOf("Description")===-1)&&((w.indexOf("Title")>0&&w.indexOf("ImageUrl")>0)||(w.indexOf("Title")>0&&w.indexOf("TypeImageUrl")>0))){y=56;}else if((w.indexOf("Description")===-1)&&w.indexOf("Title")>0){y=48;}}else{y=60;if((w.indexOf("Description")===-1)&&((w.indexOf("Title")>0&&w.indexOf("ImageUrl")>0)||(w.indexOf("Title")>0&&w.indexOf("TypeImageUrl")>0))){y=48;}else if((w.indexOf("Description")===-1)&&w.indexOf("Title")>0){y=40;}}M.setProperty('/cardLayout/itemHeight',y);if(!M.getProperty("/defaultSpan")&&M.getProperty("/cardLayout/autoSpan")){I=M.getProperty("/cardLayout/noOfItems");var z=Math.ceil((I*y+M.getProperty("/cardLayout/headerHeight")+2*M.getProperty("/cardLayout/iCardBorderPx"))/R);M.setProperty("/cardLayout/noOfItems",z);}else{var A=Math.floor(((v.rowSpan*R)-M.getProperty("/cardLayout/headerHeight")-2*M.getProperty("/cardLayout/iCardBorderPx")));I=Math.floor(A/y)*v.colSpan;}}}}else{I=6;}var B=i.getSetting('ovpCardProperties'),P=B.getProperty('/parameters');if(S||!!P){if((S&&S.Parameters)||!!P){t=C.resolveParameterizedEntitySet(i.getSetting("dataModel"),E,S,P);}}var D="{path: '"+t+"', length: "+I;var G=g(M);if(G.length>0){D=D+", sorter:"+JSON.stringify(G);}var J=a(M,S);if(J.length>0){D=D+", filters:"+JSON.stringify(J);}D=D+"}";return D;}f.requiresIContext=true;function b(i,u){var B=i.getModel().getProperty("/baseUrl");return m(B,u);}b.requiresIContext=true;function c(i,D){var I=true;var s=O.format(i,D);if(s.toLowerCase().indexOf("icon")>0){I=false;}return I;}c.requiresIContext=true;function d(D){var i=true;if(!D){return null;}else if(D.toLowerCase().indexOf("icon")>0){i=false;}return i;}function e(u){var i=new RegExp("((http|https)(:\/\/))?([a-zA-Z0-9]+[.]{1}){2}[a-zA-z0-9]+(\/{1}[a-zA-Z0-9]+)*\/?","i");return i.test(u);}function h(t){var i;if(t.hasOwnProperty("Path")){i="{"+t.Path+"}";}else{i=t.String;}return i;}function k(s){var P="{"+s.String+"}";return P;}function l(A){if(A){return 1;}return 0;}function m(B,u){if(!u){return undefined;}else if(u.lastIndexOf(B,0)===0||u.indexOf("://")>0){return u;}else if(u.lastIndexOf("/",0)===0){return B+u;}else{return B+"/"+u;}}function n(i,s,v){var j;if(typeof v==="object"){j=v[i];}else{j=(typeof v==="boolean")?v:true;}return!s[i]&&j;}function o(L,s,j){var N="";if(L){if(s&&j){N="#"+s+"-"+j;for(var i=0;i<L.length;i++){if(L[i].value===N){return L[i].name;}}N="";}else{return L[0].name;}}return N;}function p(i,I){return m(i.baseUrl,I);}function r(R){return this.getModel("contentRow").aBindings[0].getContext().getPath().replace("/staticContent/","");}return{formatItems:f,formatUrl:b,isImageUrl:c,isImageUrlStaticData:d,isValidURL:e,getIconPath:h,formatString:k,linkedAction:l,formUrl:m,isVisible:n,getApplicationName:o,getImageUrl:p,contentRowIndex:r};},true);
