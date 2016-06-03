sap.ui.define([
	"ssms/controller/BaseController",
	"jquery.sap.global",
	"sap/ui/model/json/JSONModel"
], function(BaseController, jQuery, JSONModel) {
	"use strict";
	return BaseController.extend("ssms.controller.NotificationList", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.ownSession
		 */
		onInit: function() {
			var oUserModel = new JSONModel();
			oUserModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oUserModel, "UserModel");
			
			var sOwner = oUserModel.getData().name;
			var oModelAll = new JSONModel();
			oModelAll.loadData("/destinations/SSM_DEST/api/notify?target=" + sOwner, null, false);
			this.getView().setModel(oModelAll, "NotificationModelAll");
			
			var oModelUnread = new JSONModel();
			this.getView().setModel(oModelUnread, "NotificationModelUnread");
			this.getFilterData(oModelAll.getData());
			this.byId("notificationAll").setCounter(oModelAll.getData().length);
			this.byId("notificationUnread").setCounter(oModelUnread.getData().length);
			this.byId("notificationAll").addStyleClass("ssmNotificationMasterItemSelected");
		},

		onListitemPress: function(oEvent) {
			var oUnread = this.byId("notificationUnread");
			var oItem = oEvent.getSource();
			oItem.setPriority("None");
			if (!oItem.getNotificationChecked()) {
				var sTarget = oItem.getNotificationTarget();
				var sContent = oItem.getDescription();
				var bChecked = "true";
				var sNotificationId = oEvent.getSource().getNotificationId();
				$.ajax({
					async: false,
					type: "PUT",
					url: "/destinations/SSM_DEST/api/notify/" + sNotificationId,
					data: JSON.stringify({
						target: sTarget,
						content: sContent,
						checked: bChecked
					}),
					dataType: "json",
					contentType: "application/json",
					success: function() {
						oUnread.setCounter(oUnread.getCounter() - 1);
						oItem.setNotificationChecked(true);
					}
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
						reminder.close();
						$.ajax({
							url: "/destinations/SSM_DEST/api/notify/" + sNotificationId,
							type: "DELETE",
							success: function() {
								oItem.destroy();
								if (oItem.getNotificationChecked()) {
									oAll.setCounter(oAll.getCounter() - 1);
								} else if (!oItem.getNotificationChecked()) {
									oAll.setCounter(oAll.getCounter() - 1);
									oUnread.setCounter(oUnread.getCounter() - 1);
								}
								sap.m.MessageToast.show("Deleted successfully!");
							},
							error: function() {
								sap.m.MessageToast.show("Delete failed.");
							}
						});
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
			var oModelAll = that.getView().getModel("NotificationModelAll");
			//var notifyData = oModel.getData();
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationUnread").removeStyleClass("ssmNotificationMasterItemSelected");
			that.getSplitContObj().toDetail(that.createId("notifyPageAll"));
			var sOwner = that.getView().getModel("UserModel").getData().name;
			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/notify?target=" + sOwner,
				contentType: "application/json",
				async: true,
				success: function(data) {
					that.byId("notificationAll").setCounter(data.length);
					oModelAll.setData(data);
				    that.getFilterData(data);
				},
				error: function() {

				}
			});
		},

		onPressToUnreadNotices: function(oEvent) {
			var that = this;
			var oItem = oEvent.getSource();
			oItem.addStyleClass("ssmNotificationMasterItemSelected");
			that.byId("notificationAll").removeStyleClass("ssmNotificationMasterItemSelected");
			that.getSplitContObj().toDetail(that.createId("notifyPageUnread"));
		},

		getSplitContObj: function() {
			var result = this.byId("notificationSplitCont");
			if (!result) {
				jQuery.sap.log.error("Notification page can't be found");
			}
			return result;
		},
		
		getFilterData: function(notificationData){
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