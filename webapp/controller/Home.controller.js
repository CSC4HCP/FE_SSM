sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.Home", {
	    _oUser: null,
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.Home
		 */
		onInit: function() {
			var oUserModel = new sap.ui.model.json.JSONModel();

			this.getView().setBusy(true);
			oUserModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oUserModel, "UserModel");
			this.getView().setBusy(false);

			this._oUser = this.getUserRole(oUserModel.getData());
			this._attachEvent();
		},
        
        /**
         * @function
         * @name getUserRole
         * @description Get user's role and team then set the _oUser.
         * @param {Object} oUserData - User information got from the userAPI
         * @return {Object} oUser - User information with all details
         */ 
		getUserRole: function(oUserData) {
			var that = this;
			var oUser;

			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/user/" + oUserData.name,
				contentType: "application/json",
				success: function(user) {
					if (!user) {
						oUser = that.createUser(oUserData);
					} else {
					    oUser = user;
					}
				}
			});
			
			return oUser;
		},
        
        /**
         * @function
         * @name createUser
         * @description Add a new user when the logined user is not in the backend database.
         * @param {Object} oUserData - User information got from the userAPI
         * @return {Object} oUser - User information with all details
         */ 
		createUser: function(oUserData) {
		    var oUser;

			$.ajax({
				type: "POST",
				url: "/destinations/SSM_DEST/api/user",
				data: JSON.stringify(oUserData),
				dataType: "json",
				contentType: "application/json",
				success: function(user) {
					oUser = user;
				}
			});
			
			return oUser;
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
		 * @event
		 * @name onExit
		 * @description Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ssms.view.Home
		 */
		onExit: function() {
			this._oUser.destroy();
		},
		
		/**
		 * @function
		 * @name _attachEvent
		 * @description Event handler when click on the box. Will go to the next view.
		 */
		_attachEvent: function() {
			var that = this;
			var oImgCreateSession = this.byId("img-createSession");
			var oImgSessionList = this.byId("img-sessionList");
			var oCreateSessionBox = this.byId("createSession");
			var oSessionListBox = this.byId("sessionList");
			
			oImgCreateSession.attachBrowserEvent("mouseup", function() {
				that.getRouter().navTo("createSession");
			});
			
			oImgSessionList.attachBrowserEvent("mouseup", function() {
				// that.getRouter().navTo("sessionList");
				MessageToast.show("Will go to the sessionList Page");
			});
			
			oCreateSessionBox.attachBrowserEvent("mouseup", function() {
				that.getRouter().navTo("createSession");
			});
			
			oSessionListBox.attachBrowserEvent("mouseup", function() {
				// that.getRouter().navTo("sessionList");
				MessageToast.show("Will go to the sessionList Page");
			});
		}
	});

});