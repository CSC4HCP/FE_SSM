// jQuery.sap.declare("ssms.util.formatter");
sap.ui.define([
], function() {
	"use strict";

	return {
		formatVisibility: function(sValue) {
			var sResult;
			if (sValue) {
				sResult = "Public";
			} else {
				sResult = "Private";
			}
			return sResult;
		},
		
		formatDateTime: function(sValue) {
			return new Date(sValue).toLocaleString();
		},
		
		formatDate: function(sValue) {
			var dDateTime = new Date(sValue).toLocaleString();
			return dDateTime.substring(0, dDateTime.indexOf(","));
		},
		
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
		}
	};
});