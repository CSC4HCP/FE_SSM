sap.ui.define([
	"ssms/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ssms.controller.control.AllControls", {

		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.AllControls
		 */
		onInit: function() {

		},
        
        /**
         * @function
         * @name onPressTile
         * @description Event handler for pressTile event.
         * @param {sap.ui.base.Event} - oEvent The fired event.
         */ 
		onPressTile: function(oEvent) {
			var sTileTitle = oEvent.getSource().getTitle();
			switch (true) {
				case sTileTitle === this.getResourceBundle("TITLE_CUSTOMCONTROL_UPLOADCOLLECTION"):
					this.getRouter().navTo("control_uploadCollection");
					break;
				default:
					break;
			}
		}
	});
});