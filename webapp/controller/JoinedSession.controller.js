sap.ui.define([

	"ssms/controller/BaseController", "jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"

], function(BaseController) {

	"use strict";
	/**
	 * @private
	 * @description Some specified variables of this controller. Can't be access out of this controller.
	 * @var {Array} aAllJoinSessions The array to save all sessions.
	 * @var {Array} aDocumentId The array to save open sessions.
	 * @var {Array} aDocumentId The array to save in progress sessions.
	 * @var {Array} aDocumentId The array to save cancelled sessions.
	 * @var {Array} aDocumentId The array to save completed sessions.
	 * 
	 */
	var aAllJoinSessions;
	var aOpenJoinSessions;
	var aInProgressJoinSessions;
	var aCancelledJoinSessions;
	var aCompletedJoinSessions;
	return BaseController.extend("ssms.controller.JoinedSession", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		
		* Get joined session information From joined API and get session information from session API

		* @memberOf ssms.view.view.joinedSession

		*/

		onInit: function() {

			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");
			var oJoinModel = new sap.ui.model.json.JSONModel();
			var sOwner = this.getView().getModel("UserModel").getData().name;
			oJoinModel.loadData("/destinations/SSM_DEST/api/joined?userId=" + sOwner, null, false);
			this.getView().setModel(oJoinModel, "JoinModel");
			this.byId("iconTabFilterAll").setCount(oJoinModel.getData().length);
			var oSessionModel = new sap.ui.model.json.JSONModel();
			var sSessionLenth = this.getView().getModel("JoinModel").getData().length;
			aAllJoinSessions = [];
			aOpenJoinSessions = [];
			aInProgressJoinSessions = [];
			aCancelledJoinSessions = [];
			aCompletedJoinSessions = [];
			for (var i = 0; i < sSessionLenth; i++) {
				var sSessionId = this.getView().getModel("JoinModel").getData()[i].session;

				$.ajax({

					type: "GET",

					url: "/destinations/SSM_DEST/api/session/" + sSessionId,

					contentType: "application/json",

					async: false,

					success: function(aSessions) {
						aAllJoinSessions.push(aSessions);
						switch (aSessions.status) {
							case "Open":
								aOpenJoinSessions.push(aSessions);
								break;
							case "In Progress":
								aInProgressJoinSessions.push(aSessions);
								break;
							case "Cancelled":
								aCancelledJoinSessions.push(aSessions);
								break;
							case "Completed":
								aCompletedJoinSessions.push(aSessions);
								break;
						}
					}

				});
				oSessionModel.setData(aAllJoinSessions);
			}
			this.getView().setModel(oSessionModel, "SessionModel");
		},
		/**

		* @function
	
		* @name getSessionByStatus

		* @description Session by Status and then set the Model.

		* @param {sap.ui.base.Event} - oEvent The fired event.
		
		*/

		getSessionByStatus: function(oEvent) {

			var sStatus = oEvent.getSource().mProperties.selectedKey;
			var that = this;
			if (sStatus === "All") {
				that.getView().getModel("SessionModel").setData(aAllJoinSessions);
			} else if (sStatus === "Open") {
				that.getView().getModel("SessionModel").setData(aOpenJoinSessions);
			} else if (sStatus === "In Progress") {
				that.getView().getModel("SessionModel").setData(aInProgressJoinSessions);
			} else if (sStatus === "Cancelled") {
				that.getView().getModel("SessionModel").setData(aCancelledJoinSessions);
			} else if (sStatus === "Cancelled") {
				that.getView().getModel("SessionModel").setData(aCompletedJoinSessions);
			}
		},

		/**

		* @function

		* @name onPressedColumnListItem

		* @description Event handler when click on the session. Will go to the next view.

		* @param {sap.ui.base.Event} - oEvent The fired event.

		*/

		onPressedColumnListItem: function(oEvent) {

			var sId = oEvent.getSource().getCounter();

			this.getRouter().navTo("sessionDetail", {

				id: sId

			});

		}

	});

});