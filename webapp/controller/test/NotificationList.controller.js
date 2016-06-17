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
			var oUserModel = this.getUserModel();
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
				title: "{i18n>TITLE_DIALOG}",
				type: "Message",
				content: new sap.m.Text({
					text: "{i18n>CONTENT_DIALOG}"
				}),
				beginButton: new sap.m.Button({
					text: "{i18n>BUTTON_LEFT_DIALOG}",
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
						} else{
							oAll.setCounter(oAll.getCounter() - 1);
							oUnread.setCounter(oUnread.getCounter() - 1);
						}
						oItem.destroy();
						var message = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("MESSAGE_DIALOG_SUCCESS");
						sap.m.MessageToast.show(message);
					}

				}),
				endButton: new sap.m.Button({
					text: "{i18n>BUTTON_RIFGT_DIALOG}",
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
			var iLength = that.byId("notificationAll").getCounter();
			var oModelAll = that.byId("notificationListAll").getModel("NotificationModelAll");
			oModelAll.getData().splice(0,iLength);
			oModelAll.refresh(true);
			
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationUnread").removeStyleClass("ssmNotificationMasterItemSelected");

			oModelAll.loadData("mockData/notificationList.json", null, false);
			that.byId("notificationListAll").setModel(oModelAll, "NotificationModelAll");

			that.byId("notificationAll").setCounter(oModelAll.getData().length);
			this.getFilterData(oModelAll.getData());
			that.getSplitContObj().toDetail(that.createId("notifyPageAll"));
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
			var oModelAll = that.byId("notificationListAll").getModel("NotificationModelAll");
			that.getFilterData(oModelAll.getData());
			that.getSplitContObj().toDetail(that.createId("notifyPageUnread"));
		},

		/**
		 * @function
		 * @name getSplitContObj
		 * @description Function to find the Splitcontainer
		 */
		getSplitContObj: function() {
			var result = this.byId("notificationSplitCont");
			var message = sap.ui.getCore().getModel("i18n").getResourceBundle().getText("MESSAGE_SPLIT_PAGE");
			if (!result) {
				jQuery.sap.log.error(message);
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
			var oModelUnread = that.byId("notificationListUnread").getModel("NotificationModelUnread");
			var unreadData = notificationData.filter(function(notify) {
				return notify.checked === false;
			});
			that.byId("notificationUnread").setCounter(unreadData.length);
			oModelUnread.setData(unreadData);

		}
	});

});