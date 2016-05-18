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
        
        /**
         * @function
         * @name _getFileUploader
         * @description Overwrite the origin method to useMultipart = true
         * @return {sap.m.FileUploader} - The current file uploader
         */ 
		_getFileUploader: function() {
			var that = this,
				bInstantUpload = this.getInstantUpload();
			if (!bInstantUpload || !this._oFileUploader) {
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
					uploadOnChange: bInstantUpload,
					sameFilenameAllowed: true,
					uploadUrl: this.getUploadUrl(),
					useMultipart: true,
					sendXHR: s,
					change: function(e) {
						that._onChange(e);
					},
					filenameLengthExceed: function(e) {
						that._onFilenameLengthExceed(e);
					},
					fileSizeExceed: function(e) {
						that._onFileSizeExceed(e);
					},
					typeMissmatch: function(e) {
						that._onTypeMissmatch(e);
					},
					uploadAborted: function(e) {
						that._onUploadTerminated(e);
					},
					uploadComplete: function(e) {
						that._onUploadComplete(e);
					},
					uploadProgress: function(e) {
						if (that.getInstantUpload()) {
							that._onUploadProgress(e);
						}
					},
					uploadStart: function(e) {
						that._onUploadStart(e);
					}
				});
			}
			return this._oFileUploader;
		},

        /**
         * @function
         * @name _onCloseMessageBoxDeleteItem
         * @description Overwrite the origin name to activate fileDeleted event when set instantUpload = false
         * @param {sap.m.MessageBox.Action} - User's option for the showed MessageBox
         */
		_onCloseMessageBoxDeleteItem: function(oOption) {
			this._oItemForDelete._status = this._toBeDeletedStatus;
			if (oOption === sap.m.MessageBox.Action.OK) {
				this.fireFileDeleted({
					documentId: this._oItemForDelete.getDocumentId(),
					item: this._oItemForDelete
				});
				if (this.aItems.length === 1) {
					this.sFocusId = this._oFileUploader.$().find(":button")[0].id;
				} else {
					if (this._oItemForDelete._iLineNumber < this.aItems.length - 1) {
						this.sFocusId = this.aItems[this._oItemForDelete._iLineNumber + 1].getId() + "-cli";
					} else {
						this.sFocusId = this.aItems[0].getId() + "-cli";
					}
				}
				this._aDeletedItemForPendingUpload.push(this._oItemForDelete);
				this.aItems.splice(this._oItemForDelete._iLineNumber, 1);
				this.removeAggregation("items", this._oItemForDelete, false);
			}
		},

		renderer: "sap.m.UploadCollectionRenderer"
	});
});