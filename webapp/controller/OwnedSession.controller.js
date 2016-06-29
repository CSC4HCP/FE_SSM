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
	var aPaginatorSessions;
	var aAllSessions;
	var sessionNumberPerPage;

	return BaseController.extend("ssms.controller.OwnedSession", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.

		* @memberOf ssms.view.view.ownSession

		*/

		onInit: function() {

			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");
			sessionNumberPerPage = 2;
			var oSessionModel = new sap.ui.model.json.JSONModel();
			var sOwner = this.getView().getModel("UserModel").getData().displayName;

			oSessionModel.loadData("/destinations/SSM_DEST/api/session?owner=" + sOwner, null, false);

			this.getView().setModel(oSessionModel, "SessionModel");
			aOpenJoinSessions = [];
			aInProgressJoinSessions = [];
			aCancelledJoinSessions = [];
			aCompletedJoinSessions = [];
			aPaginatorSessions = [];
			aAllSessions = [];
			aAllSessions = oSessionModel.getData();
			this.byId("ownSessionPaginator").setNumberOfPages(Math.ceil(aAllSessions.length / sessionNumberPerPage));
			this.byId("iconTabFilterAll").setCount(oSessionModel.getData().length);
			$.ajax({

				type: "GET",

				url: "/destinations/SSM_DEST/api/session?owner=" + sOwner,

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
			if (aAllSessions.length >= sessionNumberPerPage) {
					for (var i = 0; i < sessionNumberPerPage; i++) {
						aPaginatorSessions.push(aAllSessions[i]);
					}
				} else {
					for (var j = 0; j < aAllSessions.length; j++) {
						aPaginatorSessions.push(aAllSessions[j]);
					}
				}
				oSessionModel.setData(aPaginatorSessions);
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

			var oSessionModel = that.getView().getModel("SessionModel");

			var oPaginator = this.byId("ownSessionPaginator");
			oPaginator.setCurrentPage(1);
			if (sStatus === "All") {

				oPaginator.setNumberOfPages(Math.ceil(aAllSessions.length / sessionNumberPerPage));
				aPaginatorSessions = [];

				if (aAllSessions.length >= sessionNumberPerPage) {
					for (var i = 0; i < sessionNumberPerPage; i++) {
						aPaginatorSessions.push(aAllSessions[i]);
					}
				} else {
					for (var j = 0; j < aAllSessions.length; j++) {
						aPaginatorSessions.push(aAllSessions[j]);
					}
				}
				oSessionModel.setData(aPaginatorSessions);

			} else {

				switch (sStatus) {
					case "Open":
						oSessionModel.setData(aOpenJoinSessions);
						oPaginator.setNumberOfPages(Math.ceil(aOpenJoinSessions.length / sessionNumberPerPage));
						aPaginatorSessions = [];
						if (aOpenJoinSessions.length >= sessionNumberPerPage) {
							for (var k = 0; k < sessionNumberPerPage; k++) {
								aPaginatorSessions.push(aOpenJoinSessions[k]);
							}
						} else {
							for (var m = 0; m < aOpenJoinSessions.length; m++) {
								aPaginatorSessions.push(aOpenJoinSessions[m]);
							}
						}
						oSessionModel.setData(aPaginatorSessions);
						break;
					case "In Progress":
						oSessionModel.setData(aInProgressJoinSessions);
						oPaginator.setNumberOfPages(Math.ceil(aInProgressJoinSessions.length / sessionNumberPerPage));
						aPaginatorSessions = [];
						if (aInProgressJoinSessions.length >= sessionNumberPerPage) {
							for (var n = 0; n < sessionNumberPerPage; n++) {
								aPaginatorSessions.push(aInProgressJoinSessions[n]);
							}
						} else {
							for (var l = 0; l < aInProgressJoinSessions.length; l++) {
								aPaginatorSessions.push(aInProgressJoinSessions[l]);
							}
						}
						oSessionModel.setData(aPaginatorSessions);
						break;
					case "Cancelled":
						oSessionModel.setData(aCancelledJoinSessions);
						oPaginator.setNumberOfPages(Math.ceil(aCancelledJoinSessions.length / sessionNumberPerPage));
						aPaginatorSessions = [];
						if (aCancelledJoinSessions.length >= sessionNumberPerPage) {
							for (var p = 0; p < sessionNumberPerPage; p++) {
								aPaginatorSessions.push(aCancelledJoinSessions[p]);
							}
						} else {
							for (var q = 0; q < aCancelledJoinSessions.length; q++) {
								aPaginatorSessions.push(aCancelledJoinSessions[q]);
							}
						}
						oSessionModel.setData(aPaginatorSessions);
						break;
					case "Completed":
						oSessionModel.setData(aCompletedJoinSessions);
						oPaginator.setNumberOfPages(Math.ceil(aCompletedJoinSessions.length / sessionNumberPerPage));
						aPaginatorSessions = [];
						if (aCompletedJoinSessions.length >= sessionNumberPerPage) {
							for (var r = 0; r < sessionNumberPerPage; r++) {
								aPaginatorSessions.push(aCompletedJoinSessions[r]);
							}
						} else {
							for (var s = 0; s < aCompletedJoinSessions.length; s++) {
								aPaginatorSessions.push(aCompletedJoinSessions[s]);
							}
						}
						break;
				}
			}

		},
		onPressedPage: function(oEvent) {
			var oSessionModel = this.getView().getModel("SessionModel");
			var sStatus = this.byId("ssms-IconTabBar").getSelectedKey();
			sessionNumberPerPage = 2;
			var oIndex = oEvent.getSource().getCurrentPage();
			var sNumberOfPages = this.byId("ownSessionPaginator").getNumberOfPages();
			aPaginatorSessions = [];

			switch (sStatus) {
				case "All":

					if (oIndex !== sNumberOfPages) {
						for (var i = 0; i < sessionNumberPerPage; i++) {

							aPaginatorSessions.push(aAllSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + i]);
						}
					} else {
						for (var j = 0; j < aAllSessions.length - (sNumberOfPages - 1) * sessionNumberPerPage; j++) {

							aPaginatorSessions.push(aAllSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + j]);
						}
					}
					break;
				case "Open":

					if (oIndex !== sNumberOfPages) {
						for (var i1 = 0; i1 < sessionNumberPerPage; i1++) {

							aPaginatorSessions.push(aOpenJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + i1]);
						}
					} else {
						for (var j1 = 0; j1 < aOpenJoinSessions.length - (sNumberOfPages - 1) * sessionNumberPerPage; j1++) {

							aPaginatorSessions.push(aOpenJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + j1]);
						}
					}
					break;
				case "In Progress":
					if (oIndex !== sNumberOfPages) {
						for (var i2 = 0; i2 < sessionNumberPerPage; i2++) {

							aPaginatorSessions.push(aInProgressJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + i2]);
						}
					} else {
						for (var j2 = 0; j2 < aInProgressJoinSessions.length - (sNumberOfPages - 1) * sessionNumberPerPage; j2++) {

							aPaginatorSessions.push(aInProgressJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + j2]);
						}
					}
					break;
				case "Cancelled":
					if (oIndex !== sNumberOfPages) {
						for (var i3 = 0; i3 < sessionNumberPerPage; i3++) {

							aPaginatorSessions.push(aCancelledJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + i3]);
						}
					} else {
						for (var j3 = 0; j3 < aCancelledJoinSessions.length - (sNumberOfPages - 1) * sessionNumberPerPage; j3++) {

							aPaginatorSessions.push(aCancelledJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + j3]);
						}
					}
					break;
				case "Completed":
					if (oIndex !== sNumberOfPages) {
						for (var i4 = 0; i4 < sessionNumberPerPage; i4++) {

							aPaginatorSessions.push(aCompletedJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + i4]);
						}
					} else {
						for (var j4 = 0; j4 < aCompletedJoinSessions.length - (sNumberOfPages - 1) * sessionNumberPerPage; j4++) {

							aPaginatorSessions.push(aCompletedJoinSessions[oIndex * sessionNumberPerPage - sessionNumberPerPage + j4]);
						}
					}
					break;
			}
			oSessionModel.setData(aPaginatorSessions);
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