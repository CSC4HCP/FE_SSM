sap.ui.define([
	"sap/ui/test/Opa5"
], function(Opa5) {
	"use strict";

	function getFrameUrl(sHash, sUrlParameters) {
		sHash = sHash || "";
		var sUrl = jQuery.sap.getResourcePath("ssms/index", ".html");

		if (sUrlParameters) {
			sUrlParameters = "?" + sUrlParameters;
		}

		return sUrl + sUrlParameters + "#" + sHash;
	}

	return Opa5.extend("test.integration.pages.Common", {

		constructor: function(oConfig) {
			Opa5.apply(this, arguments);

			this._oConfig = oConfig;
		},

		iStartMyApp: function(oOptions) {
			var sUrlParameters;
			oOptions = oOptions || {
				delay: 0
			};

			sUrlParameters = "serverDelay=" + oOptions.delay;

			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
		},

		iStartTheApp: function(oOptions) {
			oOptions = oOptions || {};
			// Start the app with a minimal delay to make tests run fast but still async to discover basic timing issues
			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, "serverDelay=50"));
		},

		iStartTheAppWithDelay: function(sHash, iDelay) {
			this.iStartMyAppInAFrame(getFrameUrl(sHash, "serverDelay=" + iDelay));
		},

		iTearDownMyApp: function() {
			this.iTeardownMyAppFrame();
		},

		iLookAtTheScreen: function() {
			return this;
		}
	});
});