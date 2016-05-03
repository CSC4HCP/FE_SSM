sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.Home", {
		onInit: function() {

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