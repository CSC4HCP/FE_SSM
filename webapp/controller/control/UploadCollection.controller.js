sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.control.UploadCollection", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.controls.view.UploadCollection
		 */
		onInit: function() {

		},

		/**
		 * @function
		 * @name onFileChange
		 * @description Event handler for change event
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onFileChange: function(oEvent) {
			var oSource = oEvent.getSource();

			MessageToast.show("Event 'change' of " + oSource + "has been triggered.");
		},

		/**
		 * @function
		 * @name onFileDelete
		 * @description Event handler for fileDeleted event
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onFileDelete: function(oEvent) {
			var oSource = oEvent.getSource();

			MessageToast.show("Event 'fileDeleted' of " + oSource + "has been triggered.");
		},

		onPressUploadButton: function() {
		  //  var oUploadCollection = this.byId("ssmsuploadCollection");
		    
// 			oUploadCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/1");
// 			oUploadCollection.upload();
		}
	});

});