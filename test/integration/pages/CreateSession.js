sap.ui.require([
		"sap/ui/test/Opa5",
		"sap/ui/test/matchers/AggregationLengthEquals",
		"sap/ui/test/matchers/PropertyStrictEquals",
		//"sap/ui/unified/DateRange",
		"test/integration/pages/Common"
	],
	function(Opa5, AggregationLengthEquals, PropertyStrictEquals, Common) {
		"use strict";

		Opa5.createPageObjects({
			onTheCreateSessionPage: {
				baseClass: Common,
				actions: {

					iPressOnClickTheRadioButton: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.RadioButton",
							success: function(oRadioButton) {
								oRadioButton[1].$().trigger("tap");
							},
							errorMessage: "The visibility of private doesn't exist."
						});
					},
					iPressOnClickTheInputField: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.Input",
							success: function(oInput) {
								var topicField = oInput[0].$().children();
								topicField.attr("value", "CreateSession-OPA");
							},
							errorMessage: "The input field is not exist."
						});
					},

					iPressOnDatePickerButton: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.DatePicker",
							success: function(oDatePicker) {
								oDatePicker[0].setValue("518");
							},
							errorMesssage: "The DatePicker does not exist."
						});
					},
				// 	iPressOnClickEarlyDate: function() {
				// 		return this.waitFor({
				// 			viewName: "CreateSession",
				// 			id: "date",
				// 			success: function(oDatePicker) {
				// 				var dNowDate = new Date();
				// 				var sToday = dNowDate.getDate();
				// 				var sYesterday = sToday - 1;
				// 				var dYesterday = new Date(dNowDate.setDate(sYesterday));
				// 				oDatePicker.setDateValue(dYesterday);
				// 			},
				// 			errorMessage: "The DatePicker does not exist."
				// 		});
				// 	},
					iPressOnFileUploadButton: function() {
						return this.waitFor({
							viewName: "CreateSession",
							id: "uploadCollection",
							success: function(oUploadButton) {
								oUploadButton.$().trigger("tap");
							},
							errorMessage: "The upload-file button does not exist."
						});
					},
					iPressOnSetTopicFieldNull: function(){
					    return this.waitFor({
					        viewName: "CreateSession",
					       controlType: "sap.m.Input",
							success: function(oInput) {
								var topicField = oInput[0].$().children();
								topicField.attr("value", "");
							},
							errorMessage: "The input field is not exist."
					    });
					},
					iPressOnSetDateFieldNull: function(){
					    return this.waitFor({
					        viewName: "CreateSession",
					        controlType: "sap.m.DatePicker",
							success: function(oDatePicker) {
								oDatePicker[0].setValue("");
							},
							errorMesssage: "The DatePicker does not exist."
					    });
					},
					iPressOnCreateButton: function() {
						return this.waitFor({
							viewName: "CreateSession",
							id: "create",
							success: function(oCreateButton) {
								oCreateButton.$().trigger("tap");
							},
							errorMessage: "The create button does not exist."
						});
					},
				// 	iPressOnSetRightDate: function(){
				// 	    return this.waitFor({
				// 	        viewName: "CreateSession",
				// 	        controlType: "sap.m.DatePicker",
				// 	        success: function(oDatePicker) {
				// 	            var dNowDate = new Date();
				// 	            var day =dNowDate.getDate();
				// 	            var rightDay = day + 2;
				// 	            var  date = dNowDate.toLocaleDateString();
				// 	            var sDay = date.split("/");
				// 	            var yearAll = sDay[2].split("");
				// 	            var month = sDay[0];
				// 	            var sRightDate = rightDay.toString();
				// 	            var year = yearAll[2]+yearAll[3];
				// 	            var newDate = month + "/" + sRightDate + "/" + year;
				// 				oDatePicker[0].setValue(newDate);
				// 			},
				// 			errorMesssage: "The DatePicker does not exist."
				// 	    });
				// 	},
					iPressOnTheCancelButton: function() {
					    return this.waitFor({
					        viewName: "CreateSession",
					        controlType: "sap.m.Button",
					        success: function(oButton){
					            oButton[1].$().trigger("tap");
					        },
					        errorMessage: "The cancel button does not exist."
					    });
					}
				},
				assertions: {

					iShoudSeeTheVisibilityTwoButtons: function(){
					  return this.waitFor({
					     vieewName: "CreateSession",
					     controlType: "sap.m.RadioButton",
					     success: function(oRadioButton){
					       Opa5.assert.strictEqual(oRadioButton.length, 2, "The 'Visibility' has 2 items."); 
					     },
					     errorMessage: "Some items do not on the page."
					  });
					},
					iShoudSeeTheVisibility: function() {
						return this.waitFor({
							controlType: "sap.m.RadioButton",
							viewName: "CreateSession",
							matchers: function(oRadioButton) {
							    return oRadioButton.getSelected;          
							},
							success: function() {
								Opa5.assert.ok(true, "The visibility of private is there.");
							},
							errorMessage: "The visibility of private cannot click."
						});
					},
					iShouldSeeTheInputField: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.Input",
							matchers: function(oTopicInput) {
								return oTopicInput.getValue() === "CreateSession-OPA" ? true : false;
							},
							success: function() {
								Opa5.assert.ok(true, "The upload-file button is there.");
							},
							errorMessage: "The upload-file button does not work."
						});
					},
					iShouldSeeTheCalendar: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.DatePicker",
							matchers: function(oDatePicker) {
								return oDatePicker.getValue() === "518" ? true : false;
							},
							success: function() {
								Opa5.assert.ok(true, "The date-picker of calendar is there.");
							},
							errorMessage: "The data-picker cannot click."
						});
					},
					iShouldSeeTheDateValidError: function() {
						return this.waitFor({
							viewName: "CreateSession",
							controlType: "sap.m.DatePicker",
							matchers: function(oDatePicker) {
								return oDatePicker._bValid === false ? true : false;
							},
							success: function() {
								Opa5.assert.ok(true, "The parameter is checked.");
							},
							errorMesssage: "The parameter can not check."
						});
					},
				// 	iShouldSeeTheErrorMessage: function() {
				// 		return this.waitFor({
				// 			viewName: "CreateSession",
				// 			controlType: "sap.m.DatePicker",
				// 			matchers: function(oMessage) {
				// 				return oMessage.$("#ssmsCreateSession-DateErrorMsg").visible();
				// 			},
				// 			success: function() {
				// 				Opa5.assert.ok(true, "The error message is there.");
				// 			},
				// 			errorMessage: "The date judgement does not work."
				// 		});
				// 	},
					iShouldSeeTheFileWindow: function() {
						return this.waitFor({
							viewName: "CreateSession",
							id: "uploadCollection",
							matchers: function(oUploadButton){
							    return oUploadButton.$().hasClass("sapMUC");
							},
							success: function() {
								Opa5.assert.ok(true, "The upload-file button is here.");
							},
							errorMessage: "The upload-file function does not work."
						});
					},
					iShouldSeeTheTopicFieldValidError: function() {
						return this.waitFor({
						    controlType: "sap.m.Input",
							viewName: "CreateSession",
							matchers: function(oTopicInput) {
								return oTopicInput.getValue() === "";
							},
							success: function() {
								Opa5.assert.ok(true, "The parameter is checked.");
							},
							errorMesssage: "The parameter can not check."
						});
					},
					iShouldSeeTheDateFieldNullError: function (){
					  return this.waitFor({
					      viewName: "CreateSession",
						  controlType: "sap.m.DatePicker",
						  matchers: function(oDatePicker){
						      return oDatePicker.getValue() === "";
						  },
						  success: function(){
						      Opa5.assert.ok(true, "The parameter is checked.");
						  },
						  errorMessage: "The parameter can not check."
					  });
					},
				// 	iShouldSeeTheDetailPage: function(){
				// 	    return this.waitFor({
				// 	        viewName: "SessionDetail",
				// 	        id: "ObjectPageLayout",
				// 	        success: function(){
				// 	          Opa5.assert.ok(true, "There is the session-detail page."); 
				// 	        },
				// 	        errorMessage: "Can't go to the session detail page."
				// 	    });
				// 	},
					iShouldSeeTheLastPage: function() {
					    return this.waitFor({
					        viewName: "CreateSession",
					        success: function(){
					         Opa5.assert.ok(true, "There is the last page");   
					        },
					        errorMessage: "The cancel navigation does not work."
					    });
					}
				}
			}
		});
	});