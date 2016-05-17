sap.ui.require(
	["sap/ui/test/opaQunit"],
	function(opaTest) {
		"use strict";

		QUnit.module("Personal Center Page");
		opaTest("Should see the Personal Information", function(Given, When, Then) {
			// Arrangements
			Given.iStartMyApp({hash: "personalCenter"});

			// Actions
			When.onPersonalCenter.iLookAtTheScreen();

			// Assertions
			Then.onPersonalCenter.thePersonalInformationShouldDisplay();
		});
		
		opaTest("Should see all the detail information", function(Given, When, Then) {
		   // Actions
		  // When.onPersonalCenter.iLookAtTheScreen();
		   
		   // Assertions
		   Then.onPersonalCenter.theDetailInformationShouldDisplay();
		});
		
		opaTest("Should see 4 tiles on the right panel", function(Given, When, Then) {
		   // Actions
		  // When.onPersonalCenter.iLookAtTheScreen();
		   
		   // Assertions
		   Then.onPersonalCenter.allFourTilesShouldDisplay();
		});
		
		opaTest("Should go to CreateSession Page after click 'Create Session' tile", function(Given, When, Then) {
		    // Actions
		    When.onPersonalCenter.iPressOnCreateSessionTile();
		    
		    // Assertions
		    Then.onPersonalCenter.iShouldGoToCreateSessionPage();
		    
		    // Arragements
		    Given.iTearDownMyApp();
		});
		
// 		opaTest("Should go to CommentedSession Page after click 'Commented Session' tile", function(Given, When, Then) {
// 		    // Actions
// 		    When.onPersonalCenter.iPressOnCommentedSessionTile();
		    
// 		    // Assertions
// 		    Then.onPersonalCenter.iShouldGoToCommentedSessionPage();
		    
// 		    // Arragements
// 		    Given.iTearDownMyApp();
// 		});
		
// 		opaTest("Should go to OwnedSession Page after click 'Owned Session' tile", function(Given, When, Then) {
// 		    // Actions
// 		    When.onPersonalCenter.iPressOnOwnedSessionTile();
		    
// 		    // Assertions
// 		    Then.onPersonalCenter.iShouldGoToOwnedSessionPage();
		    
// 		    // Arragements
// 		    Given.iTearDownMyApp();
// 		});
		
// 		opaTest("Should go to JoinedSession Page after click 'Joined Session' tile", function(Given, When, Then) {
// 		    // Actions
// 		    When.onPersonalCenter.iPressOnJoinedSessionTile();
		    
// 		    // Assertions
// 		    Then.onPersonalCenter.iShouldGoToJoinedSessionPage();
		    
// 		    // Arragements
// 		    Given.iTearDownMyApp();
// 		});
	}
);