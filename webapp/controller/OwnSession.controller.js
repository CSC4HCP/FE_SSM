sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	'sap/ui/model/Filter',
	'sap/ui/model/json/JSONModel'
], function(BaseController, MessageToast, jQuery, Controller, Filter, JSONModel) {
	"use strict";

	return BaseController.extend("ssms.controller.OwnSession", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.ownSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");
			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.loadData("/destinations/SSM_DEST/api/session", null, false);
			this.getView().setModel(oModel1, "UserModel1");
            this.byId("iconTabFilterAll").setCount(oModel1.getData().length);
             
            
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
				$.ajax({
					type: "GET",
					url: "/destinations/SSM_DEST/api/session",
					contentType: "application/json",
					async: true,
					success: function(aSessions) {
						_that.getView().getModel("UserModel1").setData(aSessions);
					}
				});
			} else {
				$.ajax({
					type: "GET",
					url: "/destinations/SSM_DEST/api/session/?status=" + sStatus,
					contentType: "application/json",
					async: true,
					success: function(aSessions) {
						_that.getView().getModel("UserModel1").setData(aSessions);
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
		onPressedColumnListItem:function(oEvent) {
		    var Sid = oEvent.getSource().getCounter();
			this.getRouter().navTo("sessionDetail", {
				id: Sid
			});
		}
	});

});