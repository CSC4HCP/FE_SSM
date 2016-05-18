sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Home_OPA");
		opaTest("Should see the Personal Information", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheHomePage.iPressThePersonalButton();

			// Assertions
			Then.onTheHomePage.iShouldSeeThePersonalInformation().
			and.iTeardownMyAppFrame();
		});

		opaTest("Should see the Existed Sessions", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheHomePage.iPressTheExistedSession();

			// Assertions
			Then.onTheHomePage.iShouldSeeTheExistedSessionList().
			and.iTeardownMyAppFrame();
		});

		opaTest("Should see the Create Session Page", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheHomePage.iPressTheCreateSession();

			// Assertions
			Then.onTheHomePage.iShouldSeeTheCreateSessionPage().
			and.iTeardownMyAppFrame();
		});

		opaTest("Should see the Search Information", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp();

			//Actions
			When.onTheHomePage.iPressTheSearchField();

			// Assertions
			Then.onTheHomePage.iShouldSeeTheSeachInfo().
			and.iTeardownMyAppFrame();
		});

	}
);