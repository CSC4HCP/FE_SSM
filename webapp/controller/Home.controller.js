sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.Home", {
		onInit: function() {

		},
		
		onPressLogin: function() {
		    MessageToast.show("Login");
		},
		
		onSearch: function(oEvent) {
		    var sQuery = oEvent.getParameter("query");
		    var bClear = oEvent.getParameter("clearButtonPressed");
		    
		    if(sQuery !== "" && !bClear) {
		        MessageToast.show("You are searching for " + sQuery);
		    } 
		},

		onPressTile: function(oEvent) {
			var sId = oEvent.getSource().getId();

			switch (true) {
				case sId.indexOf("createSession") > -1:
					MessageToast.show("Will go to the createSession Page");
					break;
				case sId.indexOf("sessionList") > -1:
					MessageToast.show("Will go to the sessionList Page");
					break;
				default:
					break;
			}
		}
	});

});