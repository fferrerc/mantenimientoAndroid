sap.ui.define(["jquery.sap.global","./MaterialHandler","./TotaraUtils","./Coder"],function(q,M,T,C){"use strict";var I=function(){};I.setImage=function(s,i,a){if(T.checkError(i)){return i;}var r={};if(!a){if(i.error){r.error=i.error;}else{r.error="no image content for "+i.id;}return r;}i.binaryData=a;s.sceneBuilder.createImage(i);M.updateTexture(s,i.id);r.id=i.id;return r;};return I;});