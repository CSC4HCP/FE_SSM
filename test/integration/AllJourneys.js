jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

// We cannot provide stable mock data out of the template.
// If you introduce mock data, by adding .json files in your webapp/localService/mockdata folder you have to provide the following minimum data:
// * At least 3 Objects in the list
// * All 3 Objects have at least one LineItems

sap.ui.require([
	"sap/ui/test/Opa5",
	"test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"test/integration/pages/Home",
	"test/integration/pages/CreateSession",
	"test/integration/pages/SessionDetail",
	"test/integration/pages/PersonalCenter"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "ssms.view."
	});

	 sap.ui.require([
	     "test/integration/HomeJourney",
	     "test/integration/CreateSessionJourney",
	     "test/integration/SessionDetailJourney",
	     "test/integration/PersonalCenterJourney"
	 ], function() {
		 QUnit.start();
	 });
});