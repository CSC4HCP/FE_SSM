sap.ui.require([
	"sap/ui/test/Opa5",
	"sap/ui/test/matchers/AggregationLengthEquals",
	"sap/ui/test/matchers/PropertyStrictEquals",
	"test/integration/pages/Common"
], function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
	"use strict";

	Opa5.createPageObjects({
		onSessionDetail: {
			baseClass: Common,
			actions: {
				iPressOnEditButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "SessionDetail",
						success: function(oButtons) {
							oButtons.forEach(function(oButton) {
								if (oButton.getIcon() === "sap-icon://edit") {
									oButton.$().trigger("tap");
								}
							});
						},
						errorMessage: "No Edit button found."
					});
				},
				
				iInputDescriptionValueInTheField: function() {
					return this.waitFor({
						id: "ssms-description",
						viewName: "SessionDetail",
						success: function(oInput) {
							oInput.setValue("ssms-description");
						},
						errorMessage: "no Input Filed Can be inputed"
					});

				},
				iInputSummaryValueInTheField: function() {
					return this.waitFor({
						id: "ssms-summary",
						viewName: "SessionDetail",
						success: function(oInput) {
							oInput.setValue("ssms-summary");
						},
						errorMessage: "no Input Filed Can be inputed"
					});

				},
				iPressOnUploadButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "SessionDetail",
						success: function(oButtons) {
							oButtons.forEach(function(oButton) {
								if (oButton.getIcon() === "sap-icon://upload") {
									oButton.$().trigger("tap");
								}
							});
						},
						errorMessage: "upload buton not found."
					});

				},
				iPressOnCategorySelection: function() {
					return this.waitFor({
						id: "ssms-category",
						viewName: "SessionDetail",
						success: function(aSelect) {
							aSelect.open();
						},
						errorMessage: "Category Selection not be clicked."
					});

				},
				iPressOnOneOfTheCategorySelection: function() {
					return this.waitFor({
						id: "ssms-category",
						viewName: "SessionDetail",
						success: function(aSelect) {
							aSelect.open();
							aSelect.setSelectedKey("England");
						},
						errorMessage: "Category Selection not be clicked."
					});

				},
				iPressOnStatusSelection: function() {
					return this.waitFor({
						id: "ssms-selectStatus",
						viewName: "SessionDetail",
						success: function(aSelect) {
							aSelect.open();
						},
						errorMessage: "Status Selection not be clicked."
					});

				},
				
				iPressOnRadioButtonPrivate: function() {
					return this.waitFor({
						controlType: "sap.m.RadioButton",
						viewName: "SessionDetail",
						success: function(aRadioButton) {
							aRadioButton[1].$().trigger("tap");
						},
						errorMessage: "Radio Button not found."
					});
				},

				iPressOnDeclineButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "SessionDetail",
						success: function(oButtons) {
							oButtons.forEach(function(oButton) {
								if (oButton.getIcon() === "sap-icon://decline") {
									oButton.$().trigger("tap");
								}
							});
						},
						errorMessage: "No decline button found."
					});
				},
				iPressOnOneOfTheStatusSelection: function() {
					return this.waitFor({
						id: "ssms-selectStatus",
						viewName: "SessionDetail",
						success: function(aSelect) {
							aSelect.open();
							aSelect.setSelectedKey("Cancelled");
						},
						errorMessage: "Status Selection not be clicked."
					});

				},
				iPressOnSaveButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "SessionDetail",
						success: function(oButtons) {
							oButtons.forEach(function(oButton) {
								if (oButton.getIcon() === "sap-icon://save") {
									oButton.$().trigger("tap");
								}
							});
						},
						errorMessage: "No save button found."
					});
				},
				iPressOnSendButton: function() {
					return this.waitFor({
						controlType: "sap.m.Button",
						viewName: "SessionDetail",
						success: function(oButtons) {
							oButtons.forEach(function(oButton) {
								if (oButton.getIcon() === "sap-icon://action") {
									oButton.$().trigger("tap");
								}
							});
						},
						errorMessage: "No save button found."
					});
				}
			},
			assertions: {
				iShouldSeeTheSessionDetailPage: function() {
					return this.waitFor({
						viewName: "SessionDetail",
						success: function() {
							Opa5.assert.ok("The SessionDetail page is loaded.");
						},
						errorMessage: "The SessionDetail page doesn't exist."
					});
				},
				iShouldSeeSubSectionLoaded: function() {
					return this.waitFor({
						id: "ObjectPageLayout",
						viewName: "SessionDetail",
						success: function() {
							Opa5.assert.ok("The SubSection loaded.");
						},
						errorMessage: "The SubSection doesn't loaded."
					});
				},
				iShouldSeeTheEditButtonbeClicked: function() {
					return this.waitFor({
						controlType: "sap.ui.layout.Grid",
						viewName: "SessionDetail",
						success: function(aSections) {
							Opa5.assert.equal(aSections[1].getVisible(), true);
						},
						errorMessage: "The Edit Button not be Clickable."
					});
				},
				iShouldSeeTheUploadButtonbeClicked: function() {
					return this.waitFor({
						controlType: "ssms.control.uploadcollection.SSMSUploadCollection",
						viewName: "SessionDetail",
						success: function() {
							Opa5.assert.ok(true, "The Upload button is clicked.");
						},
						errorMessage: "The Upload Button not be Clickable."
					});
				},
				iShouldSeeTheDescriptionValue: function() {
					return this.waitFor({
						id: "ssms-description",
						viewName: "SessionDetail",
						success: function(oInput) {
							if (oInput.getValue() === "ssms-description") {
								Opa5.assert.ok(true, "Input Filed Can be inputed.");
							}
						},
						errorMessage: "Input Filed Can not be inputed"
					});
				},
				iShouldSeeTheSummaryValue: function() {
					return this.waitFor({
						id: "ssms-summary",
						viewName: "SessionDetail",
						success: function(oInput) {
							if (oInput.getValue() === "ssms-summary") {
								Opa5.assert.ok(true, "Input Filed Can be inputed.");
							}
						},
						errorMessage: "Input Filed Can not be inputed"
					});
				},
				iShouldSeeThreeSelections: function() {
					return this.waitFor({
						id: "ssms-category",
						viewName: "SessionDetail",
						success: function(aSelect) {
							Opa5.assert.equal(aSelect.getSelectableItems().length, 3);
						},
						errorMessage: "i Should not See Three Selections"
					});
				},
				iShouldSeeOneOfTheCategorySelectionCanBeSelected: function() {
					return this.waitFor({
						id: "ssms-category",
						viewName: "SessionDetail",
						success: function(aSelect) {
							Opa5.assert.equal(aSelect.getSelectedKey(), "England");
						},
						errorMessage: "i Should not See Three Selections"
					});
				},
				iShouldSeetwoSelection: function() {
					return this.waitFor({
						id: "ssms-selectStatus",
						viewName: "SessionDetail",
						success: function(aSelect) {
							Opa5.assert.equal(aSelect.getSelectableItems().length, 2);
						},
						errorMessage: "i Should not See two Selections"
					});
				},
				iShouldSeeOneOfTheStatusSelectionCanBeSelected: function() {
					return this.waitFor({
						id: "ssms-selectStatus",
						viewName: "SessionDetail",
						success: function(aSelect) {
							Opa5.assert.equal(aSelect.getSelectedKey(), "Cancelled");
						},
						errorMessage: "i Should not See two Selections"
					});
				},
				iShouldSeePrivateRadioButtonBeSelected: function() {
					return this.waitFor({
						controlType: "sap.m.RadioButtonGroup",
						viewName: "SessionDetail",
						success: function() {
							Opa5.assert.ok(true, "The Private button is clicked.");
						},
						errorMessage: "i Should not See Private Select."
					});
				},
				iShouldSeeTheDeclineButtonbeClicked: function() {
					return this.waitFor({
						controlType: "sap.ui.layout.Grid",
						viewName: "SessionDetail",
						success: function(aSections) {
							Opa5.assert.equal(aSections[0].getVisible(), true);
						},
						errorMessage: "The Save Button not be Clickable."
					});
				},	
				iShouldSeeTheSaveButtonbeClicked: function() {
					return this.waitFor({
						controlType: "sap.ui.layout.Grid",
						viewName: "SessionDetail",
						success: function(aSections) {
							Opa5.assert.equal(aSections[0].getVisible(), true);
						},
						errorMessage: "The Save Button not be Clickable."
					});
				},
				iShouldSeeTheNotificationWillSendToSupporter: function() {
					return this.waitFor({
						controlType: "sap.ui.layout.Grid",
						viewName: "SessionDetail",
						success: function(aSections) {
							Opa5.assert.equal(aSections[0].getVisible(), true);
						},
						errorMessage: "The Send Button not be Clickable."
					});
				}
			}
		}
	});
});