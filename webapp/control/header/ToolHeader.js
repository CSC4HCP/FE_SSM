sap.ui.define([
	"sap/m/Toolbar",
	"sap/m/Image",
	"sap/m/SearchField",
	"sap/m/Button"
], function(Toolbar, Image, SearchField, Button) {
	"use strict";

	var designMode = sap.m.ToolbarDesign;

	return Toolbar.extend("ssms.control.header.ToolHeader", {
		metadata: {
			properties: {
				design: {
					type: "sap.m.ToolbarDesign",
					group: "Appearance",
					defaultValue: designMode.Transparent
				}
			},
			events: {
				pressLogo: {
					parameters: {
						expanded: {
							type: "boolean"
						}
					}
				}
			}
		},

		_oLogo: null,
		_oSearchField: null,
		_oButton: null,
		
		_prepareLogo: function() {
		    var oImage = new Image({
		        src: "img/logo_small.png"
		    });
		    
		    oImage.addStyleClass("sapUiSmallMarginTop");
		    oImage.addStyleClass("sapUiSmallMarginBottom");
		    oImage.addStyleClass("sapUiMediumMarginBegin");
		    
		    this.addContent(oImage);
		},
		
		_prepareSearchField: function() {
		    var oSearchField = new SearchField({
		        width: "20%",
		        placeholder: "Search Session"
		    });
		    
		    this.addContent(oSearchField);
		},

		onInit: function() {
		    this._prepareLogo();
			this._prepareSearchField();
			this._prepareButton();
		    
			this.data("sap-ui-fastnavgroup", "true", true);
			this._oContentDelegate = {
				onAfterRendering: this._onAfterContentRendering
			};
		},

		onBeforeRendering: function() {

		},

		onAfterRendering: function() {

		},

		exit: function() {

		},

		renderer: {}

	});
});