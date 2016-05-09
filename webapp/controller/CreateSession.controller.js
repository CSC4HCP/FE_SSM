sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/UploadCollectionItem"
], function(BaseController, MessageToast, UploadCollectionParameter, UploadCollectionItem) {
	"use strict";

	return BaseController.extend("ssms.controller.CreateSession", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel);

		},

		onCheckTopic: function(oEvent) {
			var sValue = oEvent.getSource().getValue();

			if (sValue === "") {
				this.byId("topicErrorMsg").setVisible(true);
			} else {
				this.byId("topicErrorMsg").setVisible(false);
			}
		},
		
		onCheckDate: function(oEvent) {
			var oDateValue = oEvent.getSource().getDateValue();

			if (oDateValue === null) {
				this.byId("dateErrorMsg").setVisible(true);
			} else {
				this.byId("dateErrorMsg").setVisible(false);
			}
		},

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

		onPressCreate: function() {
			var oTopicInput = this.byId("topic");
			var oPlannedTime = this.byId("date");

			if (oTopicInput.getValue() === "") {
				this.byId("topicErrorMsg").setVisible(true);
			}

			if (oPlannedTime.getDateValue() === null) {
				this.byId("dateErrorMsg").setVisible(true);
				return;
			}

			MessageToast.show("Have created a new session");
		},
		
		onPressCancel: function() {
		    this.onNavBack();
		}
	});

});