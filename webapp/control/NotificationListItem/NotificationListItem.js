sap.ui.define([
	"sap/m/NotificationListItem"
], function(NotificationListItem) {
	"use strict";
	return NotificationListItem.extend("ssms.control.NotificationListItem.NotificationListItem", {
		metadata: {
			properties : {
			notificationId : {type : "string"},
			notificationTarget : {type : "string"},
			notificationChecked: {type: "boolean"}
		}
		},
		close: function() {
			this.fireClose();
		},
		renderer: {}
	});
});