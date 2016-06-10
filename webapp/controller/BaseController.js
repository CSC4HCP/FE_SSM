/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/m/MessageToast",
	"ssms/util/formatter"
], function(Controller, History, MessageToast, formatter) {
	"use strict";

	return Controller.extend("ssms.controller.BaseController", {
		/**
		 * @var {String} Returned ID of current user
		 */
		_sUserId: "",
		/**
		 * @function
		 * @name getRouter
		 * @description Convenience method for accessing the router in every controller of the application.
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function() {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 * @function
		 * @name getModel
		 * @description Convenience method for getting the view model by name in every controller of the application.
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function(sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * @function
		 * @name setModel
		 * @description Convenience method for setting the view model in every controller of the application.
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * @function
		 * @name getResourceBundle
		 * @description Convenience method for getting the resource bundle.
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * @function
		 * @name onNavBack
		 * @description Event handler for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the master route.
		 */
		onNavBack: function() {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("home", {}, bReplace);
			}
		},
		/**
		 * @function
		 * @name getUserModel
		 * @description Get the current user and set data on model.
		 */
		getUserModel: function() {
			var oUserModel = new sap.ui.model.json.JSONModel();

			oUserModel.loadData("/services/userapi/currentUser", null, false);
			this._sUserId = oUserModel.getData().name;

			$.ajax({
				type: "GET",
				async: false,
				url: "/destinations/SSM_DEST/api/notify/" + this._sUserId,
				data: this._sUserId,
				contentType: "text/plain",
				success: function(bHaveNotificationUnread) {
					oUserModel.getData().notificationUnread = bHaveNotificationUnread;
				}
			});

			return oUserModel;
		},

		/**
		 * @function
		 * @name onPressLogo
		 * @description Event handler for press the logo on the header. Will go to the Home Page.
		 */
		onPressLogo: function() {
			this.getRouter().navTo("home");
		},

		/**
		 * @function
		 * @name onHeaderSearch
		 * @description Event handler for enter query string in the search field on the header.
		 */
		onHeaderSearch: function(oEvent) {
			var sQuery = oEvent.getParameter("query");
			var bClear = oEvent.getParameter("clearButtonPressed");

			if (sQuery !== "" && !bClear) {
				MessageToast.show("You are searching for " + sQuery);
			}
		},
		
		/**
		 * @function
		 * @name onNotification
		 * @description Event handler for press the button on the header. Will go to the NotificationList Page.
		 */
		onPressNotification: function() {
			this.getRouter().navTo("notificationList");
		},
		
		/**
		 * @function
		 * @name onNewSession
		 * @description Event handler for press the button on the header. Will go to the CreateSession Page.
		 */
		onPressNewSession: function() {
			this.getRouter().navTo("createSession");
		},

		/**
		 * @function
		 * @name onPressUser
		 * @description Event handler for press the button on the header. Will go to the PersonalCenter Page.
		 */
		onPressUser: function() {
			this.getRouter().navTo("personalCenter");
		},
		/**
		 * @function
		 * @name formatter
		 * @description Formatter function
		 */ 
		formatter: formatter
	});

});