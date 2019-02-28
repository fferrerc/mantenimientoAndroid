sap.ui.define(["jquery.sap.global","./Commands","./CameraHandler","./TreeHandler","./NotificationHandler","./MeshHandler","./MaterialHandler","./ImageHandler","./ViewHandler"],function(q,C,a,T,N,M,b,I,V){"use strict";var P=function(){var c=new Map();var n=0;this.setCommandCallback=function(d,e){c.set(d,e);};this.process=function(s,d){var r;var e=false;if(d.sceneId){s.currentSceneInfo.id=d.sceneId;}switch(d.name){case C.setCamera:r=a.setCamera(s,d.jsonContent,d.binaryContent);break;case C.notifyFinishedMaterial:r=N.notifyFinishedMaterial(s,d.jsonContent,d.binaryContent);break;case C.notifyFinishedImage:r=N.notifyFinishedImage(s,d.jsonContent,d.binaryContent);break;case C.notifyFinishedMesh:r=N.notifyFinishedMesh(s,d.jsonContent,d.binaryContent);break;case C.notifyFinishedGeometry:r=N.notifyFinishedGeometry(s,d.jsonContent,d.binaryContent);break;case C.setMesh:r=M.setMesh(s,d.jsonContent,d.binaryContent);break;case C.setMaterial:r=b.setMaterial(s,d.jsonContent,d.binaryContent);break;case C.setGeometry:r=M.setGeometry(s,d.jsonContent,d.binaryContent);break;case C.setImage:r=I.setImage(s,d.jsonContent,d.binaryContent);break;case C.notifyError:r=N.notifyError(s,d.jsonContent,d.binaryContent);break;case C.timestamp:r=N.timestamp(s,d.jsonContent,d.binaryContent);break;case C.setTree:r=T.setTree(s,d.jsonContent);break;case C.setTreeNode:r=T.setTreeNode(s,d.jsonContent);break;case C.notifyFinishedTree:r=T.notifyFinishedTree(s,d.jsonContent);break;case C.setView:r=V.setView(s,d.jsonContent);break;case C.setViewNode:r=V.setViewNode(s,d.jsonContent);break;case C.notifyFinishedView:r=V.notifyFinishedView(s,d.jsonContent);break;default:e=true;break;}var f=d.name;if(r&&r.error&&f!==C.notifyError){var g=c.get(C.notifyError);if(g){g(r);}}var h=c.get(f);if(h){h(r);}if(e){n++;}return r;};this.getNumberOfCommandsSkipped=function(){return n;};};return P;});
