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
			Then.onNotificationListPage.theSplitContainerShouldDisplay();
		});

		opaTest("Should see both the Master and Detail Page", function(Given, When, Then) {
			// Assertions
			Then.onNotificationListPage.theMasterPageShouldDisplay()
			.and.theDetailPageShouldDisplay();
		});
		
		opaTest("Should see 2 items in the master page and the 'All' item selected", function(Given, When, Then) {
			Then.onNotificationListPage.theMasterPageShouldHaveTwoEntries()
			.and.theAllItemsShouldBeSelected()
			.and.theUnreadItemsShouldBeUnselected();	
		});
		
		opaTest("Should see 6 items in the current detail page and unread notifications are marked", function(Given, When, Then) {
			Then.onNotificationListPage.theCurrentDetailPageShouldBeAllNotifications()
			.and.theDetailPageShouldHaveAllEntries()
			.and.theUnreadNotificationsShouldBeMarked();
		});
		
		opaTest("Should see read notification deleted after click the close button and confirm", function(Given, When, Then) {
			// Actions
			When.onNotificationListPage.iPressOnCloseButtonOfReadNotification()
			.and.iPressOnOKButtonInDialog();
			
			Then.onNotificationListPage.theReadNotificationShouldBeDeleted()
			.and.theCounterInAllItemShouldChange()
			.and.theCounterInUnreadItemShouldNotChange();
		});
		
		opaTest("Should see item selected and current detail page change after click it", function(Give, When, Then) {
			// Actions
			When.onNotificationListPage.iPressOnUnreadItem();
			
			// Assertions
			Then.onNotificationListPage.theOtherItemShouldNotBeSelected()
			.and.theItemShouldBeSelected()
			.and.theCurrentDetailPageShouldChange();
		});
		
		opaTest("Should see 2 items in the current detail page and unread notifications are marked", function(Given, When, Then) {
			Then.onNotificationListPage.theDetailPageShouldHaveTwoEntries()
			.and.allNotificationsShouldBeMarkedAsUnread();
		});
		
		opaTest("Should see unread notification deleted after click the close button and confirm", function(Given, When, Then) {
			// Actions
			When.onNotificationListPage.iPressOnAllItem()
			.and.iPressOnCloseButtonOfUnreadNotification()
			.and.iPressOnOKButtonInDialog();
			
			Then.onNotificationListPage.theUnreadNotificationShouldBeDeleted()
			.and.theCounterInAllItemShouldChangeWhenDeleteUnread();
		});
		
		opaTest("Should see the counter of 'Unread' item change after click it", function(Given, When, Then) {
			// Actions
			When.onNotificationListPage.iPressOnUnreadItem();
			
			Then.onNotificationListPage.theCounterInUnreadItemShouldChangeWhenDeleteUnread();
			
			Given.iTearDownMyApp();
		});
	}
);