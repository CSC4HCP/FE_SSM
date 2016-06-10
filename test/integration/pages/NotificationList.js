sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"test/integration/pages/Common"
	],
	function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
		"use strict";

		var sViewName = "test.NotificationList";
		var sAllItemId = "notificationAll";
		var sUnreadItemId = "notificationUnread";
		var sAllPageId = "notifyPageAll";
		var sUnreadPageId = "notifyPageUnread";
		var sOptionListId = "optionList";
		var sAllListId = "notificationListAll";
		var sUnreadListId = "notificationListUnread";

		Opa5.createPageObjects({
			onNotificationListPage: {
				baseClass: Common,
				actions: {
					iPressOnCloseButtonOfReadNotification: function() {
						return this.waitFor({
							controlType: "ssms.control.NotificationListItem.NotificationListItem",
							viewName: sViewName,
							success: function(aItems) {
								var $closeButton = aItems[0].$().children("button");
								$closeButton.trigger("tap");
							},
							errorMessage: "Can not find the read notification."
						});
					},

					iPressOnOKButtonInDialog: function() {
						return this.waitFor({
							searchOpenDialogs: true,
							controlType: "sap.m.Button",
							success: function(aButtons) {
								var $okButton = aButtons[0].$();
								$okButton.trigger("tap");
							},
							errorMessage: "Did not find the OK button in the dialog."
						});
					},

					iPressOnUnreadItem: function() {
						return this.waitFor({
							id: sUnreadItemId,
							viewName: sViewName,
							success: function(oItem) {
								oItem.$().trigger("tap");
							},
							errorMessage: "Can not find the 'Unread' item."
						});
					},
					
					iPressOnAllItem: function() {
						return this.waitFor({
							id: sAllItemId,
							viewName: sViewName,
							success: function(oItem) {
								oItem.$().trigger("tap");
							},
							errorMessage: "Can not find the 'All' item."
						});
					},
					
					iPressOnCloseButtonOfUnreadNotification: function() {
						return this.waitFor({
							controlType: "ssms.control.NotificationListItem.NotificationListItem",
							viewName: sViewName,
							check: function(aItems) {
								return aItems.length === 6;	
							},
							success: function(aItems) {
								var $closeButton = aItems[2].$().children("button");
								$closeButton.trigger("tap");
							},
							errorMessage: "Can not find the unread notification."
						});
					}
				},
				assertions: {
					theSplitContainerShouldDisplay: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							success: function() {
								Opa5.assert.ok(true, "Split Container was there.");
							},
							errorMessage: "Did not find the split container."
						});
					},

					theMasterPageShouldDisplay: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "masterPages",
								length: 1
							}),
							success: function() {
								Opa5.assert.ok(true, "Only 1 Master page was there.");
							},
							errorMessage: "Did not find the master page."
						});
					},

					theDetailPageShouldDisplay: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							matchers: new AggregationLengthEquals({
								name: "detailPages",
								length: 2
							}),
							success: function() {
								Opa5.assert.ok(true, "Two pages were in the detail page.");
							},
							errorMessage: "Did not find the detail page."
						});
					},

					theMasterPageShouldHaveTwoEntries: function() {
						return this.waitFor({
							id: sOptionListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);

								Opa5.assert.strictEqual($optionList.children().length, 2, "There were 2 items in the master page.");
							},
							errorMessage: "Some items may lost in the master page."
						});
					},

					theAllItemsShouldBeSelected: function() {
						return this.waitFor({
							id: sAllItemId,
							viewName: sViewName,
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.ok(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'All' item was selected.");
								Opa5.assert.strictEqual($count.text(), "6", "The counter of 'All' item was correct.");
							},
							errorMessage: "Can't find 'All' item."
						});
					},

					theUnreadItemsShouldBeUnselected: function() {
						return this.waitFor({
							id: sUnreadItemId,
							viewName: sViewName,
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.notOk(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'Unread' item was not selected.");
								Opa5.assert.strictEqual($count.text(), "2", "The counter of 'Unread' item was correct.");
							},
							errorMessage: "Can't find 'Unread' item."
						});
					},

					theCurrentDetailPageShouldBeAllNotifications: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							success: function(oSplitContainer) {
								var oCurrentPage = oSplitContainer[0].getCurrentDetailPage();
								var sCurrentPageId = oCurrentPage.getId();

								if (sCurrentPageId.indexOf(sAllPageId) > -1) {
									Opa5.assert.notOk(oCurrentPage.$().hasClass("sapMNavItemHidden"), "The current detail page is for all notifications.");
								}
							},
							errorMessage: "The current detail page is not for all notifications."
						});
					},

					theDetailPageShouldHaveAllEntries: function() {
						return this.waitFor({
							id: sAllListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);

								Opa5.assert.strictEqual($optionList.children().length, 6, "There were 6 items in the current detail page.");
							},
							errorMessage: "Some items may lost in the current detail page."
						});
					},

					theUnreadNotificationsShouldBeMarked: function() {
						return this.waitFor({
							id: sAllListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);
								var $unreadItem1 = $optionList.children().eq(2);
								var $unreadItem2 = $optionList.children().eq(4);

								Opa5.assert.ok($unreadItem1.children(".sapMNLI-High").eq(0).css("background-color", "rgb(0, 153, 204)"),
									"Unread notification marked.");
								Opa5.assert.ok($unreadItem2.children(".sapMNLI-High").eq(0).css("background-color", "rgb(0, 153, 204)"),
									"Unread notification marked.");
							},
							errorMessage: "Some unread notifications may be not marked."
						});
					},

					theReadNotificationShouldBeDeleted: function() {
						return this.waitFor({
							id: sAllListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);

								Opa5.assert.strictEqual($optionList.children().length, 5, "The notification was deleted.");
							},
							errorMessage: "The notification was not deleted."
						});
					},
					
					theCounterInAllItemShouldChange: function() {
						return this.waitFor({
							id: sAllItemId,
							viewName: sViewName,
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.strictEqual($count.text(), "5", "The counter of 'All' item changed.");
							},
							errorMessage: "The counter of 'All' item didn't change."
						});
					},
					
					theCounterInUnreadItemShouldNotChange: function() {
						return this.waitFor({
							id: sUnreadItemId,
							viewName: sViewName,
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.strictEqual($count.text(), "2", "The counter of 'Unread' item changed.");
							},
							errorMessage: "The counter of 'Unread' item changed."
						});
					},

					theOtherItemShouldNotBeSelected: function() {
						return this.waitFor({
							id: sAllItemId,
							viewName: sViewName,
							success: function(oItem) {
								Opa5.assert.notOk(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'All' item was not selected.");
							},
							errorMessage: "The 'All' item was selected."
						});
					},

					theItemShouldBeSelected: function() {
						return this.waitFor({
							id: sUnreadItemId,
							viewName: sViewName,
							success: function(oItem) {
								Opa5.assert.ok(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'Unread' item was selected.");
							},
							errorMessage: "The 'Unread' item was not selected."
						});
					},

					theCurrentDetailPageShouldChange: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							success: function(oSplitContainer) {
								var oCurrentPage = oSplitContainer[0].getCurrentDetailPage();

								var sCurrentPageId = oCurrentPage.getId();

								if (sCurrentPageId.indexOf(sUnreadPageId) > -1) {
									Opa5.assert.notOk(oCurrentPage.$().hasClass("sapMNavItemHidden"), "The current detail page is for all notifications.");
								}
							},
							errorMessage: "The current detail page is not for all notifications."
						});
					},

					theDetailPageShouldHaveTwoEntries: function() {
						return this.waitFor({
							id: sUnreadListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);

								Opa5.assert.strictEqual($optionList.children().length, 2, "There were 2 items in the current detail page.");
							},
							errorMessage: "Some items may lost in the current detail page."
						});
					},

					allNotificationsShouldBeMarkedAsUnread: function() {
						return this.waitFor({
							id: sUnreadListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);
								var result = true;

								for (var i = 0, iLen = $optionList.children().length; i < iLen; i++) {
									var $unreadItem = $optionList.children().eq(i);

									if (!$unreadItem.children(".sapMNLI-High").eq(0).css("background-color", "rgb(0, 153, 204)")) {
										return;
									}
								}

								Opa5.assert.ok(result, "All notifications are marked as unread.");
							},
							errorMessage: "Some unread notifications may be not marked."
						});
					},
					
					theUnreadNotificationShouldBeDeleted: function() {
						return this.waitFor({
							id: sAllListId,
							viewName: sViewName,
							success: function(oList) {
								var $optionList = oList.$().children().eq(0);

								Opa5.assert.strictEqual($optionList.children().length, 5, "The notification was deleted.");
							},
							errorMessage: "The notification was not deleted."
						});
					},
					
					theCounterInAllItemShouldChangeWhenDeleteUnread: function() {
						return this.waitFor({
							id: sAllItemId,
							viewName: sViewName,
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.strictEqual($count.text(), "5", "The counter of 'All' item changed.");
							},
							errorMessage: "The counter of 'All' item didn't change."
						});
					},
					
					theCounterInUnreadItemShouldChangeWhenDeleteUnread: function() {
						return this.waitFor({
							id: sUnreadItemId,
							viewName: sViewName,
							check: function(oItem) {
								return oItem.$().find(".sapMLIBCounter");	
							},
							success: function(oItem) {
								var $count = oItem.$().find(".sapMLIBCounter").eq(0);

								Opa5.assert.strictEqual($count.text(), "1", "The counter of 'Unread' item changed.");
							},
							errorMessage: "The counter of 'Unread' item didn't change."
						});
					}
				}
			}
		});
	});