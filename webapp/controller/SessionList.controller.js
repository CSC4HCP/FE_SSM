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
	var aOpenJoinSessions;
	var aInProgressJoinSessions;
	var aCancelledJoinSessions;
	var aCompletedJoinSessions;

	return BaseController.extend("ssms.controller.SessionList", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.

		* @memberOf ssms.view.view.SessionList

		*/

		onInit: function() {

			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");
			var oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("/destinations/SSM_DEST/api/session?visibility=true", null, false);
			this.getView().setModel(oSessionModel, "SessionModel");
			this.byId("iconTabFilterAll").setCount(oSessionModel.getData().length);
			aOpenJoinSessions = [];
			aInProgressJoinSessions = [];
			aCancelledJoinSessions = [];
			aCompletedJoinSessions = [];
			$.ajax({

				type: "GET",

				url: "/destinations/SSM_DEST/api/session",

				contentType: "application/json",

				async: false,

				success: function(aSessions) {
					aSessions.forEach(function(assesion) {
						switch (assesion.status) {
							case "Open":
								aOpenJoinSessions.push(assesion);
								break;
							case "In Progress":
								aInProgressJoinSessions.push(assesion);
								break;
							case "Cancelled":
								aCancelledJoinSessions.push(assesion);
								break;
							case "Completed":
								aCompletedJoinSessions.push(assesion);
								break;
						}
					});
				}
			});
			this.byId("iconTabFilterOpen").setCount(aOpenJoinSessions.length);
			this.byId("iconTabFilterInProgress").setCount(aInProgressJoinSessions.length);
			this.byId("iconTabFilterCanceled").setCount(aCancelledJoinSessions.length);
			this.byId("iconTabFilterClosed").setCount(aCompletedJoinSessions.length);

		},

		/**

		* @function

		* @name getSessionByStatus

		* @description Session by Status and then set the Model

		* @param {sap.ui.base.Event} - oEvent The fired event.

		* @param {Object} aSessions - Session information got from the sessionAPI

		*/

		getSessionByStatus: function(oEvent) {

			var sStatus = oEvent.getSource().mProperties.selectedKey;

			var that = this;

			if (sStatus === "All") {

				$.ajax({

					type: "GET",

					url: "/destinations/SSM_DEST/api/session",

					contentType: "application/json",

					async: false,

					success: function(aSessions) {

						that.getView().getModel("SessionModel").setData(aSessions);

					}

				});

			} else {

				$.ajax({

					type: "GET",

					url: "/destinations/SSM_DEST/api/session?status=" + sStatus,

					contentType: "application/json",

					async: false,

					success: function(aSessions) {

						that.getView().getModel("SessionModel").setData(aSessions);

					}

				});

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