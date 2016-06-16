sap.ui.define([

	"ssms/controller/BaseController", "jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"

], function(BaseController) {

	"use strict";
	var bJoinsessions;
    var aJoinsessions;
    var cJoinsessions;
    var dJoinsessions;
    var eJoinsessions;
	return BaseController.extend("ssms.controller.JoinedSession", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.

		* @memberOf ssms.view.view.ownSession

		*/

		onInit: function() {

			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");
			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.loadData("/destinations/SSM_DEST/api/joined", null, false);
			this.getView().setModel(oModel1, "joinModel");
			this.byId("iconTabFilterAll").setCount(oModel1.getData().length);
			var oModel2 = new sap.ui.model.json.JSONModel();
			var sSessionLenth = this.getView().getModel("joinModel").getData().length;
			for (var i = 0; i < sSessionLenth; i++) {
				var sSessionId = this.getView().getModel("joinModel").getData()[i].session;

				$.ajax({

					type: "GET",

					url: "/destinations/SSM_DEST/api/session/" + sSessionId,

					contentType: "application/json",

					async: true,

					success: function(aSessions) {
						
						aJoinsessions = new Array();
						aJoinsessions.push(aSessions);
						oModel2.setData(aJoinsessions);
						if(aSessions.status === "Open"){
						 bJoinsessions = new Array();
						bJoinsessions.push(aSessions);	
						}else if(aSessions.status === "In Progress"){
						 cJoinsessions = new Array();
					 	cJoinsessions.push(aSessions);
						}else if(aSessions.status === "Cancelled"){
						dJoinsessions = new Array();
					 	dJoinsessions.push(aSessions);
						}else if(aSessions.status === "Completed"){
						 eJoinsessions = new Array();
					 	eJoinsessions.push(aSessions);
						}
					}

				});
			}
			this.getView().setModel(oModel2, "UserModel1");
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
			var _that = this;
			if (sStatus === "All") {
            _that.getView().getModel("UserModel1").setData(aJoinsessions);
			} 
			else if (sStatus === "Open") {
            _that.getView().getModel("UserModel1").setData(bJoinsessions);
			} else if (sStatus === "In Progress") {
            _that.getView().getModel("UserModel1").setData(cJoinsessions);
			} 
			else if (sStatus === "Cancelled") {
            _that.getView().getModel("UserModel1").setData(dJoinsessions);
			} 
			else if (sStatus === "Cancelled") {
            _that.getView().getModel("UserModel1").setData(eJoinsessions);
			} 
		},

		/**

		* @function

		* @name onPressedColumnListItem

		* @description Event handler when click on the session. Will go to the next view.

		* @param {sap.ui.base.Event} - oEvent The fired event.

		*/

		onPressedColumnListItem: function(oEvent) {

			var Sid = oEvent.getSource().getCounter();

			this.getRouter().navTo("sessionDetail", {

				id: Sid

			});

		}

	});

});