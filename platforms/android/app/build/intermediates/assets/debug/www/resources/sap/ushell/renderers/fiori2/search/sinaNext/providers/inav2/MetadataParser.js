sinaDefine(['../../core/core','./pivotTableParser','./typeConverter'],function(c,p,t){"use strict";return c.defineClass({_init:function(a){this.provider=a;this.sina=a.sina;},normalizeAttributeMetadata:function(a){a.IsKey=a.isKey;},parseRequestAttributes:function(d,a){var b=a.Cube.Dimensions;var f=[];for(var i=0;i<b.length;++i){var e=b[i];if(e.Name.slice(0,2)==='$$'){continue;}var g=e.Attributes[0];this.normalizeAttributeMetadata(g);f.push(g);}this.provider.fillInternalMetadata(d,'metadataRequest',f);},parseResponseAttributes:function(d,a){var f=[];var b=a.Cube.Dimensions[0].Attributes;for(var i=0;i<b.length;++i){var e=b[i];if(e.Name.slice(0,2)==='$$'){continue;}this.normalizeAttributeMetadata(e);f.push(e);}this.provider.fillInternalMetadata(d,'metadataRequest',f);},parseMetadataRequestMetadata:function(d,a){var m=this.provider.getInternalMetadataLoadStatus(d);if(m.metadataRequest){return;}this.parseRequestAttributes(d,a);this.parseResponseAttributes(d,a);this.fillPublicMetadataBuffer(d);},parseSearchRequestMetadata:function(i){var d=this.sina.getDataSource(i.$$DataSourceMetaData$$[0].ObjectName);var m=this.provider.getInternalMetadataLoadStatus(d);if(m.searchRequest){return;}this.provider.fillInternalMetadata(d,'searchRequest',i.$$AttributeMetadata$$);this.fillPublicMetadataBuffer(d);this.calculateAttributeDisplayOrder(d,i);},fillPublicMetadataBuffer:function(d){d.attributesMetadata=[];d.attributeMetadataMap={};var a=this.provider.getInternalMetadataAttributes(d);for(var i=0;i<a.length;++i){var b=a[i];var e=this.sina._createAttributeMetadata({type:this.parseAttributeType(b),id:b.Name,label:b.Description,isSortable:this.parseIsSortable(b),isKey:b.IsKey,matchingStrategy:this.parseMatchingStrategy(b),usage:this.parseUsage(b)});d.attributesMetadata.push(e);d.attributeMetadataMap[b.Name]=e;}d._configure();},calculateAttributeDisplayOrder:function(d,a){var b,e,i;var f=[];var g=[];var h=[];var k=[];for(var j=0;j<a.$$ResultItemAttributes$$.length;++j){var l=a.$$ResultItemAttributes$$[j];var m=this.provider.getInternalMetadataAttribute(d,l.Name);if(m.presentationUsage.indexOf('Title')>=0||m.IsTitle){f.push(l.Name);}if(m.presentationUsage.indexOf('Summary')>=0||m.presentationUsage.indexOf('Image')>=0||m.presentationUsage.indexOf('Thumbnail')>=0){g.push(l.Name);}else if(m.presentationUsage.indexOf('Detail')>=0){h.push(l.Name);}}for(i=0;i<f.length;++i){b=f[i];e=d.getAttributeMetadata(b);e.usage.Title.displayOrder=i;}k.push.apply(k,g);k.push.apply(k,h);for(i=0;i<k.length;++i){b=k[i];e=d.getAttributeMetadata(b);e.usage.Detail.displayOrder=i;}},parseIsSortable:function(a){if(typeof a.IsSortable==='undefined'){return false;}return a.IsSortable;},parseMatchingStrategy:function(a){if(a.hasFulltextIndex){return this.sina.MatchingStrategy.Text;}else{return this.sina.MatchingStrategy.Exact;}},parseUsage:function(a){var u={};if(a.presentationUsage.indexOf('Title')>=0||a.IsTitle){u.Title={displayOrder:0};}if(a.presentationUsage.indexOf('Summary')>=0||a.presentationUsage.indexOf('Image')>=0||a.presentationUsage.indexOf('Thumbnail')>=0||a.presentationUsage.indexOf('Detail')>=0){u.Detail={displayOrder:0};}if(a.accessUsage.indexOf('AutoFacet')>=0||a.accessUsage.indexOf('AdvancedSearch')>=0){u.AdvancedSearch={displayOrder:0};u.Facet={displayOrder:0};}return u;},parseAttributeType:function(a){for(var i=0;i<a.presentationUsage.length;i++){var b=a.presentationUsage[i];switch(b){case'Summary':continue;case'Detail':continue;case'Title':continue;case'Hidden':continue;case'FactSheet':continue;case'Thumbnail':case'Image':return this.sina.AttributeType.ImageUrl;case'Text':return this.sina.AttributeType.Longtext;default:throw new c.Exception('Unknown presentation usage '+b);}}switch(a.DataType){case'Integer':case'Long':return this.sina.AttributeType.Integer;case'Double':return this.sina.AttributeType.Double;case'String':return this.sina.AttributeType.String;case'Date':return this.sina.AttributeType.Date;case'Time':return this.sina.AttributeType.Time;case'Timestamp':return this.sina.AttributeType.Timestamp;case'GeoJson':return this.sina.AttributeType.GeoJson;default:throw new c.Exception('Unknown data type '+a.DataType);}}});});