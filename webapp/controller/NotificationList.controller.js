sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.NotificationList", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.Home
		 */
		onInit: function() {
			
		},
		
		/**
		 * @event
		 * @name onExit
		 * @description Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 */
		onExit: function() {
		}
	});

});