sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/Text",
	"sap/m/Button"
], function(BaseController, MessageToast, Dialog, Text, Button) {
	"use strict";

	/**
	 * @private
	 * @description Some specified variables of this controller. Can't be access out of this controller.
	 * @var {Boolean} bTopicValid Whether the value of date input is valid
	 * @var {Boolean} bDateValid Whether the value of date picker is valid
	 * @var {Integer} iPressCount The number of press event triggered for Create Button
	 */
	var bTopicValid = false;
	var bDateValid = false;
	var iPressCount = 0;

	return BaseController.extend("ssms.controller.CreateSession", {
		/**
		 * @var {sap.m.UploadCollection} The UploadCollection Control
		 */
		_oUploadCollection: null,
		/**
		 * @var {sap.m.UploadCollectionItem} The UploadCollectionIttem Control, the duplicate file to be deleted
		 */
		_oFileToDelete: null,
		/**
		 * @var {sap.m.Dialog} The Dialog Control, show to confirm operation on duplicate file
		 */
		_oDialog: null,
		/**
		 * @var {String} Returned ID of the new created session
		 */
		_iSessionId: 0,
		/**
		 * @var {String} Returned ID of setTimeout function
		 */
		_sTimeoutId: "",
		/**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.CreateSession
		 */
		onInit: function() {
			var oUserModel = this.getUserModel();
			this.getView().setModel(oUserModel, "UserModel");
			
			var oRouter = this.getRouter();
			oRouter.getRoute("createSession").attachMatched(this._onRouteMatched, this);

			this.getView().setBusy(false);
			this._oUploadCollection = this.byId("uploadCollection");
		},

		/**
		 * @function
		 * @name onCheckTopic
		 * @description Event handler for checking topic validation. If its value is empty, show message.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onCheckTopic: function(oEvent) {
			var oTopicInput = oEvent.getSource();
			var sValue = oEvent.getSource().getValue();

			if (sValue === "") {
				bTopicValid = false;
				oTopicInput.setValueState(sap.ui.core.ValueState.Error);
			} else {
				bTopicValid = true;
				oTopicInput.setValueState(sap.ui.core.ValueState.None);
			}
		},
		/**
		 * @function
		 * @name onCheckDate
		 * @description Event handler for checking date validation. If its value is empty or is ealier than today, show message.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onCheckDate: function(oEvent) {
			var dNowDate = new Date();
			var oDatePicker = oEvent.getSource();
			var dSelectedDate = oDatePicker.getDateValue();
			var bValid = oEvent.getParameter("valid");

			if (!bValid) {
				this.byId("dateErrorMsg").setVisible(false);
				bDateValid = false;
				oDatePicker.setValueState(sap.ui.core.ValueState.Error);
			} else {
				if (dSelectedDate <= dNowDate) {
					this.byId("dateErrorMsg").setVisible(true);
					bDateValid = false;
					oDatePicker.setValueState(sap.ui.core.ValueState.Error);
				} else {
					this.byId("dateErrorMsg").setVisible(false);
					bDateValid = true;
					oDatePicker.setValueState(sap.ui.core.ValueState.None);
				}
			}
		},

		/**
		 * @function
		 * @name onPressCreate
		 * @description Event handler when click the Create Button.
		 */
		onPressCreate: function() {
			if (iPressCount === 0) {
				var oTopicInput = this.byId("topic");
				var oPlannedTime = this.byId("date");

				oTopicInput.fireChange();
				oPlannedTime.fireChange({
					value: oPlannedTime.getValue(),
					valid: bDateValid
				});
				iPressCount++;
			}

			if (bTopicValid && bDateValid) {
				var oSessionData = this.byId("session").getModel().getData();

				if (!this._checkDuplicateFile()) {
					var that = this;

					oSessionData.file = this._oUploadCollection.getItems().length;
					this.getView().setBusy(true);
					$.ajax({
						type: "POST",
						url: "/destinations/SSM_DEST/api/session",
						data: JSON.stringify(oSessionData),
						dataType: "json",
						contentType: "application/json",
						success: function(session) {
							that._iSessionId = session.id;

							if (oSessionData.file > 0) {
								that._oUploadCollection.setUploadUrl("/destinations/SSM_DEST/api/document/upload/" + that._iSessionId);
								that._oUploadCollection.upload();
							} else {
								that.getView().setBusy(false);
								MessageToast.show("Create Success!");
								that.getRouter().navTo("sessionDetail", {
									id: that._iSessionId
								});
							}
						}
					});
				}
			}
		},

		/**
		 * @function
		 * @name onUploadComplete
		 * @description Event handler when file upload completed.
		 */
		onUploadComplete: function() {
			this.getView().setBusy(false);
			MessageToast.show("Create Success!");
			this.getRouter().navTo("sessionDetail", {
				id: this._iSessionId
			});
		},

		/**
		 * @function
		 * @name onPressCancel
		 * @description Event handler when click the Cancel Button.
		 */
		onPressCancel: function() {
			this.onNavBack();
		},

		/**
		 * @event
		 * @name onExit
		 * @description Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ssms.view.CreateSession
		 */
		onExit: function() {
			this._oUploadCollection.destroy();
			this._oFileToDelete.destroy();
			this._oDialog.destroy();
			this._iSessionId.destroy();
			this._sTimeoutId.destroy();
		},

		/**
		 * @function
		 * @name _checkDuplicateFile
		 * @description Check whether there is any duplicate file.
		 * @return {Boolean} If true, there are at least two same files.
		 */
		_checkDuplicateFile: function() {
			var mFiles = {};
			var i = this._oUploadCollection.getItems().length;

			while (i--) {
				var oFileItem = this._oUploadCollection.getItems()[i];
				var sFileName = oFileItem.getFileName();

				if (!mFiles[sFileName]) {
					mFiles[sFileName] = true;
				} else {
					this._oFileToDelete = oFileItem;
					if (this._Dialog) {
						this._oDialog.open();
					} else {
						this._createConfirmDialog();
					}
					return true;
				}
			}

			return false;
		},

		/**
		 * @function
		 * @name _createConfirmDialog
		 * @description Show a confirm dialog to ask user delete the duplicate files automatically or himself.
		 */
		_createConfirmDialog: function() {
			var that = this;
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
						that._oUploadCollection.removeItem(that._oFileToDelete);
					}
				}),
				endButton: new Button({
					text: "Cancel",
					press: function() {
						dialog.close();
					}
				})
			});

			this._oDialog = dialog;
			this._oDialog.open();
		},

		/**
		 * @function
		 * @name _onRouteMatched
		 * @description Reset data of this page.
		 */
		_onRouteMatched: function() {
			var oSessionModel = new sap.ui.model.json.JSONModel();

			oSessionModel.loadData("mockData/newSession.json", null, false);
			oSessionModel.getData().owner = this._sUserId;
			this.byId("session").setModel(oSessionModel);
		}
	});
});