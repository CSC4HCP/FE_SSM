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
		}
	};
});