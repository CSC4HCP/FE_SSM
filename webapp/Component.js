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

            this.getRouter().initialize();
			// set the device model
			this.setModel(Model.createDeviceModel(), "device");
		}
	});

});