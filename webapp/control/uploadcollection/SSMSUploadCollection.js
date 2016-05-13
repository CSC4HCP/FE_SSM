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

		renderer: "sap.m.UploadCollectionRenderer"
	});
});