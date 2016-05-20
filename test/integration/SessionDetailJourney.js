sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Session Detail Page");
		opaTest("Should see the SessionDetail Page", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({hash: "sessionDetail/1"});

			// Actions
			When.onSessionDetail.iLookAtTheScreen();

			// Assertions
			Then.onSessionDetail.iShouldSeeTheSessionDetailPage();
		});
			opaTest("SubSection control can be loaded", function(Given, When, Then) {

		Then.onSessionDetail.iShouldSeeSubSectionLoaded();
		    // Arragements
		    
		});
		
		opaTest("Should See The Edit Button be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnEditButton();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheEditButtonbeClicked();
		});
		opaTest("Should See The InputFiled can be inputed", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iInputDescriptionValueInTheField();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheDescriptionValue();
		});
		opaTest("Should See The summary InputFiled can be inputed", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iInputSummaryValueInTheField();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheSummaryValue();
		});
		opaTest("Should See The Public Selection", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnRadioButtonPrivate();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeePrivateRadioButtonBeSelected();
		});
		
		opaTest("Should See The Upload Button be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnUploadButton();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheUploadButtonbeClicked();
		});
		opaTest("Should See The Category selection be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnCategorySelection();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeThreeSelections();
		});
		opaTest("Should See The Status selection be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnStatusSelection();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeetwoSelection();
		});
		
		opaTest("Should See The Decline Button be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnDeclineButton();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheDeclineButtonbeClicked();
		  
		});
		opaTest("Should See The Save Button be clicked", function(Given, When, Then) {
		   // Actions
		   When.onSessionDetail.iPressOnSaveButton();
		   
		   // Assertions
		   Then.onSessionDetail.iShouldSeeTheSaveButtonbeClicked();
		    Given.iTearDownMyApp();
		   
		});
		
	}
);