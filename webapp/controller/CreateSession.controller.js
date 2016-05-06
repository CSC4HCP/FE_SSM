sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.CreateSession", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel);
		},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf ssms.view.view.createSession
		 */
// 		onAfterRendering: function() {
// 			var oTopicInput = this.byId("topic");
// 			oTopicInput.focus();
// 		},

		onHeaderSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var bClear = oEvent.getParameter("clearButtonPressed");

			if (sQuery !== "" && !bClear) {
				MessageToast.show("You are searching for " + sQuery);
			}
		},
		
		onCheckTopic: function(oEvent) {
		    var oTopicInput = oEvent.getSource();
		    var value = oTopicInput.getValue();
		    
		    if(value === "") {
		        MessageToast.show("Please enter a topic");
		    }
		},
		
		onBack: function() {
		    this.getRouter().navTo("home");
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf ssms.view.view.createSession
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ssms.view.view.createSession
		 */
		//	onExit: function() {
		//
		//	}

	});

});