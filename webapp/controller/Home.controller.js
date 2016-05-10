sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.Home", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.Home
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel);
		},
		/**
		 * @event
		 * @name onAfterRendering
		 * @description Called when the View has been rendered (so its HTML is part of the document). Set focus in the search field.
		 * @memberOf ssms.view.view.Home
		 */
		onAfterRendering: function() {
			var $searchInput = $("#" + this.getView().getId() + "--ssmsHome-Panel-SearchField-I");
			$searchInput.attr("autofocus", "autofocus");
		},

        /**
		 * @function
		 * @name onSearch
		 * @description Event handler when enter some words in the search field.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var bClear = oEvent.getParameter("clearButtonPressed");

			if (sQuery !== "" && !bClear) {
				MessageToast.show("You are searching for " + sQuery);
			}
		},

        /**
		 * @function
		 * @name onPressTile
		 * @description Event handler when click on the tile. Will go to the next view.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onPressTile: function(oEvent) {
			var sId = oEvent.getSource().getId();

			switch (true) {
				case sId.indexOf("createSession") > -1:
					// 	MessageToast.show("Will go to the createSession Page");
					this.getRouter().navTo("createSession");
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