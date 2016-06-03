sap.ui.define([], function() {
	"use strict";

	return {
		/**
		 * @function
		 * @name formatVisibility
		 * @description The function use to format the visibility.
		 * @param {String} sValue -The value need to format
		 * @return {String} -Fomattered result
		 */
		formatVisibility: function(sValue) {
			var sResult;
			if (sValue) {
				sResult = "Public";
			} else {
				sResult = "Private";
			}
			return sResult;
		},

		/**
		 * @function
		 * @name formatDateTime
		 * @description The function use to format the date and time in detail page.
		 * @param {String} sValue -The value need to format.
		 * @return {String} -Fomattered result.
		 */
		formatDateTime: function(sValue) {
			return new Date(sValue).toLocaleString();
		},

		/**
		 * @function
		 * @name formatDate
		 * @description The function use to format the date in edit page.
		 * @param {String} sValue -The value need to format.
		 * @return {String} -Fomattered result.
		 */
		formatDate: function(sValue) {
			var dDateTime = new Date(sValue).toLocaleString();
			return dDateTime.substring(0, dDateTime.indexOf(","));
		},

		/**
		 * @function
		 * @name formatTime
		 * @description The function use to format the time in edit page.
		 * @param {String} sValue -The value need to format.
		 * @return {String} -Fomattered result.
		 */
		formatTime: function(sValue) {
			var dDateTime = new Date(sValue).toLocaleString();
			return dDateTime.substring(dDateTime.indexOf(",") + 2);
		},

		/**
		 * @function
		 * @name getReadIconVisibility
		 * @description the function use to format the visibility of readIcon
		 * @param {Boolean} bValue the value need to format
		 * @return {Boolean} fomattered result
		 */
		getReadIconVisibility: function(bValue) {
			return !bValue;
		},

		/**
		 * @function
		 * @name getUnreadIconVisibility
		 * @description the function use to format the visibility of unreadIcon
		 * @param {Boolean} bValue the value need to format
		 * @return {Boolean} fomattered result
		 */
		getUnreadIconVisibility: function(bValue) {
			return bValue;
		},

		formatRead: function(bChecked) {
			var sResult;
			if (bChecked) {
				sResult = "None";
			} else {
				sResult = "High";
			}
			return sResult;
		},
		/**
		 * @function
		 * @name formatStatusToColor
		 * @description The function use to format the session status to change it's text.
		 * @param {String} sValue -The status
		 * @return {String} -state
		 */
		formatStatusToColor: function(sValue) {
			switch (sValue) {
				case "Open":
					return "None";
				case "In Progress":
					return "Success";
				case "Closed":
					return "Error";
				case "Cancelled":
					return "Warning";
			}
		}

	};
});