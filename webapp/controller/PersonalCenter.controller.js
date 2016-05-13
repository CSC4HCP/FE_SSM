sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.PersonalCenter", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.Home
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");
			var sUserId = oModel.getData().name;
			console.log(sUserId);

			this._oUser = this.getUserRole(oModel.getData());

			var oTextRole = this.getView().byId("ssms-role");
			oTextRole.setText(this._oUser.role);
			var oTextTeam = this.getView().byId("ssms-team");
			oTextTeam.setText(this._oUser.team);
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
				async: false,
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
				async: false,
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
		 * @name onPressTile
		 * @description Event handler when click on the tile. Will go to the next view.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onPressTile: function(oEvent) {
			var sId = oEvent.getSource().getId();

			switch (true) {
				case sId.indexOf("createSession") > -1:
					this.getRouter().navTo("createSession");
					break;
				case sId.indexOf("joinSession") > -1:
					MessageToast.show("Will go to the joinSession Page");
					break;
				case sId.indexOf("ownSession") > -1:
					MessageToast.show("Will go to the ownSession Page");
					break;
				case sId.indexOf("commentSession") > -1:
					MessageToast.show("Will go to the ownSession Page");
					break;
				default:
					break;
			}
		}

	});

});