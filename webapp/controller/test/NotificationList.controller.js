sap.ui.define([
	"ssms/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel"
], function(BaseController, jQuery, JSONModel) {
	"use strict";
	return BaseController.extend("ssms.controller.test.NotificationList", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.NotificationList
		 */
		onInit: function() {
			var oUserModel = new JSONModel();
			oUserModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oUserModel, "UserModel");

			var oModelAll = new JSONModel();
			this.getView().setBusy(true);

			oModelAll.loadData("mockData/notificationList.json", null, false);
			this.byId("notificationListAll").setModel(oModelAll, "NotificationModelAll");

			var oModelUnread = new JSONModel();
			this.byId("notificationListUnread").setModel(oModelUnread, "NotificationModelUnread");

			this.getView().setBusy(false);
			this.getFilterData(oModelAll.getData());
			this.byId("notificationAll").setCounter(oModelAll.getData().length);
			this.byId("notificationAll").addStyleClass("ssmNotificationMasterItemSelected");
		},

		/**
		 * @function
		 * @name onListitemPress
		 * @description Event handler for changing the notification's status of checked, when click notification the checked will change to true.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onListitemPress: function(oEvent) {
			var oUnread = this.byId("notificationUnread");
			var oItem = oEvent.getSource();
			oItem.setPriority("None");
			if (!oItem.getNotificationChecked()) {
				oItem.setNotificationChecked = true;
				oUnread.setCounter(oUnread.getCounter() - 1);
			}
		},

		/**
		 * @function
		 * @name onPressClose
		 * @description Event handler for closing the notification when click the closeButton. And there is a dialog to confirm the action
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onPressClose: function(oEvent) {
			var that = this;
			var oItem = oEvent.getSource();
			var oUnread = this.byId("notificationUnread");
			var oAll = this.byId("notificationAll");

			var reminder = new sap.m.Dialog({
				title: "Confirm",
				type: "Message",
				content: new sap.m.Text({
					text: "Are you sure you want to delete this notification?"
				}),
				beginButton: new sap.m.Button({
					text: "OK",
					press: function() {
						reminder.close();

						var sId = oItem.sId.split("-")[4];
						var id = oItem.getId().split("-")[3];

						if (id === "notificationListAll") {
							var oNotification = that.byId(id).getModel("NotificationModelAll").getData();
							oNotification.splice(sId, 1);
						}
						if (oItem.getNotificationChecked()) {
							oAll.setCounter(oAll.getCounter() - 1);
						} else if (!oItem.getNotificationChecked()) {
							oAll.setCounter(oAll.getCounter() - 1);
							oUnread.setCounter(oUnread.getCounter() - 1);
						}
						oItem.destroy();
						sap.m.MessageToast.show("Deleted successfully!");
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

		/**
		 * @function
		 * @name onPrssToAllNotices
		 * @description Event handler for changing to allNotices page when I click the "All" button
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onPrssToAllNotices: function(oEvent) {
			var that = this;
			var oItem = oEvent.getSource();
			var oModelAll = new JSONModel();

			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationUnread").removeStyleClass("ssmNotificationMasterItemSelected");

			that.getSplitContObj().toDetail(that.createId("notifyPageAll"));

			oModelAll.loadData("mockData/notificationList.json", null, false);
			this.getView().setModel(oModelAll, "NotificationModelAll");

			var NotificationData = oModelAll.getData();
			that.byId("notificationAll").setCounter(NotificationData.length);
			that.getFilterData(NotificationData);

		},

		/**
		 * @function
		 * @name onPressToUnreadNotices
		 * @description Event handler for changing to unreadNotices page when I click the ""Unread" button
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onPressToUnreadNotices: function(oEvent) {
			var that = this;
			var oItem = oEvent.getSource();
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationAll").removeStyleClass("ssmNotificationMasterItemSelected");
			that.getSplitContObj().toDetail(that.createId("notifyPageUnread"));
		},

		/**
		 * @event
		 * @name onExit
		 * @description Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ssms.view.CreateSession
		 */
		onExit: function() {
			this.getView().byId("notifyPageAll").destroy();

		},

		/**
		 * @function
		 * @name getSplitContObj
		 * @description Function to find the Splitcontainer
		 */
		getSplitContObj: function() {
			var result = this.byId("notificationSplitCont");
			if (!result) {
				jQuery.sap.log.error("Notification page can't be found");
			}
			return result;
		},

		/**
		 * @function
		 * @name getFilterData
		 * @description Function to filter the unread notifications
		 * @param {object} - The data need to filter
		 */
		getFilterData: function(notificationData) {
			var that = this;
			var oModelUnread = that.getView().getModel("NotificationModelUnread");
			var unreadData = notificationData.filter(function(notify) {
				return notify.checked === false;
			});
			that.byId("notificationUnread").setCounter(unreadData.length);
			oModelUnread.setData(unreadData);

		}
	});

});