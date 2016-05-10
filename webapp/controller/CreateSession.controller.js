sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/UploadCollectionItem"
], function(BaseController, MessageToast, UploadCollectionParameter, UploadCollectionItem) {
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
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel, "UserModel");
			
			var oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("mockData/newSession.json");
			this.byId("session").setModel(oSessionModel);

		},

		/**
		 * @event
		 * @name onAfterRendering
		 * @description Called when the View has been rendered (so its HTML is part of the document). Set focus in the topic input.
		 * @memberOf ssms.view.view.SessionDetail
		 */
		onAfterRendering: function() {
			var $topicInput = $("#" + this.getView().getId() + "--topic-inner");

			$topicInput.attr("autofocus", "autofocus");
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
				this.byId("topicEmptyMsg").setVisible(true);
				bTopicValid = false;
				oTopicInput.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("topicEmptyMsg").setVisible(false);
				bTopicValid = true;
				oTopicInput.setValueState(sap.ui.core.ValueState.None);
			}
		},
		/**
		 * @function
		 * @name onCheckDate
		 * @description Event handler for checking topic validation. If its value is empty or is ealier than today, show message.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
		onCheckDate: function(oEvent) {
			var dNowDate = new Date();
			var oDatePicker = oEvent.getSource();
			var dSelectedDate = oDatePicker.getDateValue();
			var bValid = oEvent.getParameter("valid");

			if (!bValid) {
				this.byId("dateValidMsg").setVisible(true);
				bDateValid = false;
				oDatePicker.setValueState(sap.ui.core.ValueState.Error);
			} else {
				this.byId("dateValidMsg").setVisible(false);

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
		 * @name onFileChange
		 * @description Event handler when select a new file.
		 * @param {sap.ui.base.Event} oEvent The fired event.
		 */
		onFileChange: function(oEvent) {
			var oUploadCollection = oEvent.getSource();
			//  var oNewUploadItem = new UploadCollectionItem();

			//  oUploadCollection.addItem(oNewUploadItem);
			// 			// Header Token
			var oCustomerHeaderToken = new UploadCollectionParameter({
				name: "x-csrf-token",
				value: "securityTokenFromModel"
			});
			oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
			MessageToast.show("Have uploaded a file");
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
			    
				this.byId("create").setEnabled(false);
				MessageToast.show("Have created a new session, will go to the sessionDetail Page");
				console.log(oSessionData);
				location.reload();
			}
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
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf ssms.view.view.SessionDetail
		 */
		onExit: function() {
			bTopicValid.destroy();
			bDateValid.destroy();
			iPressCount.destroy();
		}
	});

});