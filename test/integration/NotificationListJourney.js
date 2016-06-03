sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Notification List Page");
		opaTest("Should see the Split Container", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({
				hash: "test_notificationList"
			});

			//Actions
			When.onNotificationListPage.iLookAtTheScreen();

			// Assertions
			Then.onNotificationListPage.iShouldSeeTheSplitContainer();
		});

		opaTest("Should see both the Master and Detail Page", function(Given, When, Then) {
			// Assertions
			Then.onNotificationListPage.iShouldSeeTheMasterPage()
			.and.iShouldSeeTheDetailPage();
		});
		
		opaTest("Should see 2 items in the master page and the 'All' item selected", function(Given, When, Then) {
			Then.onNotificationListPage.theMasterPageShouldHaveTwoEntries()
			.and.theAllItemsShouldBeSelected();	
		});
		
		opaTest("Should see 6 items in the detail page while 'All' item selected", function(Given, When, Then) {
			Then.onNotificationListPage.theDetailPageShouldHaveAllEntries();
		});
		
		opaTest("Should see item selected after click it", function(Give, When, Then) {
			// Actions
			When.onNotificationListPage.iPressOnItem();
			
			// Assertions
			Then.onNotificationListPage.theOtherItemShouldNotBeSelected()
			.and.theItemShouldBeSelected();
		});
	}
);