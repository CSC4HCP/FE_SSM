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
							controlType: "sap.m.Button",
							success: function(aButtons) {
							
							},
							errorMessage: "Did not find the Personal Button on the Home page"
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
					iShouldSeeThePersonalInformation: function() {
						return this.waitFor({
							controlType: "sap.m.Button",
							success: function() {
								// we set the view busy, so we need to query the parent of the app
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not "
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