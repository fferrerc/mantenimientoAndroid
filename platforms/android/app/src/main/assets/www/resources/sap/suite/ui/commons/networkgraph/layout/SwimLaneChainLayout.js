sap.ui.define(["sap/suite/ui/commons/library","./LayoutAlgorithm","./Geometry","./LayoutTask","sap/suite/ui/commons/networkgraph/Orientation"],function(l,L,G,a,O){"use strict";var b=l.networkgraph.LayoutRenderType,c=32,d=50,e=75,S=75,f=75,C=32,g=10,h=25;var k=L.extend("sap.suite.ui.commons.networkgraph.layout.SwimlaneChainLayout",{metadata:{library:"sap.suite.ui.commons",properties:{}}});k.prototype.getLayoutRenderType=function(){return b.SwimLanes;};k.prototype.layout=function(){return new a(function(r,R,o){var i=this.getParent(),E;if(!i){R("The algorithm must be associated with a graph.");return;}this.oGraph=i;E=this._validateGraphDefinition();if(E){R(E);}this.bVertLane=i.getOrientation()===O.LeftRight||i.getOrientation()===O.RightLeft;this._calcLanesProperties();this._findRoots();this._initGrid();this._traceAndStackNodes();this._calcRowsProperties();this._calcNodesCoordinates();this.oGraph.getLines().forEach(function(j){this._traceSingleLine(j);this._calcLineCentroid(j);j._aNipples=[];}.bind(this));this._indexAllLineFragments();this._cutLinesAtBoxNodeBorders();this._removeLineOverlays(this.aHorizontalFragments,true);this._removeLineOverlays(this.aVerticalFragments,false);this._calcLanesWidthsAndPositions();this._collapseShiftNodesAndLines();this._alignCoordinatesWithView();this._beautify();this._findAllNipples();this._cullLineFragmentsInCollapsedGroups();if(i.getOrientation()===O.RightLeft){this._verticalMirror();}else if(i.getOrientation()===O.BottomTop){this._horizontalMirror();}r();}.bind(this));};k.prototype._validateGraphDefinition=function(){var u=[];this.oGraph.getNodes().forEach(function(n){if(!n.getGroup()){u.push(n.getKey());}});if(u.length>0){return"Some nodes are missing swim lanes: "+u.join();}else{return null;}};k.prototype._calcLanesProperties=function(){this.aLanes=[];this.oGraph.getGroups().forEach(function(j){if(this.bVertLane){j.setY(0);}else{j.setX(0);}this.aLanes.push(j.getKey());}.bind(this));this.aLanes.sort();this.oGraph.getNodes().forEach(function(N){N._iGroupIndex=this.aLanes.indexOf(N.getGroup());}.bind(this));var n;this.aLaneWidths={};this.aLaneOffsets={};this.oGraph.getNodes().forEach(function(N){n=this.bVertLane?N._iWidth:N._iHeight;if(!this.aLaneWidths[N._iGroupIndex]||this.aLaneWidths[N._iGroupIndex]<n){this.aLaneWidths[N._iGroupIndex]=n;}}.bind(this));var i;this.aLaneGroups={};this.oGraph.getGroups().forEach(function(j){i=this.aLanes.indexOf(j.getKey());if(this.aLaneWidths[i]<j.getMinWidth()){this.aLaneWidths[i]=j.getMinWidth();}this.aLaneGroups[i]=j;}.bind(this));var o=0;Object.keys(this.aLaneWidths).forEach(function(i){if(o>0){o+=S;}this.aLaneOffsets[i]=o;o+=this.aLaneWidths[i];}.bind(this));};k.prototype._findRoots=function(){this.aRoots=[];this.oGraph.getNodes().forEach(function(n){if((n._iGroupIndex===0)&&(n.aParents.length===0)){this.aRoots.push(n);}}.bind(this));this.oGraph.getNodes().forEach(function(n){if((n._iGroupIndex>0)&&(n.aParents.length===0)){this.aRoots.push(n);}}.bind(this));if(this.aRoots.length===0){this.aRoots.push(this.oGraph.getNodes()[0]);}};k.prototype._initGrid=function(){this.aGrid=[];this.oGraph.getNodes().forEach(function(n){if(!this.aGrid[n._iGroupIndex]){this.aGrid[n._iGroupIndex]=[];}n._bChainTraced=false;}.bind(this));};k.prototype._traceAndStackNodes=function(){this.aRoots.forEach(function(r){this.aGrid[r._iGroupIndex].push(r);r._bChainTraced=true;this._traceNodeChainDepthFirst(r);}.bind(this));};k.prototype._traceNodeChainDepthFirst=function(n){n.aChildren.forEach(function(o){if(!o._bChainTraced){o._bChainTraced=true;this.aGrid[o._iGroupIndex].push(o);this._traceNodeChainDepthFirst(o);}}.bind(this));};k.prototype._calcRowsProperties=function(){var m=0,n;this.aGrid.forEach(function(s){if(s.length>m){m=s.length;}});this.aRowHeights=[];this.aRowOffsets=[];for(var r=0;r<m;r++){this.aGrid.forEach(function(s){if(!s[r]){return;}n=this.bVertLane?s[r]._iHeight:s[r]._iWidth;if(!this.aRowHeights[r]||this.aRowHeights[r]<n){this.aRowHeights[r]=n;}}.bind(this));}var i=-1,o=0;this.aRowHeights.forEach(function(H){i++;if(i>0){o+=S;}this.aRowOffsets[i]=o;o+=H;}.bind(this));this.fGridHeight=this.aRowOffsets[m-1]+this.aRowHeights[m-1];if(this.bVertLane){this.fGridHeight+=d;}else{this.fGridHeight+=e;}this.oGraph.getGroups().forEach(function(j){if(this.bVertLane){j._iHeight=this.fGridHeight;}else{j._iWidth=this.fGridHeight;}}.bind(this));};k.prototype._calcNodesCoordinates=function(){var y;this.aGrid.forEach(function(s){y=-1;s.forEach(function(n){y++;if(this.bVertLane){n.setX(this.aLaneOffsets[n._iGroupIndex]+this.aLaneWidths[n._iGroupIndex]/2-n._iWidth/2+S/2);n.setY(this.aRowOffsets[y]+this.aRowHeights[y]/2-n._iHeight/2+f/2);}else{n.setX(this.aRowOffsets[y]+this.aRowHeights[y]/2-n._iWidth/2+f/2);n.setY(this.aLaneOffsets[n._iGroupIndex]+this.aLaneWidths[n._iGroupIndex]/2-n._iHeight/2+S/2);}n.iRow=y;}.bind(this));}.bind(this));};k.prototype._calcLineCentroid=function(o){var i=o.getBends().length+2,x=o.getSource().getX()+o.getTarget().getX(),y=o.getSource().getY()+o.getTarget().getY();o.getBends().forEach(function(B){x+=B.getX();y+=B.getY();});o._oCentroid={x:x/i,y:y/i};};k.prototype._indexAllLineFragments=function(){this.aVerticalFragments=[];this.aHorizontalFragments=[];this.oGraph.getLines().forEach(function(o){this._indexLineFragments(o);}.bind(this));};k.prototype._indexLineFragments=function(o){var p=this._getLinePointsList(o),j,m;for(var i=0;i<p.length-1;i++){j=p[i];m=p[i+1];if(j.x===m.x){if(j.y<m.y){this.aVerticalFragments.push({line:o,index:i,cc:j.x,c1:j.y,c2:m.y});}else{this.aVerticalFragments.push({line:o,index:i,cc:j.x,c1:m.y,c2:j.y,invert:true});}}else if(j.y===m.y){if(j.x<m.x){this.aHorizontalFragments.push({line:o,index:i,cc:j.y,c1:j.x,c2:m.x});}else{this.aHorizontalFragments.push({line:o,index:i,cc:j.y,c1:m.x,c2:j.x,invert:true});}}}};k.prototype._removeLineOverlays=function(F,H){var o,m,s,n,p;for(var i=0;i<F.length;i++){o=F[i];m=[o];for(var j=i+1;j<F.length;j++){if(this._doFragmentsIntersect(o,F[j])){m.push(F[j]);}}if(m.length===1){continue;}m.sort(function(q,r){if(H){return q.line._oCentroid.y-r.line._oCentroid.y;}else{return q.line._oCentroid.x-r.line._oCentroid.x;}});s=(m.length-1)*g;if(s>h){s=h;}n=s/(m.length-1);p=o.cc-s/2;for(j=0;j<m.length;j++){this._shiftLineFragment(m[j],p,!H);p+=n;}}};k.prototype._shiftLineFragment=function(F,n,H){var i=F.line.getCoordinates()[F.index],j=F.line.getCoordinates()[F.index+1];F.cc=n;if(H){i.setX(n);j.setX(n);}else{i.setY(n);j.setY(n);}};k.prototype._doFragmentsIntersect=function(F,o){return(F.cc===o.cc)&&!(F.c1<o.c1&&F.c1<o.c2&&F.c2<o.c1&&F.c2<o.c2||F.c1>o.c1&&F.c1>o.c2&&F.c2>o.c1&&F.c2>o.c2);};k.prototype._getLinePointsList=function(o){var p=[];p.push({x:o.getSource().getX(),y:o.getSource().getY()});o.getBends().forEach(function(B){p.push({x:B.getX(),y:B.getY()});});p.push({x:o.getTarget().getX(),y:o.getTarget().getY()});return p;};k.prototype._calcLanesWidthsAndPositions=function(){var i=0,j=0;this.oGraph.getGroups().forEach(function(o){i=this.aLanes.indexOf(o.getKey());o._fExpandedWidth=this.aLaneWidths[i]+S;o._fExpandedPosition=this.aLaneOffsets[i];if(this.bVertLane){o.setX(this.aLaneOffsets[i]+j);}else{o.setY(this.aLaneOffsets[i]+j);}if(o.getCollapsed()){if(this.bVertLane){o._iWidth=C;}else{o._iHeight=C;}j+=(C-(this.aLaneWidths[i]+S));}else{if(this.bVertLane){o._iWidth=o._fExpandedWidth;}else{o._iHeight=o._fExpandedWidth;}}}.bind(this));};k.prototype._collapseShiftNodesAndLines=function(){var s,i;this.oGraph.getGroups().forEach(function(o){i=C/o._fExpandedWidth;this.oGraph.getNodes().forEach(function(n){if(this.bVertLane){if(n.getCenterPosition().x>o._fExpandedPosition&&n.getCenterPosition().x<=(o._fExpandedPosition+o._fExpandedWidth)){s=o.getX()-o._fExpandedPosition;if(o.getCollapsed()){s+=(C-o._fExpandedWidth)/2;}n.setX(n.getX()+s);}}else{if(n.getCenterPosition().y>o._fExpandedPosition&&n.getCenterPosition().y<=(o._fExpandedPosition+o._fExpandedWidth)){s=o.getY()-o._fExpandedPosition;if(o.getCollapsed()){s+=(C-o._fExpandedWidth)/2;}n.setY(n.getY()+s);}}}.bind(this));this.oGraph.getLines().forEach(function(j){j.getCoordinates().forEach(function(m){if(this.bVertLane){if(m.getX()>o._fExpandedPosition&&m.getX()<=(o._fExpandedPosition+o._fExpandedWidth)){s=o.getX()-o._fExpandedPosition;if(o.getCollapsed()){s-=(m.getX()-o._fExpandedPosition)*(1-i);}m.setX(m.getX()+s);}}else{if(m.getY()>o._fExpandedPosition&&m.getY()<=(o._fExpandedPosition+o._fExpandedWidth)){s=o.getY()-o._fExpandedPosition;if(o.getCollapsed()){s-=(m.getY()-o._fExpandedPosition)*(1-i);}m.setY(m.getY()+s);}}}.bind(this));}.bind(this));}.bind(this));};k.prototype._traceSingleLine=function(o){var F,t,j,T;F=o.getFromNode();t=o.getToNode();j=F.getCenterPosition();T=t.getCenterPosition();o.setSource({x:j.x,y:j.y});o.setTarget({x:T.x,y:T.y});o.clearBends();var m=(this.aLaneWidths[F._iGroupIndex]+S)/2,n=(this.aLaneWidths[t._iGroupIndex]+S)/2,p=(this.aRowHeights[F.iRow]+f)/2,q=(this.aRowHeights[t.iRow]+f)/2;if((F._iGroupIndex===t._iGroupIndex)&&(Math.abs(F.iRow-t.iRow)===1)||(F.iRow===t.iRow)&&(Math.abs(F._iGroupIndex-t._iGroupIndex)===1)){}else if(F._iGroupIndex===t._iGroupIndex){if(this.bVertLane){o.addBend({x:j.x+m,y:j.y});o.addBend({x:T.x+n,y:T.y});}else{o.addBend({x:j.x,y:j.y+m});o.addBend({x:T.x,y:T.y+n});}}else if(F.iRow===t.iRow){var E=true,M=Math.min(F._iGroupIndex,t._iGroupIndex),r=Math.max(F._iGroupIndex,t._iGroupIndex);for(var i=M+1;i<r;i++){if(this.aGrid[i]&&this.aGrid[i].length>F.iRow){E=false;}}if(!E){if(this.bVertLane){o.addBend({x:j.x,y:j.y+p});o.addBend({x:T.x,y:T.y+q});}else{o.addBend({x:j.x+p,y:j.y});o.addBend({x:T.x+q,y:T.y});}}}else if(Math.abs(F.iRow-t.iRow)===1){if(this.bVertLane){if(F.iRow<t.iRow){o.addBend({x:j.x,y:j.y+p});o.addBend({x:T.x,y:T.y-q});}else{o.addBend({x:j.x,y:j.y-p});o.addBend({x:T.x,y:T.y+q});}}else{if(F.iRow<t.iRow){o.addBend({x:j.x+p,y:j.y});o.addBend({x:T.x-q,y:T.y});}else{o.addBend({x:j.x-p,y:j.y});o.addBend({x:T.x+q,y:T.y});}}}else if(Math.abs(F._iGroupIndex-t._iGroupIndex)===1){if(this.bVertLane){if(F._iGroupIndex<t._iGroupIndex){o.addBend({x:j.x+m,y:j.y});o.addBend({x:T.x-n,y:T.y});}else{o.addBend({x:j.x-m,y:j.y});o.addBend({x:T.x+n,y:T.y});}}else{if(F._iGroupIndex<t._iGroupIndex){o.addBend({x:j.x,y:j.y+m});o.addBend({x:T.x,y:T.y-n});}else{o.addBend({x:j.x,y:j.y-m});o.addBend({x:T.x,y:T.y+n});}}}else{var x,y;if(this.bVertLane){x=(F._iGroupIndex<t._iGroupIndex)?j.x+m:j.x-m;o.addBend({x:x,y:j.y});y=(F.iRow<t.iRow)?T.y-q:T.y+q;o.addBend({x:x,y:y});o.addBend({x:T.x,y:y});}else{y=(F._iGroupIndex<t._iGroupIndex)?j.y+m:j.y-m;o.addBend({x:j.x,y:y});x=(F.iRow<t.iRow)?T.x-q:T.x+q;o.addBend({x:x,y:y});o.addBend({x:x,y:T.y});}}var P,B;if(o.getBends().length>0){B=o.getBends()[o.getBends().length-1];P={x:B.getX(),y:B.getY()};}else{P=j;}if(T.x===P.x){if(T.y<P.y){o.setTarget({x:T.x,y:T.y+t._iHeight/2});}else{o.setTarget({x:T.x,y:T.y-t._iHeight/2});}}else{if(T.x<P.x){o.setTarget({x:T.x+t._iWidth/2,y:T.y});}else{o.setTarget({x:T.x-t._iWidth/2,y:T.y});}}};k.prototype._beautify=function(){if(this.bVertLane){this.oGraph.getGroups().forEach(function(o){o._iHeight+=c;this._shiftGraph(0,4,true);}.bind(this));}else{this._shiftGraph(c/2,0,true);}};k.prototype._findAllNipples=function(){var F,s,o,i,j,t,m,n,p,E,q,N,r;this._indexAllLineFragments();F=this.bVertLane?this.aHorizontalFragments:this.aVerticalFragments;F.forEach(function(u){s=Object.keys(this.aLaneOffsets).length-1;Object.keys(this.aLaneOffsets).forEach(function(v,I){if(I===s){return;}o=this.aLaneGroups[v];i=this.aLaneGroups[Object.keys(this.aLaneOffsets)[I+1]];if(!o.getCollapsed()&&!i.getCollapsed()){return;}j=u.line.getFromNode()._oGroup;t=u.line.getToNode()._oGroup;if(o.getCollapsed()&&i.getCollapsed()){if((j.getKey()===o.getKey()&&t.getKey()===i.getKey())||(j.getKey()===i.getKey()&&t.getKey()===o.getKey())){return;}}else{m=o.getCollapsed()?o.getKey():i.getKey();if(j.getKey()!==m&&t.getKey()!==m){return;}}n=o.getCollapsed()&&(o.getKey()===j.getKey()||o.getKey()===t.getKey());p=i.getCollapsed()&&(i.getKey()===j.getKey()||i.getKey()===t.getKey());N=undefined;E=o.getX()+o._iWidth;q=o.getY()+o._iHeight;if(this.bVertLane){if(((n&&u.c1<=E&&u.c2>E)||((p)&&u.c1<E&&u.c2>=E))&&u.cc>o.getY()&&u.cc<q){N={x:E,y:u.cc};}}else{if(((n&&u.c1<=q&&u.c2>q)||((p)&&u.c1<q&&u.c2>=q))&&u.cc>o.getX()&&u.cc<E){N={x:u.cc,y:q};}}if(N){if(n){if(this.bVertLane){r=O.LeftRight;}else{r=O.TopBottom;}}else if(p){if(this.bVertLane){r=O.RightLeft;}else{r=O.BottomTop;}}else{return;}u.line._aNipples.push({x:N.x,y:N.y,orientation:r});}}.bind(this));}.bind(this));};k.prototype._cullLineFragmentsInCollapsedGroups=function(){var F,s,i=function(o,m){return o.getX()>=m.getX()&&o.getX()<=(m.getX()+m._iWidth)&&o.getY()>=m.getY()&&o.getY()<=(m.getY()+m._iHeight);},j=function(o,r){var n=r?o.getToNode():o.getFromNode(),m=function(){return r?o.getCoordinates().length-1:0;},p;if(!n._isInCollapsedGroup()){return;}p=n._oGroup;while(o.getCoordinates().length>0&&i(o.getCoordinates()[m()],p)){F=o.getCoordinates()[m()];s=o.getCoordinates()[m()+(r?-1:1)];if(s&&!i(s,p)){if(this.bVertLane){if(s.getX()<F.getX()){F.setX(p.getX());}else{F.setX(p.getX()+p._iWidth);}}else{if(s.getY()<F.getY()){F.setY(p.getY());}else{F.setY(p.getY()+p._iHeight);}}break;}else{o.removeCoordinate(m());}}}.bind(this);this.oGraph.getLines().forEach(function(o){j(o,false);j(o,true);});};return k;});
