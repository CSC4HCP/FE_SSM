sap.ui.define([
	"ssms/controller/BaseController",
	"jquery.sap.global"
], function(BaseController) {
	"use strict";
	var bAll = true;
	var bUnread = false;
	return BaseController.extend("ssms.controller.test.NotificationList", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.ownSession
		 */
		onInit: function() {
			var oModelAll = new sap.ui.model.json.JSONModel();
			oModelAll.loadData("mockData/notificationList.json", null, false);
			this.byId("notificationList").setModel(oModelAll, "NotificationModel");
			var oModelUnread = new sap.ui.model.json.JSONModel();
			oModelUnread.loadData("mockData/notificationListUn.json", null, false);
			this.byId("notificationAll").setCounter(oModelAll.getData().length);
			this.byId("notificationUnread").setCounter(oModelUnread.getData().length);
			this.byId("notificationAll").addStyleClass("ssmNotificationMasterItemSelected");
		},

		onListitemPress: function(oEvent) {
			var oNotificationData = {};
			var oUnread = this.byId("notificationUnread");
			var oItem = oEvent.getSource();
			if (oItem.getPriority() === "High") {
				oUnread.setCounter(oUnread.getCounter() - 1);
				oNotificationData.id = oItem.getNotificationId();
				oNotificationData.target = oItem.getNotificationTarget();
				oNotificationData.content = oItem.getDescription();
				oNotificationData.checked = true;

				oItem.setPriority("None");
				var sNotificationId = oEvent.getSource().getNotificationId();
				$.ajax({
					async: false,
					type: "PUT",
					url: "/destinations/SSM_DEST/api/notify/" + sNotificationId,
					data: JSON.stringify(oNotificationData),
					dataType: "json",
					contentType: "application/json"
				});
			}

		},

		onPressClose: function(oEvent) {
			var oItem = oEvent.getSource();
			var oUnread = this.byId("notificationUnread");
			var oAll = this.byId("notificationAll");
			var sNotificationId = oEvent.getSource().getNotificationId();
			var reminder = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				content: new sap.m.Text({
					text: "Are you sure you want to delete this notification?"
				}),
				beginButton: new sap.m.Button({
					text: "OK",
					press: function() {
						if (oItem.getPriority() === "None") {
							oAll.setCounter(oAll.getCounter() - 1);
						} else {
							oAll.setCounter(oAll.getCounter() - 1);
							oUnread.setCounter(oUnread.getCounter() - 1);
						}
						oItem.destroy();
						$.ajax({
							url: "/destinations/SSM_DEST/api/notify/" + sNotificationId,
							type: "DELETE"
						});
						sap.m.MessageToast.show("Delete successfully");
						reminder.close();
					}

				}),
				endButton: new sap.m.Button({
					text: "Cancel",
					press: function() {
						reminder.close();
					}
				}),
				afterClose: function() {
					reminder.destroy();
				}
			});
			reminder.open();
		},

		onPrssToAllNotices: function(oEvent) {
			var that = this;

			var oItem = oEvent.getSource();
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationUnread").removeStyleClass("ssmNotificationMasterItemSelected");
			if (bAll === false) {
				that.getView().byId("notificationList").getItems().forEach(function(e) {
					e.destroy();
				});
			}
			bAll = true;
			bUnread = false;

			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/notify",
				contentType: "application/json",
				async: true,
				success: function(data) {
					that.byId("notificationAll").setCounter(data.length);
					that.getView().byId("notificationList").getModel("NotificationModel").setData(data);
				}
			});
		},

		onPressToUnreadNotices: function(oEvent) {
			var that = this;
			var oItem = oEvent.getSource();
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationAll").removeStyleClass("ssmNotificationMasterItemSelected");
			if (bUnread === false) {
				that.getView().byId("notificationList").getItems().forEach(function(oNotify) {
					oNotify.destroy();
				});

			}
			bAll = false;
			bUnread = true;
			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/notify?checked=false",
				contentType: "application/json",
				async: true,
				success: function(data) {
					that.byId("notificationUnread").setCounter(data.length);
					that.getView().byId("notificationList").getModel("NotificationModel").setData(data);
				}
			});
		}
	});

});