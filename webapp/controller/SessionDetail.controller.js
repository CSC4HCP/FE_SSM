jQuery.sap.require("ssms.util.formatter");
sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/UploadCollectionItem",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/commons/RichTooltip"
], function(BaseController, MessageToast, UploadCollectionParameter, UploadCollectionItem, Dialog, Text, Button, RichTooltip) {
	"use strict";

	var iSessionId;
	var sUserRole;
	var bOwner = false;
	var bBeforeSelect;
	var sBeforeStatus;
	var bDateValid = true;
	var bVisibilityValid = true;
	var bEditVaild = false;
	var bStatusVaild = false;
	var oSessionModel;
	return BaseController.extend("ssms.controller.SessionDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");

			var url = location.href;
			var id = url.substr(url.lastIndexOf("/") + 1);

			var oRouter = this.getRouter();
			oRouter.getRoute("sessionDetail").attachMatched(this._onRouteMatched, this);

			oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("/destinations/SSM_DEST/api/session/" + id, null, false);
			this.getView().setModel(oSessionModel);

			var oControl = this.getView().byId("ssms-Status");
			this._formatStateBackground(oControl, oControl.getText());

			this.getUserRole(oModel.getData());
			this.setUserPermission(oModel.getData(),oSessionModel.getData());
		},

		/**
		 * @function
		 * @name getUserRole
		 * @description Get user's role and team then set the _oUser.
		 * @param {Object} oUserData - User information got from the userAPI
		 * @return {Object} oUser - User information with all details
		 */
		getUserRole: function(oUserData) {

			$.ajax({
				type: "GET",
				url: "/destinations/SSM_DEST/api/user/" + oUserData.name,
				contentType: "application/json",
				success: function(user) {
					sUserRole = user.role;
					console.log(sUserRole);
				}
			});
		},

		setUserPermission: function(oUserData, oSessionData) {
		    var oEditBtn = this.getView().byId("ssms-editBtn");
		    var oCategory = this.getView().byId("ssms-category");
		    var oVisibility = this.getView().byId("ssms-radioBtn");
		    var oMeetingRoom = this.getView().byId("ssms-meetingRoom");
		    var oStatus = this.getView().byId("ssms-selectStatus");
		    var oMeetingTime = this.getView().byId("ssms-datetime");
		    var oDescription = this.getView().byId("ssms-description");
		    var oUploadCollection = this.getView().byId("ssms-UploadCollection");
		    var oSummary = this.getView().byId("ssms-summary");
		    
			if (oUserData.name === oSessionData.owner) {
				bOwner = true;
			}
			else {
			    bOwner = false;
			}

			if (bOwner || sUserRole === "Supporter") {
				oEditBtn.setVisible(true);
				
				if (bOwner){
				    oCategory.setEnabled(true);
				    oVisibility.setEditable(true);
				    oMeetingRoom.setEnabled(false);
				    oStatus.setEnabled(true);
				    oMeetingTime.setEnabled(false);
				    oDescription.setEnabled(true);
				    oUploadCollection.setUploadEnabled(true);
				    oSummary.setEnabled(true);
				}
				
				if(sUserRole === "Supporter"){
				    oCategory.setEnabled(false);
				    oVisibility.setEditable(false);
				    oMeetingRoom.setEnabled(true);
				    oStatus.setEnabled(false);
				    oMeetingTime.setEnabled(true);
				    oDescription.setEnabled(false);
				    oUploadCollection.setUploadEnabled(false);
				    oSummary.setEnabled(false);
				}
				
				if(bOwner && sUserRole === "Supporter"){
				    oCategory.setEnabled(true);
				    oVisibility.setEditable(true);
				    oMeetingRoom.setEnabled(true);
				    oStatus.setEnabled(true);
				    oMeetingTime.setEnabled(true);
				    oDescription.setEnabled(true);
				    oUploadCollection.setUploadEnabled(true);
				    oSummary.setEnabled(true);
				}
			}
			else {
			    oEditBtn.setVisible(false);
			}
		},
		_onRouteMatched: function(oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			iSessionId = oArgs.id;

		},
		_formatStateBackground: function(oControl, sText) {
			switch (sText) {
				case "Open":
					oControl.removeStyleClass("ssmsGreenFont");
					oControl.removeStyleClass("ssmsGrayFont");
					oControl.removeStyleClass("ssmsRedFont");
					oControl.addStyleClass("ssmsYellowFont");
					break;
				case "In Progress":
					oControl.removeStyleClass("ssmsYellowFont");
					oControl.removeStyleClass("ssmsGrayFont");
					oControl.removeStyleClass("ssmsRedFont");
					oControl.addStyleClass("ssmsGreenFont");
					break;
				case "Closed":
					oControl.removeStyleClass("ssmsGreenFont");
					oControl.removeStyleClass("ssmsYellowFont");
					oControl.removeStyleClass("ssmsRedFont");
					oControl.addStyleClass("ssmsGrayFont");
					break;
				case "Cancelled":
					oControl.removeStyleClass("ssmsGreenFont");
					oControl.removeStyleClass("ssmsGrayFont");
					oControl.removeStyleClass("ssmsYellowFont");
					oControl.addStyleClass("ssmsRedFont");
					break;
			}
		},
		
		_getBeforeValue: function() {
			bBeforeSelect =oSessionModel.getData().visibility; 
			sBeforeStatus = oSessionModel.getData.status;
		},

		onSendSession: function() {
			MessageToast.show("Will Send notification to supporter!");
		},

		onEditSession: function() {
			var sIdShow = this.byId("ssms-showVBox");
			var sIdEdit = this.byId("ssms-editVBox");

			if (sIdShow.getVisible()) {
				sIdShow.setVisible(false);
				sIdEdit.setVisible(true);

			} else {
				this.onPressCreate();
				if (bEditVaild) {
					sIdShow.setVisible(true);
					sIdEdit.setVisible(false);
					var oControl = this.getView().byId("ssms-Status");
					this._formatStateBackground(oControl, oControl.getText());
				} else {
					this._createConfirmDialog();
				}
			}

		},
		_createConfirmDialog: function() {
			var dialog = new Dialog({
				title: "Error",
				type: "Message",
				state: "Error",
				content: new Text({
					text: "Please check the warning of the input and modified according to the requirement!"
				}),
				beginButton: new Button({
					text: "OK",
					press: function() {
						dialog.close();
					}
				})
			});

			this._oDialog = dialog;
			this._oDialog.open();
		},
		onCheckDate: function(oEvent) {
			var dNowDate = new Date();
			var oDatePicker = oEvent.getSource();
			var dSelectedDate = oDatePicker.getDateValue();
			if (dSelectedDate <= dNowDate) {
				bDateValid = false;
				oDatePicker.setValueState(sap.ui.core.ValueState.Error);
				oDatePicker.setValueStateText("The selected date must be later than today, please choose another one.");
				var Tooltip = new RichTooltip({
					text: "The selected date must be later than today, please choose another one."
				});
				oDatePicker.setTooltip(Tooltip);
			} else {
				bDateValid = true;
				oDatePicker.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onCheckRadioGroup: function(oEvent) {
			var oRadioGroup = oEvent.getSource();
			var iSelectIndex = oRadioGroup.getSelectedIndex();
			var iBefore;
			var tTooltip;
			var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
			if(sStatus === "Open"){
			if(bBeforeSelect){
			if (iSelectIndex === 1) {
				bVisibilityValid = false;
				oRadioGroup.setValueState(sap.ui.core.ValueState.Error);
				tTooltip = new RichTooltip({
					text: "The public session cannot become private, please keep public."
				});
				oRadioGroup.setTooltip(tTooltip);
			} else {
				bVisibilityValid = true;
				oRadioGroup.setValueState(sap.ui.core.ValueState.None);
			}
			}
			}
			else {
			    if(bBeforeSelect){
			      iBefore = 0;  
			    }
			    else {
			        iBefore = 1;  
			    }
			    if (iSelectIndex !== iBefore){
			        bVisibilityValid = false;
				oRadioGroup.setValueState(sap.ui.core.ValueState.Error);
				 tTooltip = new RichTooltip({
					text: "Cannot modify visibility without 'open' status."
				});
				oRadioGroup.setTooltip(tTooltip);
			    }
			    else {
				bVisibilityValid = true;
				oRadioGroup.setValueState(sap.ui.core.ValueState.None);
			}
			}
		},
		
		onCheckStatus:function() {
		    this._getBeforeValue();
		    var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
		    
		},

		onPressCreate: function() {
			if (bDateValid && bVisibilityValid) {
				var oSessionData = this.byId("ssms-editVBox").getModel().getData();
				oSessionData.file = this.byId("ssms-UploadCollection").getItems().length;
				//	this._showBusyIndicator();
				$.ajax({
					type: "PUT",
					url: "/destinations/SSM_DEST/api/session/" + iSessionId,
					data: JSON.stringify(oSessionData),
					dataType: "json",
					contentType: "application/json",
					success: function() {
						console.log("success!");
					}
				});
				
				bEditVaild = true;
			}
		},
		/**
		 * @function
		 * @name _showBusyIndicator
		 * @description Show busy indicator when submit the form.
		 */
		_showBusyIndicator: function() {
			sap.ui.core.BusyIndicator.show(0);

			if (this._sTimeoutId) {
				jQuery.sap.clearDelayedCall(this._sTimeoutId);
				this._sTimeoutId = null;
			}

			this._sTimeoutId = jQuery.sap.delayedCall(3000, this, function() {
				sap.ui.core.BusyIndicator.hide();
			});
		}

	});

});