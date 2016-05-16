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
					console.log(oUser);
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
		 * @event
		 * @name onAfterRendering
		 * @description Called when the View has been rendered (so its HTML is part of the document). Set focus in the search field.
		 * @memberOf ssms.view.Home
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
				    // this.getRouter().navTo("personalCenter");
					break;
				default:
					break;
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
		}
	});

});