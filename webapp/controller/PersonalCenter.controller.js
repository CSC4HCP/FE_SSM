sap.ui.define([
	"ssms/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ssms.controller.PersonalCenter", {
		_oUser: null,
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.PersonalCenter
		 */
		onInit: function() {
			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");

			this._oUser = this.getUserRole(oUserModel.getData());
			var oInfoModel = new sap.ui.model.json.JSONModel();
			oInfoModel.setData(this._oUser, null, false);
			this.getView().setModel(oInfoModel, "InfoModel");
		},

		/**
		 * @function
		 * @name getUserRole
		 * @description Get user's role and team then set the _oUser.
		 * @param {Object} oUserData - User information got from the userAPI
		 * @return {Object} oUser - User information with all details
		 */
		getUserRole: function(oUserData) {
			var _this = this;
			var oUser;

			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/user/" + oUserData.name,
				contentType: "application/json",
				async: false,
				success: function(user) {
					if (!user) {
						oUser = _this.createUser(oUserData);
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
				case sId.indexOf("joinedSession") > -1:
					this.getRouter().navTo("joinedSession");
					break;
				case sId.indexOf("ownedSession") > -1:
					this.getRouter().navTo("ownedSession");
					break;
				case sId.indexOf("commentedSession") > -1:
					this.getRouter().navTo("commentedSession");
					break;
				default:
					break;
			}
		}

	});

});