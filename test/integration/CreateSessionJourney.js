sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("CreateSession_OPA");
		opaTest("Should see the two 'Visiblity' radio buttons in the page", function(Given, When, Then) {
			//Arrangements
			Given.iStartMyApp({
				hash: "CreateSession"
			});

			//Actions
			When.onTheCreateSessionPage.iLookAtTheScreen();

			//Assertions
			Then.onTheCreateSessionPage.iShoudSeeTheVisibilityTwoButtons();
		});
		opaTest("Should see the 'Visiblity' radio button in the page", function(Given, When, Then) {

			//Actions
			When.onTheCreateSessionPage.iPressOnClickTheRadioButton();

			//Assertions
			Then.onTheCreateSessionPage.iShoudSeeTheVisibility();
		});

		opaTest("Should see the input field when I click the 'Topic' field", function(Given, When, Then) {
			//Actions
			When.onTheCreateSessionPage.iPressOnClickTheInputField();

			//Assertions
			Then.onTheCreateSessionPage.iShouldSeeTheInputField();
		});

		opaTest("Should see the calendar and the valid error when I click the DatePicker button", function(Given, When, Then) {
			//Assertions
			When.onTheCreateSessionPage.iPressOnDatePickerButton();

			//Asseertions
			Then.onTheCreateSessionPage.iShouldSeeTheCalendar()
				.and.iShouldSeeTheDateValidError();
		});
		opaTest("Should see the file upload window when I click the file-upload button", function(Given, When, Then) {
			//Assertion
			When.onTheCreateSessionPage.iPressOnFileUploadButton();

			//Assertions
			Then.onTheCreateSessionPage.iShouldSeeTheFileWindow();
		});

		opaTest("Should see the valid error message when I click the create button", function(Given, When, Then) {
			//Actions
			When.onTheCreateSessionPage.iPressOnSetTopicFieldNull()
				.and.iPressOnSetDateFieldNull()
				.and.iPressOnCreateButton();

			//Assertions
			Then.onTheCreateSessionPage.iShouldSeeTheTopicFieldValidError()
				.and.iShouldSeeTheDateFieldNullError();
		});
		opaTest("Should see the last page when I click cancel buton", function(Given, When, Then) {
			//Actions
			When.onTheCreateSessionPage.iPressOnTheCancelButton();

			//Assertions
			Then.onTheCreateSessionPage.iShouldSeeTheLastPage();
			Given.iTearDownMyApp();
		});
	});