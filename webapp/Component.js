sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"ssms/model/Model"
], function(UIComponent, Device, Model) {
	"use strict";

	return UIComponent.extend("ssms.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

            this.initLocalizationResourceModel();
            this.getRouter().initialize();
			// set the device model
			this.setModel(Model.createDeviceModel(), "device");
		},
		/**
		 * Initialize i18n Model for UI consumption.
		 * 
		 * @method
		 */
		initLocalizationResourceModel: function() {
			var oi18nModel = this.getModel("i18n");
			// set to core in order to use for fix popup
			if (oi18nModel) {
				sap.ui.getCore().setModel(oi18nModel, "i18n");
			}
		}
	});

});