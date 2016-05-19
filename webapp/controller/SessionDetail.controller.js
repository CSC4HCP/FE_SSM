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

	/**
	 * @private
	 * @description Some specified variables of this controller. Can't be access out of this controller.
	 * @var {String} sUserRole the string of user's permission role.
	 * @var {Boolean} bOwner Whether the access user is the owner.
	 * @var {Boolean} bBeforeSelect Whether the value of session's visibility.
	 * @var {String} sBeforeStatus The value of session's status.
	 * @var {Boolean} bDateValid Whether the value of date picker is valid.
	 * @var {Boolean} bSummaryVaild Whether the value of summary textarea is valid.
	 * @var {Boolean} bLocationVaild Whether the value of location textarea is valid.
	 * @var {Boolean} bEditVaild Whether the value of upload is valid.
	 * @var {Boolean} bSupporterW Whether the supporter modify the location textarea.
	 * @var {Boolean} bSupporterT Whether the supporter modify the data & time picker.
	 * @var {Object} oModel The model of user information.
	 * @var {Object} oSessionModel The model of session detail.
	 * @var {Object} oFileModel The model of attachment.
	 * @var {Integer} iSessionId The number of session's id.
	 * @var {Array} aDocumentId The array to record the deleted items' document id.
	 * @var {Integer} iDelete The number of deleted items.
	 * @var {Object} oUploadCollection The controller of uploadcollection in edit panel.
	 * 
	 */
	var sUserRole;
	var bOwner = false;
	var bBeforeSelect;
	var sBeforeStatus;
	var bDateValid = false;
	var bSummaryVaild = false;
	var bLocationVaild = false;
	var bEditVaild = false;
	var bSupporterW = false;
	var bSupporterT = false;
	var oModel;
	var oSessionModel;
	var oFileModel;
	var iSessionId;
	var aDocumentId = [];
	var iDelete = 0;
	var oUploadCollection;
	return BaseController.extend("ssms.controller.SessionDetail", {
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set user model.
		 * @memberOf ssms.view.SessionDetail
		 */
		onInit: function() {
			oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");

			var oRouter = this.getRouter();
			oRouter.getRoute("sessionDetail").attachMatched(this._onRouteMatched, this);

		},

		/**
		 * @function
		 * @name _onRouteMatched
		 * @description Event handler for getting the session id, then  set session detail model and set page.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
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
			
			this.getUserRole(oModel.getData());
			this.setUserPermission(oModel.getData(), oSessionModel.getData());
			this.addAttachment();
			this._getBeforeValue();
			this.checkDetailPermission();
		},

		/**
		 * @function
		 * @name getUserRole
		 * @description Get user's role then set the sUserRole.
		 * @param {Object} oUserData - User information got from the userAPI
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

		/**
		 * @function
		 * @name setUserPermission
		 * @description Set user's permission by user's role.
		 * @param {Object} oUserData - User information got from the userAPI
		 * @param {Object} oSessionData - Session information got from the sessionAPI
		 */
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
		
		/**
		 * @function
		 * @name addAttachment
		 * @description Set user's permission by user's role.
		 * @param {Object} oUserData - User information got from the userAPI
		 * @param {Object} oSessionData - Session information got from the sessionAPI
		 */
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
					enableEdit: false,
					enableDelete: true,
					visibleDelete: true,
					visibleEdit: false
				});
				if(!bOwner){
				    iEditItems.setEnableDelete(false);
				    iEditItems.setVisibleDelete(false);
				}
				oEditCollection.addItem(iEditItems);
			}
		},

		onDownloadAttachment: function() {
			var oShowUploadCollection = this.getView().byId("ssms-document");
			var aSelectedItems = oShowUploadCollection.getSelectedItems();
			if (aSelectedItems) {
				for (var i = 0; i < aSelectedItems.length; i++) {
					var sUrl = "/destinations/SSM_DEST/api/document/download/" + aSelectedItems[i].getDocumentId();
					aSelectedItems[i].setUrl(sUrl);
					oShowUploadCollection.downloadItem(aSelectedItems[i], true);
					aSelectedItems[i].setUrl("");
				}
			} else {
				MessageToast.show("Select an item to download");
			}
		},
		onFileDeleted: function(oEvent) {
			var oDeleteUploadCollection = oEvent.getParameters();
			aDocumentId[iDelete] = oDeleteUploadCollection.documentId;
			iDelete++;
		},
		/*
				onBeforeUploadStarts: function() {
					MessageToast.show("Upload Strat!");
				},
				onChange: function() {
					MessageToast.show("change!");
				},*/
		onUploadComplete: function() {
			MessageToast.show("Upload Complete!");
			this.getView().setBusy(false);
			bEditVaild = true;
			this.onShowDetail();
		},
		onShowDetail: function() {
			if (bEditVaild) {
				var oIdShow = this.byId("ssms-showVBox");
				var oIdEdit = this.byId("ssms-editVBox");
				var oControl = this.getView().byId("ssms-Status");
				this._formatStateBackground(oControl, oControl.getText());
				this._getBeforeValue();
				this.addAttachment();
				this.checkDetailPermission();
				oIdEdit.setVisible(false);
				//this.showBusyIndicator(4000, 0);
				oIdShow.setVisible(true);
			}
		},
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
			var oIdShow = this.byId("ssms-showVBox");
			var oIdEdit = this.byId("ssms-editVBox");
			var oInitModel = this.getView().getModel();
			var oData = oInitModel.getData();

			oData = this._oSupplier;
			oInitModel.setData(oData);
			iDelete = 0;
			bEditVaild = false;
			oIdShow.setVisible(true);
			oIdEdit.setVisible(false);
		},

		onEditSession: function() {
			var oIdShow = this.byId("ssms-showVBox");
			var oIdEdit = this.byId("ssms-editVBox");

			if (oIdShow.getVisible()) {
				oIdShow.setVisible(false);
				oIdEdit.setVisible(true);
				iDelete = 0;
				bEditVaild = false;
				this.byId("ssms-UploadCollection").addStyleClass("ssmsSessionDetail_Upload");
				this.addAttachment();
				this.checkDetailPermission();
				this.onCheckStatus();
				this._oSupplier = jQuery.extend({}, this.getView().getModel().getData());
			} else {
				this.onPressCreate();
				
				/*if (bEditVaild) {
					var oControl = this.getView().byId("ssms-Status");
					this._formatStateBackground(oControl, oControl.getText());
					this._getBeforeValue();
					this.addAttachment();
					this.checkDetailPermission();
					oIdEdit.setVisible(false);
				//	this.showBusyIndicator(4000, 0);
					oIdShow.setVisible(true);

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

				oSessionData.meetingTime = meetingTime;
				if (oSessionData.status === "Closed") {
					this.onSendSession();
				}
				var bAttachment = this._checkDuplicateFile();

				if (!bAttachment) {
					this.getView().setBusy(true);
					var oSaveCollection = this.byId("ssms-UploadCollection");
					oSessionData.file = oSaveCollection.getItems().length;

					for (var i = 0; i < oFileModel.getData().length; i++) {
						for (var j = 0; j < iDelete; j++) {
							if (aDocumentId[j]) {
								if (oFileModel.getData()[i].fileId === aDocumentId[j]) {
									$.ajax({
										type: "DELETE",
										url: "/destinations/SSM_DEST/api/document/delete/" + aDocumentId[j],
										contentType: "application/json"
									});
								}
							}
						}
					}
					var iRemoveId = 0;
					for (var k = 0; k < oSessionData.file; k++) {
						if (oSaveCollection.getItems()[iRemoveId].getDocumentId()) {
							oSaveCollection.removeItem(oSaveCollection.getItems()[iRemoveId]);
						} else {
							iRemoveId++;
						}
					}
					//oSaveCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + iSessionId);
					//oSaveCollection.upload();

					//	var that = this;
					$.ajax({
						async: false,
						type: "PUT",
						url: "/destinations/SSM_DEST/api/session/" + iSessionId,
						data: JSON.stringify(oSessionData),
						dataType: "json",
						contentType: "application/json"
					});
					if (oSaveCollection.getItems().length > 0) {
						oSaveCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + iSessionId);
						oSaveCollection.upload();
					} else {
						this.getView().setBusy(false);
						bEditVaild = true;
						MessageToast.show("Edit Success!");
						this.onShowDetail();
					}

				}
			}
		},
		_checkDuplicateFile: function() {
			var mFiles = {};

			var i = oUploadCollection.getItems().length;

			while (i--) {
				//if (!oUploadCollection.getItems()[i].getDocumentId()) {
				var oFileItem = oUploadCollection.getItems()[i];
				var sFileName = oFileItem.getFileName();

				if (!mFiles[sFileName]) {
					mFiles[sFileName] = true;
				} else {
					this._createFileConfirmDialog(oFileItem);

					return true;
				}
				//}
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