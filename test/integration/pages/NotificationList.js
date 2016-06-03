sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"test/integration/pages/Common"
	],
	function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
		"use strict";
		
		var sViewName = "test.NotificationList";
		var sAllItemsId = "notificationAll";
		var sUnreadItemsId = "notificationUnread";

		Opa5.createPageObjects({
			onNotificationListPage: {
				baseClass: Common,
				actions: {
					iPressOnItem: function() {
						return this.waitFor({
							id: sUnreadItemsId,
							viewName: sViewName,
							success: function(oItem) {
								oItem.$().trigger("tap");
							},
							errorMessage: "Can not find the 'Unread' item."
						});
					}
				},
				assertions: {
					iShouldSeeTheSplitContainer: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							success: function() {
								Opa5.assert.ok(true, "Split Container was there.");
							},
							errorMessage: "Did not find the split container."
						});
					},
					
					iShouldSeeTheMasterPage: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "masterPages",
								length: 1
							}),
							success: function() {
								Opa5.assert.ok(true, "Only 1 Master page was there.");
							},
							errorMessage: "Did not find the master page."
						});
					},
					
					iShouldSeeTheDetailPage: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "detailPages",
								length: 1
							}),
							success: function() {
								Opa5.assert.ok(true, "Only 1 Detail page was there.");
							},
							errorMessage: "Did not find the detail page."
						});
					},
					
					theMasterPageShouldHaveTwoEntries: function() {
						return this.waitFor({
							controlType: "sap.m.List",
							viewName: sViewName,
							matchers:  new AggregationLengthEquals({
								name: "items",
								length: 2
							}),
							success: function() {
								Opa5.assert.ok(true, "There were 2 items in the master page.");
							},
							errorMessage: "Some items may lost in the master page."
						});
					},
					
					theAllItemsShouldBeSelected: function() {
						return this.waitFor({
							id: sAllItemsId,
							viewName: sViewName,
							success: function(oItem) {
								Opa5.assert.ok(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'All' item was selected.");
							},
							errorMessage: "The 'All' item was not selected."
						});
					},
					
					theOtherItemShouldNotBeSelected: function() {
						return this.waitFor({
							id: sAllItemsId,
							viewName: sViewName,
							success: function(oItem) {
								Opa5.assert.notOk(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'All' item was not selected.");
							},
							errorMessage: "The 'All' item was selected."
						});
					},
					
					theItemShouldBeSelected: function() {
						return this.waitFor({
							id: sUnreadItemsId,
							viewName: sViewName,
							success: function(oItem) {
								Opa5.assert.ok(oItem.$().hasClass("ssmNotificationMasterItemSelected"), "The 'Unread' item was selected.");
							},
							errorMessage: "The 'Unread' item was not selected."
						});
					}
				}
			}
		});
	});