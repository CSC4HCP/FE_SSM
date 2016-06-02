sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Notification_OPA");
		opaTest("Should see the SplitContainer", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({hash: "notificationList"});

			//Actions
			When.onTheNotificationPage.iLookAtTheScreen();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeTheSplitContainer();
		});

		opaTest("Should see the Notification List", function(Given, When, Then) {
		

			//Actions
				When.onTheNotificationPage.iLookAtTheScreen();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeTheNotificationList();
		});
		
			opaTest("Should see the Masterpages", function(Given, When, Then) {
	
			//Actions
				When.onTheNotificationPage.iLookAtTheScreen();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeTheMasterPage();
		});



	
			opaTest("Should see the searchfield", function(Given, When, Then) {
	

			//Actions
			When.onTheNotificationPage.iPressTheSearchField();

			// Assertions
			Then.onTheNotificationPage.iShouldSeeTheSeachInfo();
			
			Given.iTearDownMyApp();
		});

	}
);