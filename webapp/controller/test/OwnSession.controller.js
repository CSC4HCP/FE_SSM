sap.ui.define([

	"ssms/controller/BaseController", "jquery.sap.global", "sap/ui/core/mvc/Controller", "sap/ui/model/Filter",
	"sap/ui/model/json/JSONModel"

], function(BaseController) {

	"use strict";

	return BaseController.extend("ssms.controller.test.OwnSession", {

		/**

		* @event

		* @name onInit

		* @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.

		* @memberOf ssms.view.view.ownSession

		*/

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();

			oModel.loadData("/services/userapi/currentUser", null, false);

			this.getView().setModel(oModel, "UserModel");

			var oModel1 = new sap.ui.model.json.JSONModel();

			oModel1.loadData("mockData/ownSession.json", null, false);

			this.getView().setModel(oModel1, "UserModel1");

			this.byId("iconTabFilterAll").setCount(oModel1.getData().All.length);

		},

		/**

		* @function

		* @name onPressedColumnListItem

		* @description Event handler when click on the session. Will go to the next view.

		* @param {sap.ui.base.Event} - oEvent The fired event.

		*/

		onPressedColumnListItem: function(oEvent) {

			var Sid = oEvent.getSource().getCounter();

			this.getRouter().navTo("sessionDetail", {

				id: Sid

			});

		}

	});

});