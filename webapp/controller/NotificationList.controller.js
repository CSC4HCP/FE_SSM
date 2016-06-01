sap.ui.define([
	"ssms/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ssms.controller.NotificationList", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.ownSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("mockData/notificationList.json", null, false);
			this.byId("notificationList").setModel(oModel, "NotificationModel");
			var oModel1 = new sap.ui.model.json.JSONModel();
			oModel1.loadData("mockData/notificationListUn.json", null, false);
			this.byId("notificationAll").setCounter(oModel.getData().length);
			this.byId("notificationUnread").setCounter(oModel1.getData().length);
			this.byId("notificationAll").addStyleClass("ssmNotificationMasterItemSelected");
		},

		onPrssToAllNotices: function(oEvent) {
			var that=this;
			that.getView().byId("notificationList").getItems().forEach(function(e){
				e.destroy();
			});
				$.ajax({
					type: "GET",
					url: "mockData/notificationList.json",
					contentType: "application/json",
					async: false,
					success: function(data) {
				that.getView().byId("notificationList").getModel("NotificationModel").setData(data);
					}
				});
		},
		
		onPressToUnreadNotices: function(oEvent) {
			var that=this;
			that.getView().byId("notificationList").getItems().forEach(function(e){
				e.destroy();
			});
				$.ajax({
					type: "GET",
					url: "mockData/notificationListUn.json",
					contentType: "application/json",
					async: false,
					success: function(data) {
				that.getView().byId("notificationList").getModel("NotificationModel").setData(data);
					}
				});
		}
	});

});