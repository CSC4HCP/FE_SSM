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
	 * @var {Object} oSessionUserModel The model of session owner's information.
	 * @var {Object} oJoinModel The model of joined person.
	 * @var {Object} oCommentModel The model of comments in session.
	 * @var {Integer} iSessionId The number of session's id.
	 * @var {Array} aDocumentId The array to record the deleted items' document id.
	 * @var {Integer} iDelete The number of deleted items.
	 * @var {Object} oUploadCollection The controller of uploadcollection in edit panel.
	 * @var {Integer} iMouseOver The number to control the mouseenter .
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
	var oSessionUserModel;
	var oJoinModel;
	var oCommentModel;
	var iSessionId;
	var aDocumentId = [];
	var iDelete = 0;
	var oUploadCollection;
	var iMouseOver = 0;
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
		 * @event
		 * @name onAfterRendering
		 * @description Called after a controller is rendered. Mainly set mouseenter and mouseleave event.
		 * @memberOf ssms.view.SessionDetail
		 */
		onAfterRendering: function() {
			var oItemList = this.getView().byId("ssms-commentList");
			for (var i = 0; i < oItemList.getItems().length; i++) {
				this._attachEvent(oItemList.getItems()[i]);
			}
		},
		
		/**
		 * @function
		 * @name _onRouteMatched
		 * @description Event handler for getting the session id, then set session detail model and set page.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		_onRouteMatched: function(oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			iSessionId = oArgs.id;
			oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("/destinations/SSM_DEST/api/session/" + iSessionId, null, false);
			this.getView().setModel(oSessionModel);

			oSessionUserModel = new sap.ui.model.json.JSONModel();
			oSessionUserModel.loadData("/destinations/SSM_DEST/api/user/" + oSessionModel.getData().owner, null, false);
			this.getView().setModel(oSessionUserModel, "OwnerModel");

			var oControl = this.getView().byId("ssms-Status");
			this._formatStateColor(oControl, oControl.getText());

			this.getUserRole(oModel.getData());
		},

		/**
		 * @function
		 * @name getUserRole
		 * @description Get user's role then set the sUserRole.
		 * @param {Object} oUserData - User information got from the userAPI
		 */
		getUserRole: function(oUserData) {
			var that = this;
			that.getView().setBusy(true);
			$.ajax({
				async: false,
				type: "GET",
				url: "/destinations/SSM_DEST/api/user/" + oUserData.name,
				contentType: "application/json",
				success: function(user) {
					sUserRole = user.role;
					that._getBeforeValue();
					that.setUserPermission(oModel.getData(), oSessionModel.getData());
					that.addAttachment();
					that.addJoinedPerson();
					that.addConmment();
					that.getView().setBusy(false);
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
					this.checkOwnerPermission();
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
					this.checkSupporterAndOtherPermission();
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
					this.checkOwnerPermission();
				}
			} else {
				oEditBtn.setVisible(false);
				this.checkSupporterAndOtherPermission();
			}

		},

		/**
		 * @function
		 * @name addJoinedPerson
		 * @description Add Joined Person in Joined list.
		 */
		addJoinedPerson: function() {
			oJoinModel = new sap.ui.model.json.JSONModel();
			oJoinModel.loadData("/destinations/SSM_DEST/api/joined?session=" + iSessionId, null, false);
			this.getView().setModel(oJoinModel, "JoinModel");

			var oText = this.getView().byId("ssms-joinedperson");
			oText.setText("");
			var sTextContent = "";
			for (var i = 0; i < oJoinModel.getData().length; i++) {
				sTextContent += oJoinModel.getData()[i].userId + "; ";
			}
			oText.setText(sTextContent);
		},

		/**
		 * @function
		 * @name addConmment
		 * @description Add comment in comment list.
		 */
		addConmment: function() {
			oCommentModel = new sap.ui.model.json.JSONModel();
			oCommentModel.loadData("/destinations/SSM_DEST/api/comment?session=" + iSessionId, null, false);
			this.getView().setModel(oCommentModel, "CommentModel");
		},

		/**
		 * @function
		 * @name addAttachment
		 * @description Add attachment in both detail view's and edit view's UploadCollection.
		 */
		addAttachment: function() {
			oFileModel = new sap.ui.model.json.JSONModel();
			oFileModel.loadData("/destinations/SSM_DEST/api/document/file/" + iSessionId, null, false);
			this.getView().setModel(oFileModel, "FileModel");
			var data = oFileModel.getData();
			var oShowCollection = this.byId("ssms-document");
			var oEditCollection = this.byId("ssms-UploadCollection");
			var oShowTitle = this.byId("ssms-attachmentTitle");
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
				oShowTitle.setText("Uploaded (" + data.length + ")");
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
				if (!bOwner) {
					iEditItems.setEnableDelete(false);
					iEditItems.setVisibleDelete(false);
				}
				oEditCollection.addItem(iEditItems);
			}
		},

		/**
		 * @function
		 * @name onDownloadAttachment
		 * @description Download the selected items.
		 */
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

		/**
		 * @function
		 * @name onFileDeleted
		 * @description Recording the items which chosed to be deleted in array aDocumentId.
		 */
		onFileDeleted: function(oEvent) {
			var oDeleteUploadCollection = oEvent.getParameters();
			aDocumentId[iDelete] = oDeleteUploadCollection.documentId;
			iDelete++;
		},

		/**
		 * @function
		 * @name onUploadComplete
		 * @description While attachment upload complete, show the detail view.
		 */
		onUploadComplete: function() {
			MessageToast.show("Upload Complete!");
			this.getView().setBusy(false);
			bEditVaild = true;
			this.onShowDetail();
		},

		/**
		 * @function
		 * @name onShowDetail
		 * @description Show the detail view, and reset page.
		 */
		onShowDetail: function() {
			if (bEditVaild) {
				var oIdShow = this.byId("ssms-showVBox");
				var oIdEdit = this.byId("ssms-editVBox");
				var oControl = this.getView().byId("ssms-Status");
				this._formatStateColor(oControl, oControl.getText());
				this._getBeforeValue();
				this.addAttachment();
				this.setUserPermission(oModel.getData(), oSessionModel.getData());
				oIdEdit.setVisible(false);
				oIdShow.setVisible(true);
			}
		},

		/**
		 * @function
		 * @name onSelectionChange
		 * @description If there's any item selected in detail view's UploadCollection, set download button enabled.
		 */
		onSelectionChange: function() {
			var oShowUploadCollection = this.getView().byId("ssms-document");
			if (oShowUploadCollection.getSelectedItems().length > 0) {
				this.getView().byId("ssms-downloadButton").setEnabled(true);
			} else {
				this.getView().byId("ssms-downloadButton").setEnabled(false);
			}
		},
		
		/**
		 * @function
		 * @name checkOwnerPermission
		 * @description Set owner permission by visibility and status.
		 */
		checkOwnerPermission: function() {
			var oEditBtn = this.getView().byId("ssms-editBtn");
			var oSendBtn = this.getView().byId("ssms-sendBtn");
			var oComment = this.getView().byId("ssms-comment");
			var oJoin = this.getView().byId("ssms-join");
			
			oJoin.setVisible(false);

			if (sBeforeStatus === "Open") {
				if (!bBeforeSelect) {
				this.byId("ssms-private").setSelected(true);
				this.byId("ssms-private").setEditable(true);
				oSendBtn.setEnabled(false);
				oComment.setEnabled(false);
			} else {
				this.byId("ssms-private").setEditable(false);
				oSendBtn.setEnabled(true);
				oComment.setEnabled(true);
			}
				oEditBtn.setEnabled(true);
				this.byId("ssms-open").setEnabled(true);
				this.byId("ssms-inprogress").setEnabled(false);
				this.byId("ssms-closed").setEnabled(false);
				this.byId("ssms-cancelled").setEnabled(true);
				this.byId("ssms-location").removeStyleClass("ssmsfailure");
				this.byId("ssms-editdatatime").removeStyleClass("ssmsfailure");
			}
			if (sBeforeStatus === "In Progress") {
				oSendBtn.setEnabled(false);
				oEditBtn.setEnabled(true);
				oComment.setEnabled(true);
				this.byId("ssms-open").setEnabled(false);
				this.byId("ssms-inprogress").setEnabled(true);
				this.byId("ssms-closed").setEnabled(true);
				this.byId("ssms-cancelled").setEnabled(true);
				this.byId("ssms-radioBtn").setEditable(false);
			}
			if (sBeforeStatus === "Completed") {
				oEditBtn.setEnabled(false);
				oSendBtn.setEnabled(false);
				oComment.setEnabled(true);
			}
			if (sBeforeStatus === "Cancelled") {
				oEditBtn.setEnabled(false);
				oSendBtn.setEnabled(false);
				oComment.setEnabled(false);
				this.byId("ssms-location").addStyleClass("ssmsfailure");
				this.byId("ssms-editdatatime").addStyleClass("ssmsfailure");
			}
		},
		
		/**
		 * @function
		 * @name checkSupporterPermission
		 * @description Set supporter and other person permission.
		 */
		checkSupporterAndOtherPermission: function() {
			var oEditBtn = this.getView().byId("ssms-editBtn");
			var oSendBtn = this.getView().byId("ssms-sendBtn");
			var oJoin = this.getView().byId("ssms-join");
			var oComment = this.getView().byId("ssms-comment");
			var bJoinBtn = true;
			
			oSendBtn.setVisible(false);
			if (sBeforeStatus === "Open") {
				oComment.setEnabled(true);
				oEditBtn.setEnabled(true);
				this.byId("ssms-location").removeStyleClass("ssmsfailure");
				this.byId("ssms-editdatatime").removeStyleClass("ssmsfailure");
			}
			if (sBeforeStatus === "In Progress") {
				oEditBtn.setEnabled(true);
				oComment.setEnabled(true);
			}
			if (sBeforeStatus === "Completed") {
				oEditBtn.setEnabled(false);
				bJoinBtn = false;
				oComment.setEnabled(true);
			}
			if (sBeforeStatus === "Cancelled") {
				bJoinBtn = false;
				oEditBtn.setEnabled(false);
				oComment.setEnabled(false);
				this.byId("ssms-location").addStyleClass("ssmsfailure");
				this.byId("ssms-editdatatime").addStyleClass("ssmsfailure");
			}
			var dNow = new Date();
			var dMeetingTime = new Date(oSessionModel.getData().meetingTime);
			if (dNow.getMonth() === dMeetingTime.getMonth() && dNow.getFullYear() === dMeetingTime.getFullYear()) {
				if ((dNow.getDate() + 1) >= dMeetingTime.getDate()) {
					bJoinBtn = false;
				}
			}
			oJoin.setEnabled(bJoinBtn);
		},

		/**
		 * @function
		 * @name _formatStateColor
		 * @description Set status fon color in detail view.
		 */
		_formatStateColor: function(oControl, sText) {
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
				case "Completed":
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

		/**
		 * @function
		 * @name _getBeforeValue
		 * @description Get session's visibility and status from sessionAPI.
		 */
		_getBeforeValue: function() {
			bBeforeSelect = oSessionModel.getData().visibility;
			sBeforeStatus = oSessionModel.getData().status;
		},

		/**
		 * @function
		 * @name onSendSession
		 * @description Send notification to supporter.
		 */
		onSendSession: function() {
			MessageToast.show("Will Send notification to supporter!");
			var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
			var sContent = "";
			var sTarget = "I326960";
			var sChecked = "false";
			if (sBeforeStatus === "Open" && sStatus === "Open" && bBeforeSelect === true) {
				sContent = "To supporter:\n Please modify the session '" + oSessionModel.getData().topic + "' location and time.";
				$.ajax({
					type: "POST",
					url: "/destinations/SSM_DEST/api/notify",
					data: JSON.stringify({
						target: sTarget,
						content: sContent,
						checked: sChecked
					}),
					dataType: "json",
					contentType: "application/json",
					success: function(oNotification) {
						console.log(oNotification.id);
					}
				});

			}
			if (sBeforeStatus === "Open" && sStatus === "In Progress") {
				var dDateTime = this.byId("ssms-datetime").getValue() + ", " + this.byId("ssms-timepicker").getValue();
				var meetingTime = new Date(dDateTime);
				var oLocation = this.byId("ssms-meetingRoom");
				sContent = "The session '" + oSessionModel.getData().topic + "' will start in " + meetingTime + " at " + oLocation + ".";
				$.ajax({
					type: "POST",
					url: "/destinations/SSM_DEST/api/notify",
					data: JSON.stringify({
						target: sTarget,
						content: sContent,
						checked: sChecked
					}),
					dataType: "json",
					contentType: "application/json",
					success: function(oNotification) {
						console.log(oNotification.id);
					}
				});
				$.ajax({
					type: "POST",
					url: "/destinations/SSM_DEST/api/notify",
					data: JSON.stringify({
						target: oModel.name,
						content: sContent,
						checked: sChecked
					}),
					dataType: "json",
					contentType: "application/json",
					success: function(oNotification) {
						console.log(oNotification.id);
					}
				});
			}
			if (sBeforeStatus === "In Progress" && sStatus === "Cancelled") {
				sContent = "User " + oModel.displayName + " closed the session '" + oSessionModel.getData().topic + "', please check it.";
				$.ajax({
					type: "POST",
					url: "/destinations/SSM_DEST/api/notify",
					data: JSON.stringify({
						target: sTarget,
						content: sContent,
						checked: sChecked
					}),
					dataType: "json",
					contentType: "application/json",
					success: function(oNotification) {
						console.log(oNotification.id);
					}
				});
			}
		},

		/**
		 * @function
		 * @name onDeclineSession
		 * @description Exit the edit view without saving the changes.
		 */
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

		/**
		 * @function
		 * @name onEditSession
		 * @description Change view between detail view and edit view. If change from detail to edit, check status and save detail page data, then change view. If change from edit to detail, event handled to save all the change. 
		 */
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
				this.setUserPermission(oModel.getData(), oSessionModel.getData());
				this._oSupplier = jQuery.extend({}, this.getView().getModel().getData());
			} else {
				this.onPressCreate();
			}

		},

		/**
		 * @function
		 * @name onCheckDate
		 * @description Event handler for checking date validation. If its value is ealier than today, show message.
		 */
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

		/**
		 * @function
		 * @name onCheckTime
		 * @description Checking time change. If its time input is change, set bSupporterT true.
		 */
		onCheckTime: function() {
			bSupporterT = true;
		},

		/**
		 * @function
		 * @name onCheckStatus
		 * @description Checking the status, if the status change in edit view, other inputs permission will be changed.
		 */
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
			if (sStatus === "Completed") {
				oCategory.setEnabled(false);
				oMeetingRoom.setEnabled(false);
				oStatus.setEnabled(true);
				oMeetingTime.setEnabled(false);
				oTime.setEnabled(false);
				oDescription.setEnabled(false);
				oUploadCollection.setUploadEnabled(true);
				oSummary.setEnabled(true);
			}
			if (sStatus === "Open" || sStatus === "In Progress") {
				oCategory.setEnabled(true);
				oMeetingRoom.setEnabled(false);
				oStatus.setEnabled(true);
				oMeetingTime.setEnabled(false);
				oTime.setEnabled(false);
				oDescription.setEnabled(true);
				oUploadCollection.setUploadEnabled(true);
				oSummary.setEnabled(true);
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

		/**
		 * @function
		 * @name onCheckLocation
		 * @description Checking the location input, if user role is supporter, location cannot be empty.
		 */
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

		/**
		 * @function
		 * @name onCheckSummary
		 * @description Checking the summary input, if change status to 'Completed', summary cannot be empty.
		 */
		onCheckSummary: function() {
			var sStatus = this.getView().byId("ssms-selectStatus").getSelectedKey();
			var oSummary = this.getView().byId("ssms-summary");
			if (sStatus === "Completed") {
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

		/**
		 * @function
		 * @name onPressCreate
		 * @description Save session detail page data.
		 */
		onPressCreate: function() {
			var oSessionData = this.byId("ssms-editVBox").getModel().getData();
			if (bSupporterT && bSupporterW) {
				if (oSessionData.status !== "In Progress") {
					oSessionData.status = "In Progress";
					this.byId("ssms-Status").setText("In Progress");
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
				var bAttachment = this._checkDuplicateFile();

				if (!bAttachment) {
					this.getView().setBusy(true);

					this.onSendSession();
					var oSaveCollection = this.byId("ssms-UploadCollection");
					var iFileLength = oSaveCollection.getItems().length;

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
					for (var k = 0; k < iFileLength; k++) {
						if (oSaveCollection.getItems()[iRemoveId].getDocumentId()) {
							oSaveCollection.removeItem(oSaveCollection.getItems()[iRemoveId]);
						} else {
							iRemoveId++;
						}
					}

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

		/**
		 * @function
		 * @name _checkDuplicateFile
		 * @description Check whether there is any duplicate file.
		 * @return {Boolean} If true, there are at least two same files.
		 */
		_checkDuplicateFile: function() {
			var mFiles = {};

			var i = oUploadCollection.getItems().length;

			while (i--) {
				var oFileItem = oUploadCollection.getItems()[i];
				var sFileName = oFileItem.getFileName();

				if (!mFiles[sFileName]) {
					mFiles[sFileName] = true;
				} else {
					this._createFileConfirmDialog(oFileItem);

					return true;
				}
			}

			return false;
		},

		/**
		 * @function
		 * @name _createFileConfirmDialog
		 * @description Show a confirm dialog to ask user delete the duplicate files automatically or himself.
		 * @param {Object} oFileItem - The duplication file which asked to be deleted.
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
		},

		/**
		 * @function
		 * @name onJoinPress
		 * @description Add current user into session.
		 */
		onJoinPress: function() {
			var oJoin = this.getView().byId("ssms-joinpage");
			//	var oErrorJoin = this.getView().byId("ssms-errorJoin");
			var that = this;
			var bRepeatJoin = true;
			for (var i = 0; i < oJoinModel.getData().length; i++) {
				if (oJoinModel.getData()[i].userId === oModel.getData().displayName) {
					bRepeatJoin = false;
				}
			}
			if (bRepeatJoin) {
				oJoin.setBusy(true);
				//		oErrorJoin.setVisible(false);
				$.ajax({
					async: false,
					type: "POST",
					url: "/destinations/SSM_DEST/api/joined",
					data: JSON.stringify({
						userId: oModel.getData().displayName,
						session: iSessionId,
						date: Date.parse(new Date())
					}),
					dataType: "json",
					contentType: "application/json",
					success: function() {
						that.addJoinedPerson();
						oJoin.setBusy(false);
					}
				});
			} else {
				var dJoinDialog = new Dialog({
					title: "Error",
					type: "Message",
					state: "Error",
					content: new Text({
						text: "You had joined this session!"
					}),
					beginButton: new Button({
						text: "OK",
						press: function() {
							dJoinDialog.close();
						}
					}),
					afterClose: function() {
						dJoinDialog.destroy();
					}
				});

				dJoinDialog.open();
			}
		},

		/**
		 * @function
		 * @name onAddComment
		 * @description Add comment by user into session.
		 */
		onAddComment: function() {
			var oForm = new sap.ui.layout.form.SimpleForm({
				layout: sap.ui.layout.form.SimpleFormLayout.GridLayout,
				editable: true,
				content: [
					new sap.m.Label({
						text: this.getResourceBundle().getText("OBJECTPAGESECTION_SESSIONDETAIL_DIALOG_AUTHOR"),
						design: "Bold"
					}),
					new sap.m.Text({
						text: oModel.getData().displayName,
						design: "Bold"
					}),
					new sap.m.Label({
						text: this.getResourceBundle().getText("OBJECTPAGESECTION_SESSIONDETAIL_DIALOG_COMMENT"),
						design: "Bold"
					}),
					new sap.m.TextArea({
						id: "ssms-commentcontent",
						width: "100%",
						rows: 5
					})
				]
			});
			var that = this;
			var dAddComment = new Dialog({
				title: "Add Comment",
				type: "Message",
				contentWidth: "700px",
				content: oForm,
				beginButton: new Button({
					text: "Submit",
					type: "Accept",
					press: function() {
						var sText = sap.ui.getCore().byId("ssms-commentcontent").getValue();
						if (sText) {
							sap.ui.getCore().byId("ssms-commentcontent").setValueState(sap.ui.core.ValueState.None);
							$.ajax({
								async: false,
								type: "POST",
								url: "/destinations/SSM_DEST/api/comment",
								data: JSON.stringify({
									author: oModel.getData().displayName,
									session: iSessionId,
									content: sText,
									date: Date.parse(new Date())
								}),
								dataType: "json",
								contentType: "application/json",
								success: function() {
									that.addConmment();
									var oItem = that.getView().byId("ssms-commentList").getItems();
									that._attachEvent(oItem[oItem.length - 1]);
									dAddComment.close();
								}
							});
						} else {
							sap.ui.getCore().byId("ssms-commentcontent").setValueState(sap.ui.core.ValueState.Error);
						}

					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						dAddComment.close();
					}
				}),
				afterClose: function() {
					dAddComment.destroy();
				}
			});

			dAddComment.open();
		},

		/**
		 * @function
		 * @name onEditComment
		 * @description Edit comment by user into session.
		 */
		onEditComment: function(oEvent) {
			var sInfo = oEvent.getSource().getInfo();
			var iId = parseInt(sInfo.substring(sInfo.indexOf(":") + 2));
			var iNum;
			for (var i = 0; i < oCommentModel.getData().length; i++) {
				if (oCommentModel.getData()[i].id === iId) {
					iNum = i;
				}
			}
			var oEditForm = new sap.ui.layout.form.SimpleForm({
				layout: sap.ui.layout.form.SimpleFormLayout.GridLayout,
				editable: true,
				content: [
					new sap.m.Label({
						text: this.getResourceBundle().getText("OBJECTPAGESECTION_SESSIONDETAIL_DIALOG_AUTHOR"),
						design: "Bold"
					}),
					new sap.m.Text({
						text: oCommentModel.getData()[iNum].author,
						design: "Bold"
					}),
					new sap.m.Label({
						text: this.getResourceBundle().getText("OBJECTPAGESECTION_SESSIONDETAIL_DIALOG_CREATED"),
						design: "Bold"
					}),
					new sap.m.Text({
						text: new Date(oCommentModel.getData()[iNum].date).toLocaleDateString(),
						design: "Bold"
					}),
					new sap.m.Label({
						text: this.getResourceBundle().getText("OBJECTPAGESECTION_SESSIONDETAIL_DIALOG_COMMENT"),
						design: "Bold"
					}),
					new sap.m.TextArea({
						id: "ssms-commentcontent",
						width: "100%",
						value: oCommentModel.getData()[iNum].content,
						rows: 5
					})
				]
			});
			var that = this;
			var dEditComment = new Dialog({
				title: "Edit Comment",
				type: "Message",
				contentWidth: "700px",
				content: oEditForm,
				beginButton: new Button({
					text: "Submit",
					type: "Accept",
					press: function() {
						var sText = sap.ui.getCore().byId("ssms-commentcontent").getValue();
						if (sText) {
							sap.ui.getCore().byId("ssms-commentcontent").setValueState(sap.ui.core.ValueState.None);
							$.ajax({
								async: false,
								type: "PUT",
								url: "/destinations/SSM_DEST/api/comment/" + iId,
								data: JSON.stringify({
									id: iId,
									author: oCommentModel.getData()[iNum].author,
									session: iSessionId,
									content: sText,
									date: oCommentModel.getData()[iNum].date
								}),
								dataType: "json",
								contentType: "application/json",
								success: function() {
									that.addConmment();
									dEditComment.close();
								}
							});
						} else {
							sap.ui.getCore().byId("ssms-commentcontent").setValueState(sap.ui.core.ValueState.Error);
						}

					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						dEditComment.close();
					}
				}),
				afterClose: function() {
					dEditComment.destroy();
				}
			});

			dEditComment.open();
		},

		/**
		 * @function
		 * @name _attachEvent
		 * @description Event handler when click on the box. Will go to the next view.
		 * @param {Object} oItem - The Items which is mouse overed.
		 */
		_attachEvent: function(oItem) {
			var that = this;

			oItem.attachBrowserEvent("mouseenter", function() {
				if (oItem.getSender() === oModel.getData().displayName) {
					if (oItem.getType() !== "Detail") {
						if (iMouseOver === 0) {
							oItem.setType("Detail");
							iMouseOver++;
						} else {
							var oItemList = that.getView().byId("ssms-commentList");
							for (var j = 0; j < oItemList.getItems().length; j++) {
								oItemList.getItems()[j].setType("Inactive");
							}
							iMouseOver = 0;
							oItem.setType("Detail");
							iMouseOver++;
						}
					}
				} else {
					oItem.setType("Inactive");
				}
			});
			oItem.attachBrowserEvent("mouseleave", function() {
				if (oItem.getSender() === oModel.getData().displayName) {
					if (oItem.getType() === "Detail") {
						oItem.setType("Inactive");
						iMouseOver--;
					}
					if (iMouseOver > 0) {
						var oItemList = that.getView().byId("ssms-commentList");
						for (var j = 0; j < oItemList.getItems().length; j++) {
							oItemList.getItems()[j].setType("Inactive");
						}
						iMouseOver = 0;
					}
				}
			});
		}

	});

});
