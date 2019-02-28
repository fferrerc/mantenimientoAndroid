/* global store,OData*/
sap.ui.define([
	"ABMcontactos/TGN-ABMcontactos/model/models",
	"ABMcontactos/TGN-ABMcontactos/Utils/ObjectUtils"
], function (models, ObjectUtils) {
	"use strict";
	return {
		getAttachmentSetUrl: function (sEntityPath) {
			return store.offlineServiceRoot + sEntityPath.replace(/^\/+/g, '');
		},
		/* Files in SAPUI5 are handled by Media Link Entry (MLE) containing the structured data that describes 
		   the BLOB and the Media Resource (MR) that is the BLOB itself
		*/
		getFiles: function (oUcItems) {
			var files = [];
			var fileUploaders = [];
			oUcItems.forEach(function (item) {
				if (fileUploaders.indexOf(item.getFileUploader()) < 0 && !!item.getFileUploader()) {
					fileUploaders.push(item.getFileUploader());
				}
			}.bind(this));
			fileUploaders.forEach(function (sIdFileUploader, index, theArray) {
				var domObj = jQuery.sap.domById(sIdFileUploader + "-fu");
				if (domObj.files) {
					var fuFiles = domObj.files;
					for (var i = 0; i < fuFiles.length; i++) {
						files.push(fuFiles[i]);
					}
				}
			}.bind(this));
			return files;
		},
		// To save files on the store when in offline mode.
		saveOfflineFileCollection: function (sParentNavPropertyPath, aAttachmentParamenters, files, fnSuccess, fnError) {
			var oResult = {
				iTotal: files.length,
				iUploaded: 0,
				iExecuted: 0,
				aErrorResponses: [],
				aSuccessResponses: []
			};
			for (var i = 0; i < files.length; i++) {
				var file = files[i];
				var fnItemSuccess = function (oResponse) {
					oResult.iUploaded++;
					oResult.aSuccessResponses.push(oResponse);
					oResult.iExecuted++;
					this._onLastItem(oResult, fnSuccess, fnError, files);
				}.bind(this);
				var fnItemError = function (oResponse) {
					oResult.aErrorResponses.push(oResponse);
					oResult.iExecuted++;
					this._onLastItem(oResult, fnSuccess, fnError, files);
				}.bind(this);
				this.uploadAttachment(sParentNavPropertyPath, aAttachmentParamenters, file, fnItemSuccess, fnItemError);
			}
		},
		//Upload BLOB
		uploadAttachment: function (sParentNavPropertyPath, aAttachmentParamenters, file, fnSuccess, fnError) {
			// !! Assumes media_file exists as a file input element in the DOM,
			// !! and the store variable is defined and points to the created offline OData store.
			if (!store) {
				jQuery.sap.log.error("The store must be open before it can be flushed");
				return;
			}
			var sUrl = this.getAttachmentSetUrl(sParentNavPropertyPath);

			var xhr = new XMLHttpRequest();
			var oResponse = {};

			xhr.open("POST", sUrl, true);
			xhr.setRequestHeader("Accept", "application/json");

			aAttachmentParamenters.push({
				name: "FileName",
				value: file.name
			});

			for (var i = 0; i < aAttachmentParamenters.length; i++) {
				var oAttachmentParam = aAttachmentParamenters[i];
				xhr.setRequestHeader(oAttachmentParam.name, oAttachmentParam.value);
			}

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 201) {
						var data = JSON.parse(xhr.responseText);
						var oCreatedAttachment = data.d;
						oResponse.blobStatus = xhr.status;
							oResponse.blobMessage = "Media created." + "Src: " + data.d.__metadata.media_src;
							oResponse.blobMediaSrc = data.d.__metadata.media_src;
						
						var fnUpdatePropSuccess = function(oUpdateResponse){
							oResponse = ObjectUtils.copyProperties(oUpdateResponse,oResponse);
							fnSuccess(oResponse);
						}.bind(this);
						
						var fnUpdatePropError = function(oUpdateResponse){
							oResponse = ObjectUtils.copyProperties(oUpdateResponse,oResponse);
							fnError(oResponse);
						}.bind(this);

						models.updateCreatedAttachmentProperties(oCreatedAttachment,aAttachmentParamenters,fnUpdatePropSuccess,fnUpdatePropError);
						
					} else {
						oResponse.blobStatus = xhr.status;
						oResponse.blobMessage = "Request failed! Status: " + xhr.status;
						fnError(oResponse);
					}
				}
			}.bind(this);

			xhr.send(file);

		},

		deleteAttachment: function (sAttachmentPath, fnSuccess, fnError) {
			// !! Assumes media_file exists as a file input element in the DOM,
			// !! and the store variable is defined and points to the created offline OData store.
			if (!store) {
				jQuery.sap.log.error("The store must be open before it can be flushed");
				return;
			}
			
			var sUrl = this.getAttachmentSetUrl(sAttachmentPath),
				xhr = new XMLHttpRequest();
			var sResponse = "";

			xhr.open("DELETE", sUrl, true);
			xhr.setRequestHeader("Accept", "application/json");
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4) {
					if (xhr.status === 201) {
						sResponse = "Media deleted successfully.";
						fnSuccess(sResponse);
					} else {
						sResponse = "Local delete failed! ";
						fnError(sResponse);
					}
				}
			};

			xhr.send();
		},
		_onLastItem: function (oResult, fnSuccess, fnError, items) {
			//Last item
			if (oResult.iTotal === oResult.iExecuted) {
				if (oResult.iUploaded === oResult.iExecuted) {
					fnSuccess(oResult);
				} else {
					fnError(oResult.aErrorResponses);
					this._rollbackChanges(oResult.aSuccessResponses);
				}
			}
		},
		_rollbackChanges: function (aSuccessResponses) {
			for (var i = 0; i < aSuccessResponses.length; i++) {
				var oSuccessResponse = aSuccessResponses[i];
				var fnItemSuccess = function (sResponse) {
					jQuery.sap.log.info(sResponse);
				}.bind(this);
				var fnItemError = function (sResponse) {
					jQuery.sap.log.error(sResponse);
				}.bind(this);
				if(oSuccessResponse.blobMediaSrc) this.deleteAttachment(oSuccessResponse.blobMediaSrc, fnItemSuccess, fnItemError);
				if(oSuccessResponse.mleUri) this.deleteAttachment(oSuccessResponse.mleUri, fnItemSuccess, fnItemError);
			}
		},

		getAttachmentParameters: function (oVisitDetail, oAttachmentTypeSelect, oUserAttributes) {
			var oAttachmentParameters = [{
				name: "RecipientType",
				value: oVisitDetail.RecipientType
			}, {
				name: "Extension",
				value: "png"
			}, {
				name: "RecipientId",
				value: oVisitDetail.RecipientId
			}, {
				name: "WOId",
				value: oVisitDetail.WOId
			}, {
				name: "RecipientOffice",
				value: oVisitDetail.RecipientOffice
			}, {
				name: "Classification",
				value: oAttachmentTypeSelect.getSelectedItem().getBindingContext("WorkOrderModel").getObject().Value
			}, {
				name: "UploadedBy",
				value: oUserAttributes.name
			}, {
				name: "Id",
				value: "id-" + Date.now()
			}];

			return oAttachmentParameters;
		}

	};

});