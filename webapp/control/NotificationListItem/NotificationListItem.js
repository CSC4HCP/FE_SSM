sap.ui.define([
	"sap/m/NotificationListItem"
], function(NotificationListItem) {
	"use strict";
	return NotificationListItem.extend("ssms.control.NotificationListItem.NotificationListItem", {
		/**
		 * @property {string} notificationId - Notification Id
		 * @property {string} notificationTarget - Notification Target
		 * @property {boolean}notificationChecked - Notification status of read/unread
		 */
		metadata: {
			properties: {
				notificationId: {
					type: "string"

				},
				notificationTarget: {
					type: "string"

				},
				notificationChecked: {
					type: "boolean"

				}
			}
		},
        /**
		 * @function
		 * @name close
		 * @description Overwrite the origin method to enable close() in JS when click the notification closeButton.
		 */
		close: function() {
			this.fireClose();
		},
		renderer: {}
	});
});