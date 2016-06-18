sap.ui.define([

	"ssms/controller/BaseController", "jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"

], function(BaseController) {

	"use strict";
	/**
	 * @private
	 * @description Some specified variables of this controller. Can't be access out of this controller.
	 * @var {Array} aCommentSession The array to save comment sessions.
	 * 
	 */
	var aCommentSession;
	return BaseController.extend("ssms.controller.CommentedSession", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.

		* @memberOf ssms.view.view.commentedSession

		*/

		onInit: function() {

			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");

			var oCommentModel = new sap.ui.model.json.JSONModel();
			var oSessionModel = new sap.ui.model.json.JSONModel();

			oCommentModel.loadData("/destinations/SSM_DEST/api/comment", null, false);
			this.getView().setModel(oSessionModel, "SessionModel");
			this.getView().setModel(oCommentModel, "CommentModel");
			this.getCommentByName();
			this.getSessionById();
		},
		/**

		* @function

		* @name getSessionById

		* @description Session by Id and then set the Model

		* @param {sap.ui.base.Event} - oEvent The fired event.

		* @param {Object} aSessions - Session information got from the sessionAPI

		*/

		getSessionById: function() {
			var sSessionLenth = this.getView().getModel("CommentModel").getData().length;
			var _that = this;
			aCommentSession = [];
			for (var i = 0; i < sSessionLenth; i++) {
				var sSessionId = this.getView().getModel("CommentModel").getData()[i].session;

				$.ajax({

					type: "GET",

					url: "/destinations/SSM_DEST/api/session/" + sSessionId,

					contentType: "application/json",

					async: false,

					success: function(aSessions) {

						aCommentSession.push(aSessions);
						_that.getView().getModel("SessionModel").setData(aCommentSession);
					}

				});

			}
		},

		/**

		* @function

		* @name getCommentByName

		* @description comment by anthor and then set the Model

		* @param {sap.ui.base.Event} - oEvent The fired event.

		* @param {Object} aSessions - Commnet information got from the Comment API

		*/

		getCommentByName: function() {

			var sOwner = this.getView().getModel("UserModel").getData().displayName;

			var _that = this;

			$.ajax({

				type: "GET",

				url: "/destinations/SSM_DEST/api/comment?author=" + sOwner,

				contentType: "application/json",

				async: false,

				success: function(aSessions) {

					_that.getView().getModel("CommentModel").setData(aSessions);

				}
			});

		},
		/**

		* @function

		* @name onListitemPress

		* @description Event handler when click on the session. Will go to the next view.

		* @param {sap.ui.base.Event} - oEvent The fired event.

		*/

		onListitemPress: function(oEvent) {

			var Sid = oEvent.getSource().mProperties.notificationId;

			this.getRouter().navTo("sessionDetail", {

				id: Sid

			});

		}

	});

});