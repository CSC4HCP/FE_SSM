sap.ui.define([
	"sap/m/UploadCollection"
], function(UploadCollection) {
	"use strict";

	return UploadCollection.extend("ssms.control.uploadcollection.SSMSUploadCollection", {
		metadata: {},

		/**
		 * @function
		 * @name setUploadUrl
		 * @description Overwrite the origin method to enable setUploadUrl() in JS when instantUpload = false.
		 * @param {String} value - The uploadUrl to be set
		 */
		setUploadUrl: function(value) {
			this.setProperty("instantUpload", true, true); // disables the default check
			if (sap.m.UploadCollection.prototype.setUploadUrl) {
				sap.m.UploadCollection.prototype.setUploadUrl.apply(this, arguments);
			}
			this.setProperty("instantUpload", false, true); // Afterwords set back the instantUpload property to be back in a save and consistent state 
		},

		/**
		 * @function
		 * @name upload
		 * @description Overwrite the origin method to set the uploadUrl of every fileUploader in the UploadCollection
		 */
		upload: function() {
			if (this.getInstantUpload()) {
				jQuery.sap.log.error("Not a valid API call. 'instantUpload' should be set to 'false'.");
			}
			for (var j = 0; j < this._aFileUploadersForPendingUpload.length; j++) {
				this._iUploadStartCallCounter = 0;
				this._aFileUploadersForPendingUpload[j].setUploadUrl(this.getUploadUrl());
				this._aFileUploadersForPendingUpload[j].upload();
			}
		},

		_getFileUploader: function() {
			var t = this,
				u = this.getInstantUpload();
			if (!u || !this._oFileUploader) {
				var s = (sap.ui.Device.browser.msie && sap.ui.Device.browser.version <= 9) ? false : true;
				this._iFUCounter = this._iFUCounter + 1;
				this._oFileUploader = new sap.ui.unified.FileUploader(this.getId() + "-" + this._iFUCounter + "-uploader", {
					buttonOnly: true,
					buttonText: " ",
					tooltip: this.getInstantUpload() ? this._oRb.getText("UPLOADCOLLECTION_UPLOAD") : this._oRb.getText("UPLOADCOLLECTION_ADD"),
					iconOnly: true,
					enabled: this.getUploadEnabled(),
					fileType: this.getFileType(),
					icon: "sap-icon://add",
					iconFirst: false,
					style: "Transparent",
					maximumFilenameLength: this.getMaximumFilenameLength(),
					maximumFileSize: this.getMaximumFileSize(),
					mimeType: this.getMimeType(),
					multiple: this.getMultiple(),
					name: "uploadCollection",
					uploadOnChange: u,
					sameFilenameAllowed: true,
					uploadUrl: this.getUploadUrl(),
					useMultipart: true,
					sendXHR: s,
					change: function(e) {
						t._onChange(e);
					},
					filenameLengthExceed: function(e) {
						t._onFilenameLengthExceed(e);
					},
					fileSizeExceed: function(e) {
						t._onFileSizeExceed(e);
					},
					typeMissmatch: function(e) {
						t._onTypeMissmatch(e);
					},
					uploadAborted: function(e) {
						t._onUploadTerminated(e);
					},
					uploadComplete: function(e) {
						t._onUploadComplete(e);
					},
					uploadProgress: function(e) {
						if (t.getInstantUpload()) {
							t._onUploadProgress(e);
						}
					},
					uploadStart: function(e) {
						t._onUploadStart(e);
					}
				});
			}
			return this._oFileUploader;
		},

		_onCloseMessageBoxDeleteItem: function(A) {
			this._oItemForDelete._status = this._toBeDeletedStatus;
			if (A === sap.m.MessageBox.Action.OK) {
				this.fireFileDeleted({
					documentId: this._oItemForDelete.getDocumentId(),
					item: this._oItemForDelete
				});
				if (this.aItems.length === 1) {
					this.sFocusId = this._oFileUploader.$().find(':button')[0].id;
				} else {
					if (this._oItemForDelete._iLineNumber < this.aItems.length - 1) {
						this.sFocusId = this.aItems[this._oItemForDelete._iLineNumber + 1].getId() + '-cli';
					} else {
						this.sFocusId = this.aItems[0].getId() + '-cli';
					}
				}
				this._aDeletedItemForPendingUpload.push(this._oItemForDelete);
				this.aItems.splice(this._oItemForDelete._iLineNumber, 1);
				this.removeAggregation('items', this._oItemForDelete, false);
			}
		},

		renderer: "sap.m.UploadCollectionRenderer"
	});
});