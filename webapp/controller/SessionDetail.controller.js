jQuery.sap.require("ssms.util.formatter");
sap.ui.define([
	"jquery.sap.global",
	"sap/ui/core/Fragment",
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/UploadCollectionItem",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button",
	"sap/ui/commons/RichTooltip"
], function(jQuery, Fragment, BaseController, MessageToast, UploadCollectionParameter, UploadCollectionItem, Dialog, Text, Button,
	RichTooltip) {
	"use strict";

	// 	var iSessionId;
	var sUserRole;
	var bOwner = false;
	var bBeforeSelect;
	var sBeforeStatus;
	var bDateValid = false;
	var bEditVaild = false;
	var bSummaryVaild = false;
	var bLocationVaild = false;
	var bSupporterW = false;
	var bSupporterT = false;
	var oSessionModel;
	var oModel;
	var oFileModel;
	var iSessionId;
	var iPressCount = 0;
	var aDocumentId = [];
	var iDelete = 0;
	var oUploadCollection;
	return BaseController.extend("ssms.controller.SessionDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");

			var oRouter = this.getRouter();
			oRouter.getRoute("sessionDetail").attachMatched(this._onRouteMatched, this);

		},

		_onRouteMatched: function(oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			iSessionId = oArgs.id;
			oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("/destinations/SSM_DEST/api/session/" + iSessionId, null, false);
			this.getView().setModel(oSessionModel);
			this.getView().bindElement("/");

			var oControl = this.getView().byId("ssms-Status");
			this._formatStateBackground(oControl, oControl.getText());

			this.addAttachment();
			this._getBeforeValue();

			this.getUserRole(oModel.getData());
			//this.setUserPermission(oModel.getData(), oSessionModel.getData());
			this.checkDetailPermission();

			this.byId("ssms-UploadCollection").setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + iSessionId);
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
			var oTime = this.getView().byId("ssms-timepicker");
			var oDescription = this.getView().byId("ssms-description");
			oUploadCollection = this.getView().byId("ssms-UploadCollection");
			var oSummary = this.getView().byId("ssms-summary");

			if (oUserData.name === oSessionData.owner) {
				bOwner = true;
			} else {
				bOwner = false;
			}

			if (bOwner || sUserRole === "Supporter") {
				oEditBtn.setVisible(true);

				if (bOwner) {
					oCategory.setEnabled(true);
					oVisibility.setEditable(true);
					oMeetingRoom.setEnabled(false);
					oStatus.setEnabled(true);
					oMeetingTime.setEnabled(false);
					oTime.setEnabled(false);
					oDescription.setEnabled(true);
					oUploadCollection.setUploadEnabled(true);
					oSummary.setEnabled(true);
				}

				if (sUserRole === "Supporter") {
					oCategory.setEnabled(false);
					oVisibility.setEditable(false);
					oMeetingRoom.setEnabled(true);
					oStatus.setEnabled(false);
					oMeetingTime.setEnabled(true);
					oTime.setEnabled(true);
					oDescription.setEnabled(false);
					oUploadCollection.setUploadEnabled(false);
					oSummary.setEnabled(false);
				}

				if (bOwner && sUserRole === "Supporter") {
					oCategory.setEnabled(true);
					oVisibility.setEditable(true);
					oMeetingRoom.setEnabled(true);
					oStatus.setEnabled(true);
					oMeetingTime.setEnabled(true);
					oTime.setEnabled(true);
					oDescription.setEnabled(true);
					oUploadCollection.setUploadEnabled(true);
					oSummary.setEnabled(true);
				}
			} else {
				oEditBtn.setVisible(false);
			}

		},
		addAttachment: function() {
			oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData("/destinations/SSM_DEST/api/document/file/" + iSessionId, null, false);
			this.getView().setModel(oFileModel, "FileModel");
			var data = oFileModel.getData();
			var oShowCollection = this.byId("ssms-document");
			var oEditCollection = this.byId("ssms-UploadCollection");
			oShowCollection.removeAllItems();
			oEditCollection.removeAllItems();
			for (var i = 0; i < data.length; i++) {
				var iShowItems = new UploadCollectionItem({
					fileName: data[i].fileName,
					documentId: data[i].fileId,
					thumbnailUrl: "",
					url: "/destinations/SSM_DEST/api/document/download/" + data[i].fileId,
					enableEdit: false,
					enableDelete: false,
					visibleDelete: false,
					visibleEdit: false
				});
				oShowCollection.addItem(iShowItems);
			}
			for (var j = 0; j < data.length; j++) {
				var iEditItems = new UploadCollectionItem({
					fileName: data[j].fileName,
					documentId: data[j].fileId,
					url: "/destinations/SSM_DEST/api/document/download/" + data[j].fileId,
					enableEdit: false,
					enableDelete: true,
					visibleDelete: true,
					visibleEdit: false
				});
				oEditCollection.addItem(iEditItems);
			}
		},

		onDownloadAttachment: function() {
			var oShowUploadCollection = this.getView().byId("ssms-document");
			var aSelectedItems = oShowUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					oShowUploadCollection.downloadItem(aSelectedItems[i], true);
				}
			} else {
				MessageToast.show("Select an item to download");
			}
		},
		onFileDeleted: function(oEvent) {
			var oDeleteUploadCollection = oEvent.getParameters();
			//	var aSelectedItems = oUploadCollection.getSelectedItems();
			aDocumentId[iDelete] = oDeleteUploadCollection.documentId;
			iDelete++;
			//	var oEditCollection = this.byId("ssms-UploadCollection");
			//	oEditCollection.removeItem(oDeleteUploadCollection);
		},
		/*onChange: function(oEvent) {
		var oUploadCollection = oEvent.getSource();
		oTransferUpload.addItem((oUploadCollection));
			//oAddItems[iAdd] = oUploadCollection;
		//	iAdd++;
				
			//	var oCustomerHeaderToken = new UploadCollectionParameter({
			//		name : "x-csrf-token",
			//		value : "securityTokenFromModel"
			//	});
			//oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			 			//oUploadCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + iSessionId);
			 		//	oUploadCollection.upload();
		},
		*/
		
		onUploadComplete: function() {
// 			this.getView().setBusy(false);
			MessageToast.show(" Success!");
		},
		/*	onUploadComplate: function(oEvent){
			    	var oEditCollection = this.byId("ssms-UploadCollection");
				var iShowItems = new UploadCollectionItem({
						fileName: sFileName,
						documentId: "",
						thumbnailUrl: "",
						enableEdit: false,
						enableDelete: true,
						visibleDelete: true,
						visibleEdit: false
					});
					oEditCollection.addItem(iShowItems);
			},

			onBeforeUploadStarts: function(oEvent) {
				
			sFileName = oEvent.getParameter("fileName");
			},*/

		onSelectionChange: function() {
			var oShowUploadCollection = this.getView().byId("ssms-document");
			// If there's any item selected, sets download button enabled
			if (oShowUploadCollection.getSelectedItems().length > 0) {
				this.getView().byId("ssms-downloadButton").setEnabled(true);
			} else {
				this.getView().byId("ssms-downloadButton").setEnabled(false);
			}
		},

		checkDetailPermission: function() {
			var oEditBtn = this.getView().byId("ssms-editBtn");
			//check visibility
			if (!bBeforeSelect) {
				this.byId("ssms-private").setSelected(true);
			} else {
				this.byId("ssms-private").setEditable(false);
			}
			//check status
			if (sBeforeStatus === "Open") {
				this.byId("ssms-open").setEnabled(true);
				this.byId("ssms-inprogress").setEnabled(false);
				this.byId("ssms-closed").setEnabled(false);
				this.byId("ssms-cancelled").setEnabled(false);
			}
			if (sBeforeStatus === "In progress") {
				this.byId("ssms-open").setEnabled(false);
				this.byId("ssms-inprogress").setEnabled(true);
				this.byId("ssms-closed").setEnabled(true);
				this.byId("ssms-cancelled").setEnabled(true);
				this.byId("ssms-radioBtn").setEditable(false);
			}
			if (sBeforeStatus === "Closed") {
				oEditBtn.setEnabled(false);
			}
			if (sBeforeStatus === "Cancelled") {
				oEditBtn.setEnabled(false);
				this.byId("ssms-location").addStyleClass("ssmsfailure");
				this.byId("ssms-editdatatime").addStyleClass("ssmsfailure");
			}
		},

		_formatStateBackground: function(oControl, sText) {
			switch (sText) {
				case "Open":
					oControl.removeStyleClass("ssmsGreenFont");
					oControl.removeStyleClass("ssmsGrayFont");
					oControl.removeStyleClass("ssmsRedFont");
					oControl.addStyleClass("ssmsYellowFont");
					break;
				case "In progress":
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
			bBeforeSelect = oSessionModel.getData().visibility;
			sBeforeStatus = oSessionModel.getData().status;
		},

		onSendSession: function() {
			MessageToast.show("Will Send notification to supporter!");
		},

		onDeclineSession: function() {
			var sIdShow = this.byId("ssms-showVBox");
			var sIdEdit = this.byId("ssms-editVBox");
			var oInitModel = this.getView().getModel();
			var oData = oInitModel.getData();

			oData = this._oSupplier;
			oInitModel.setData(oData);
			iDelete = 0;
			sIdShow.setVisible(true);
			sIdEdit.setVisible(false);
		},

		onEditSession: function() {
			var sIdShow = this.byId("ssms-showVBox");
			var sIdEdit = this.byId("ssms-editVBox");

			if (sIdShow.getVisible()) {
				sIdShow.setVisible(false);
				sIdEdit.setVisible(true);
				iDelete = 0;
				this.byId("ssms-UploadCollection").addStyleClass("ssmsSessionDetail_Upload");
				this.addAttachment();
				this.checkDetailPermission();
				this.onCheckStatus();
				this._oSupplier = jQuery.extend({}, this.getView().getModel().getData());
				/*	$(".ssmsSessionDetail_Upload .sapMUCDeleteBtn").click(function() {
						var $deleteButton = $(this);
						var iFileIndex = $(".ssmsSessionDetail_Upload").index($deleteButton);
						//   var oUploadItem = oUploadColletion.getItems()[iFileIndex];
					});*/
			} else {
				this.onPressCreate();
				if (bEditVaild) {
					var oControl = this.getView().byId("ssms-Status");
					this._formatStateBackground(oControl, oControl.getText());
					this._getBeforeValue();
					this.addAttachment();
					this.checkDetailPermission();
					sIdEdit.setVisible(false);
					sIdShow.setVisible(true);
					
					this.getView().setBusy(false);

				}
				/*else {
					this._createConfirmDialog();
				}*/
			}

		},
		/*_createConfirmDialog: function() {
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
		},*/
		onCheckDate: function() {
			var dNowDate = new Date();
			var oDatePicker = this.byId("ssms-datetime");
			var dSelectedDate = oDatePicker.getDateValue();
			if (oDatePicker.getEnabled()) {
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
					bSupporterT = true;
				}
			} else {
				bDateValid = true;
				oDatePicker.setValueState(sap.ui.core.ValueState.None);
			}

		},
		onCheckTime: function() {
			bSupporterT = true;
		},

		onCheckStatus: function() {
			var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
			var oCategory = this.getView().byId("ssms-category");
			var oVisibility = this.getView().byId("ssms-radioBtn");
			var oMeetingRoom = this.getView().byId("ssms-meetingRoom");
			var oStatus = this.getView().byId("ssms-selectStatus");
			var oMeetingTime = this.getView().byId("ssms-datetime");
			var oTime = this.getView().byId("ssms-timepicker");
			var oDescription = this.getView().byId("ssms-description");
			oUploadCollection = this.getView().byId("ssms-UploadCollection");
			var oSummary = this.getView().byId("ssms-summary");
			// 			if (sBeforeStatus === "In progress") {
			// 				if (sStatus === "Cancelled") {
			// 					this.onSendSession();
			// 				}
			// 			}
			if (sStatus === "Closed") {
				oCategory.setEnabled(false);
				oMeetingRoom.setEnabled(false);
				oStatus.setEnabled(true);
				oMeetingTime.setEnabled(false);
				oTime.setEnabled(false);
				oDescription.setEnabled(false);
				oUploadCollection.setUploadEnabled(true);
				oSummary.setEnabled(true);
			}
			if (sStatus === "Open" || sStatus === "In progress") {
				this.setUserPermission(oModel.getData(), oSessionModel.getData());
				this.checkDetailPermission();
			}

			if (sStatus === "Cancelled") {
				oCategory.setEnabled(false);
				oVisibility.setEditable(false);
				oMeetingRoom.setEnabled(false);
				oStatus.setEnabled(true);
				oMeetingTime.setEnabled(false);
				oTime.setEnabled(false);
				oDescription.setEnabled(false);
				oUploadCollection.setUploadEnabled(false);
				oSummary.setEnabled(false);
			}

		},

		onCheckLocation: function() {
			var oLocation = this.byId("ssms-meetingRoom");
			var sValue = oLocation.getValue();
			if (oLocation.getEnabled()) {
				if (sValue === "") {
					bLocationVaild = false;
					oLocation.setValueState(sap.ui.core.ValueState.Error);
				} else {
					bLocationVaild = true;
					oLocation.setValueState(sap.ui.core.ValueState.None);
					bSupporterW = true;
				}
			} else {
				bLocationVaild = true;
				oLocation.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onCheckSummary: function() {
			var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
			var oSummary = this.getView().byId("ssms-summary");
			if (sStatus === "Closed") {
				var sValue = oSummary.getValue();
				if (sValue === "") {
					bSummaryVaild = false;
					oSummary.setValueState(sap.ui.core.ValueState.Error);
				} else {
					bSummaryVaild = true;
					oSummary.setValueState(sap.ui.core.ValueState.None);
				}

			} else {
				bSummaryVaild = true;
				oSummary.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onPressCreate: function() {
			/*	if (iPressCount === 0) {
					var oLocation = this.byId("ssms-meetingRoom");
					var oSummary = this.byId("ssms-summary");
					oLocation.fireChange();
					oSummary.fireChange();
					iPressCount++;
				}*/

			var oSessionData = this.byId("ssms-editVBox").getModel().getData();
			if (bSupporterT && bSupporterW) {
				if (oSessionData.status !== "In progress") {
					oSessionData.status = "In progress";
					this.byId("ssms-Status").setText("In progress");
				}
			}
			this.onCheckDate();
			this.onCheckLocation();
			this.onCheckSummary();
			if (bDateValid && bSummaryVaild && bLocationVaild) {
				var dDateTime = this.byId("ssms-datetime").getValue() + ", " + this.byId("ssms-timepicker").getValue();
				var meetingTime = new Date(dDateTime);
				this.byId("ssms-editdatatime").setText(meetingTime.toLocaleString());

				oSessionData.file = this.byId("ssms-UploadCollection").getItems().length;
				oSessionData.meetingTime = meetingTime;
				if (oSessionData.status === "Closed") {
					this.onSendSession();
				}
				//	this._showBusyIndicator();
				var bAttachment = this._checkDuplicateFile();

				
				if (!bAttachment) {
				    //this.getView().setBusy(true);
					var oSaveCollection = this.byId("ssms-UploadCollection");
					for (var i = 0; i < oFileModel.getData().length; i++) {
						for (var j = 0; j < iDelete; j++) {
							if (aDocumentId[j]) {
								if (oFileModel.getData()[i].fileId === aDocumentId[j]) {
									$.ajax({
										type: "DELETE",
										url: "/destinations/SSM_DEST/api/document/delete/" + aDocumentId[j],
										contentType: "application/json",
										success: function() {}
									});
								}
							}
						}
					}
					for (var k = 0; k < oSaveCollection.getItems().length; k++) {
						if (oSaveCollection.getItems()[k].getDocumentId()) {
							oSaveCollection.removeItem(oSaveCollection.getItems()[k]);
						}
					}
					oSaveCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + iSessionId);
					oSaveCollection.upload();
					
				// 	var that = this;
				// 	$.ajax({
				// 	    async: false,
				// 		type: "PUT",
				// 		url: "/destinations/SSM_DEST/api/session/" + iSessionId,
				// 		data: JSON.stringify(oSessionData),
				// 		dataType: "json",
				// 		contentType: "application/json",
				// 		success: function() {
				// 			MessageToast.show("Edit Success!");
				// 		}
				// 	});

					bEditVaild = true;
				}
			}
		},
		_checkDuplicateFile: function() {
			var mFiles = {};

			var i = oUploadCollection.getItems().length;

			while (i--) {
				if (!oUploadCollection.getItems()[i].getDocumentId()) {
					var oFileItem = oUploadCollection.getItems()[i];
					var sFileName = oFileItem.getFileName();

					if (!mFiles[sFileName]) {
						mFiles[sFileName] = true;
					} else {

						this._createFileConfirmDialog(oFileItem);

						return true;
					}
				}
			}

			return false;
		},

		/**
		 * @function
		 * @name _createFileConfirmDialog
		 * @description Show a confirm dialog to ask user delete the duplicate files automatically or himself.
		 */
		_createFileConfirmDialog: function(oFileItem) {
			var dialog = new Dialog({
				title: "Confirm",
				type: "Message",
				content: new Text({
					text: "There are some same files in the attachments. \nPress 'OK' to let the system deal with it(Can deal only one file of one time). \nPress 'Cancel' to delect duplicate files yourself."
				}),
				beginButton: new Button({
					text: "OK",
					press: function() {
						dialog.close();
						oUploadCollection.removeItem(oFileItem);
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						dialog.close();
					}
				})
			});

			dialog.open();
		}

	});

});