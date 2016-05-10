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

		onAfterRendering: function() {
			var oTopicInput = this.byId("topic");
			var $topicInput = $("#" + this.getView().getId() + "--topic-inner");
			var that = this;

			$topicInput.attr("autofocus", "autofocus");
			$topicInput.one("blur", function() {
				if (oTopicInput.getValue() === "") {
					that.byId("topicEmptyMsg").setVisible(true);
				} else {
					that.byId("topicEmptyMsg").setVisible(false);
				}
			});
		},

		onCheckTopic: function(oEvent) {
			var sValue = oEvent.getSource().getValue();

			if (sValue === "") {
				this.byId("topicEmptyMsg").setVisible(true);
			} else {
				this.byId("topicEmptyMsg").setVisible(false);
			}
		},

		onCheckDate: function(oEvent) {
			var oNowDate = new Date();
			var oSelectedDate = oEvent.getSource().getDateValue();

			this.byId("dateEmptyMsg").setVisible(false);

			if (oSelectedDate <= oNowDate) {
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
			var oPlannedTime = this.byId("date");

			if (oPlannedTime.getDateValue() === null) {
				this.byId("dateEmptyMsg").setVisible(true);
				return;
			}

			MessageToast.show("Have created a new session");
		},

		onPressCancel: function() {
			this.onNavBack();
		}
	});

});