sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Notification_OPA");
		opaTest("Should do some test", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({hash: "notificationList"});

			//Actions
			When.onTheNotificationPage.iPressThePersonalButton();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeThePersonalInformation();
		});

		


	
			opaTest("Should see something", function(Given, When, Then) {
	

			//Actions
			When.onTheNotificationPage.iPressTheSearchField();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeTheSeachInfo();
			
			Given.iTearDownMyApp();
		});

	}
);