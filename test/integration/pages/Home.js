sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/PropertyStrictEquals",
		"test/integration/pages/Common"
	],
	function (Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
		"use strict";


		Opa5.createPageObjects({
			onTheHomePage: {
				baseClass: Common,
				actions: {
				    iPressThePersonalButton: function () {
					return this.waitFor({
							controlType: "sap.m.Button",
							success: function (aButtons) {
								aButtons[0].$().trigger("tap");
							},
							errorMessage: "Did not find the Personal Button on the Home page"
						});
				},
				  iPressTheCreateSession: function () {
					return this.waitFor({
							 viewName : "Home",
                         id : "createSession",
                         success: function (aButtons) {
				   				aButtons.$().trigger("tap");
				  		},
							errorMessage: "Did not find the Create Session on the Home Page"
						});
				},
				  iPressTheExistedSession: function () {
					return this.waitFor({
						 viewName : "Home",
                         id : "sessionList",
                          success: function (aButtons) {
				   				aButtons.$().trigger("tap");
				  		},
							errorMessage: "Did not find the Existed Sessions on the Home page"
						});
				}
				    
				},
				assertions: {
				  iShouldSeeThePersonalInformation: function () {
						return this.waitFor({
							controlType: "sap.m.Button",
							success: function () {
								// we set the view busy, so we need to query the parent of the app
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not find the Personal Information"
						});
					},
						  iShouldSeeTheCreateSessionPage: function () {
						return this.waitFor({
						    
					     	viewName : "CreateSession",
                              id : "ssmsCreateSession-Topic",
							success: function () {
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not find the Create Session Page"
						});
					},
						   iShouldSeeTheExistedSessionList: function () {
						return this.waitFor({
						
						 
						   	controlType: "sap.m.Button",
							success: function () {
								// we set the view busy, so we need to query the parent of the app
				
								Opa5.assert.ok(true, "The Message is found");
							},
							errorMessage: "Did not find the Existed Session List"
						});
					}

				}
			}
		});

	});