sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"test/integration/pages/Common"
], function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
	"use strict";

	var sCreateSessionTileId = "createSession";
	var sCommentedSessionTileId = "commentedSession";
	var sOwnedSessionTileId = "ownedSession";
	var sJoinedSessionTileId = "joinedSession";
	var sPersonalCenterView = "PersonalCenter";
	var sCreateSessionView = "CreateSession";
	var sCommentedSessionView = "CommentedSession";
	var sOwnedSessionView = "OwnedSession";
	var sJoinedSessionView = "JoinedSession";

	Opa5.createPageObjects({
		onPersonalCenter: {
			baseClass: Common,
			actions: {
				iPressOnCreateSessionTile: function() {
					return this.waitFor({
						id: sCreateSessionTileId,
						viewName: sPersonalCenterView,
						success: function(oTile) {
							oTile.$().trigger("tap");
						},
						errorMessage: "This page does not have a 'Create Session' tile."
					});
				},
				
				iPressOnCommentedSessionTile: function() {
					return this.waitFor({
						id: sCommentedSessionTileId,
						viewName: sCommentedSessionView,
						success: function(oTile) {
							oTile.$().trigger("tap");
						},
						errorMessage: "This page does not have a 'Commented Session' tile."
					});
				},
				
				iPressOnOwnedSessionTile: function() {
					return this.waitFor({
						id: sOwnedSessionTileId,
						viewName: sOwnedSessionView,
						success: function(oTile) {
							oTile.$().trigger("tap");
						},
						errorMessage: "This page does not have a 'Owned Session' tile."
					});
				},
				
				iPressOnJoinedSessionTile: function() {
					return this.waitFor({
						id: sJoinedSessionTileId,
						viewName: sJoinedSessionView,
						success: function(oTile) {
							oTile.$().trigger("tap");
						},
						errorMessage: "This page does not have a 'Joined Session' tile."
					});
				}
			},
			assertions: {
				thePersonalInformationShouldDisplay: function() {
					return this.waitFor({
						controlType: "sap.m.VBox",
						matchers: function(oVBox) {
							return oVBox.hasStyleClass("ssmsPersonalCenter_vbox1");
						},
						success: function() {
							Opa5.assert.ok(true, "The personal information panel displayed.");
						},
						errorMessage: "Personal Information does not exist."
					});
				},

				theDetailInformationShouldDisplay: function() {
					return this.waitFor({
						controlType: "sap.m.Text",
						success: function(aTexts) {
							Opa5.assert.strictEqual(aTexts.length, 5, "Here are 5 detail information.");
						},
						errorMessage: "Some details do not exist in the personal information panel."
					});
				},

				allFourTilesShouldDisplay: function() {
					return this.waitFor({
						controlType: "sap.m.StandardTile",
						success: function(aTiles) {
							Opa5.assert.strictEqual(aTiles.length, 4, "Here are 4 tiles in this page.");
						},
						errorMessage: "Some tiles do not exist in this page."
					});
				},

				iShouldGoToCreateSessionPage: function() {
					return this.waitFor({
						viewName: sCreateSessionView,
						id: "ssmsCreateSession-Session",
						success: function() {
							Opa5.assert.ok(true, "Now is in the Create Session Page.");
						},
						errorMessage: "Can't go to the Create Session Page."
					});
				},

				iShouldGoToCommentedSessionPage: function() {
					return this.waitFor({
						viewName: sCommentedSessionView,
						id: "ssmsCreateSession-Session",
						success: function() {
							Opa5.assert.ok(true, "Now is in the Commented Session Page.");
						},
						errorMessage: "Can't go to the Commented Session Page."
					});
				},

				iShouldGoToOwnedSessionPage: function() {
					return this.waitFor({
						viewName: sOwnedSessionView,
						id: "ssmsCreateSession-Session",
						success: function() {
							Opa5.assert.ok(true, "Now is in the Owned Session Page.");
						},
						errorMessage: "Can't go to the Owned Session Page."
					});
				},

				iShouldGoToJoinedSessionPage: function() {
					return this.waitFor({
						viewName: sJoinedSessionView,
						id: "ssmsCreateSession-Session",
						success: function() {
							Opa5.assert.ok(true, "Now is in the Joined Session Page.");
						},
						errorMessage: "Can't go to the Joined Session Page."
					});
				}
			}
		}
	});
});