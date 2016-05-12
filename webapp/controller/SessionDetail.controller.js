jQuery.sap.require("ssms.util.formatter");
sap.ui.define([
	"ssms/controller/BaseController",
	"sap/m/MessageToast",
	"sap/m/UploadCollectionParameter",
	"sap/m/UploadCollectionItem"
], function(BaseController, MessageToast, UploadCollectionParameter, UploadCollectionItem) {
	"use strict";

	var iSessionId;
	var bDateValid = false;
	var iPressCount = 0;

	return BaseController.extend("ssms.controller.SessionDetail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf ssms.view.view.createSession
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser");
			this.getView().setModel(oModel, "UserModel");

			var url = location.href;
			var id = url.substr(url.lastIndexOf("/") + 1);

			var oSessionModel = new sap.ui.model.json.JSONModel();
			oSessionModel.loadData("/destinations/SSM_DEST/api/session/" + id, false);
			this.getView().setModel(oSessionModel);

			var oRouter = this.getRouter();
			oRouter.getRoute("sessionDetail").attachMatched(this._onRouteMatched, this);

		},
		_onRouteMatched: function(oEvent) {
			var oArgs;
			oArgs = oEvent.getParameter("arguments");
			iSessionId = oArgs.id;

			var oControl = this.getView().byId("ssms-Status");
			this._formatStateBackground(oControl, oControl.getText());

		},
		_formatStateBackground: function(oControl, sText) {
			oControl.addStyleClass("ssmsSessionDetail_Status");
			switch (sText) {
				case "Open":
					$(".ssmsSessionDetail_Status").css("color", "yellow");
					break;
				case "In Progress":
					$(".ssmsSessionDetail_Status").css("color", "green");
					break;
				case "Cancelled":
					$(".ssmsSessionDetail_Status").css("color", "red");
					break;
			}
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
				sIdShow.setVisible(true);
				sIdEdit.setVisible(false);
				
				this.onPressCreate();
			}

		},
		
		onCheckDate:function(oEvent) {
		    var dNowDate = new Date();
			var oDatePicker = oEvent.getSource();
			var dSelectedDate = oDatePicker.getDateValue();
			var bValid = oEvent.getParameter("valid");

			if (!bValid) {
				bDateValid = false;
				oDatePicker.setValueState(sap.ui.core.ValueState.Error);
			} else {
				if (dSelectedDate <= dNowDate) {
					bDateValid = false;
					oDatePicker.setValueState(sap.ui.core.ValueState.Error);
				} else {
					bDateValid = true;
					oDatePicker.setValueState(sap.ui.core.ValueState.None);
				}
			}
		},
		onPressCreate: function() {
		    if (bDateValid) {
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