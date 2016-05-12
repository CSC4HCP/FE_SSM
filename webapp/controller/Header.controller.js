sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function(Controller, MessageToast) {
	"use strict";

	return Controller.extend("ssms.controller.Header", {

		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.Header
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel, "UserModel");
		},
		
		/**
		 * @function
		 * @name onHeaderSearch
		 * @description Event handler when enter some words in the search field of header.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onHeaderSearch: function(oEvent) {
		    var sQuery = oEvent.getParameter("query");
			var bClear = oEvent.getParameter("clearButtonPressed");

			if (sQuery !== "" && !bClear) {
				MessageToast.show("You are searching for " + sQuery);
			}
		}
	});

});