sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"test/integration/pages/Common"
	],
	function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
		"use strict";

		Opa5.createPageObjects({
			onTheNotificationPage: {
				baseClass: Common,
				actions: {
					iPressThePersonalButton: function() {
						return this.waitFor({
							controlType: "sap.m.SplitApp",
							success: function(aButtons) {
							
							},
							errorMessage: "Did not find the SplitApp Control"
						});
					},
				
				
					iPressTheSearchField: function() {
						return this.waitFor({
						controlType: "sap.m.Button",
							success: function(aButtons) {
							
							},
							errorMessage: "Did not find the SearchField on the Home page"
						});
					}

				},
				assertions: {
					iShouldSeeTheSplitContainer: function() {
						return this.waitFor({
							controlType: "sap.m.SplitContainer",
							success: function() {
								// we set the view busy, so we need to query the parent of the app
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not "
						});
					},
					
					iShouldSeeTheNotificationList: function() {
						return this.waitFor({
							viewName: "NotificationList",
							id: "notificationList",
							success: function() {
								// we set the view busy, so we need to query the parent of the app
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not find the Notification List"
						});
					},
						iShouldSeeTheMasterPage: function() {
						return this.waitFor({
							
							    id: "notificationAll",
								viewName: "NotificationList",
							success: function() {
								// we set the view busy, so we need to query the parent of the app
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not find the master page"
						});
					},
					
				
				
					iShouldSeeTheSeachInfo: function() {

						return this.waitFor({

							controlType: "sap.m.Button",
							success: function() {
								// we set the view busy, so we need to query the parent of the app

								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not "
						});
					}

				}
			}
		});

	});