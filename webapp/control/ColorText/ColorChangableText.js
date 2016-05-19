sap.ui.define([
	"sap/m/Text",
	"sap/m/TextRenderer"
], function(Text, TextRenderer) {
	"use strict";
	return Text.extend("ssms.control.ColorText.ColorChangableText", {
		metadata: {},

		renderer: function(oRM, oControl) {

			var sColor = oControl.getText();
			switch (sColor) {
				case "Open":
					oRM.addClass("ssmsYellowFontEva");
					break;
				case "In Progress":
					oRM.addClass("ssmsGreenFontEva");
					break;
				case "Closed":
					oRM.addClass("ssmsGrayFontEva");
					break;
				case "Cancelled":
					oRM.addClass("ssmsRedFontEva");
					break;
			}
			TextRenderer.render(oRM, oControl);
		}
	});
});