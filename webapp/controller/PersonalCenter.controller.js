sap.ui.define([
    "ssms/controller/BaseController",
	"sap/m/MessageToast"
], function(BaseController, MessageToast) {
	"use strict";

	return BaseController.extend("ssms.controller.PersonalCenter", {
	    /**
		 * @event
		 * @name onInit
		 * @description Called when a controller is instantiated and its View controls (if available) are already created. Mainly set model.
		 * @memberOf ssms.view.view.Home
		 */
		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/services/userapi/currentUser", null, false);
			this.getView().setModel(oModel, "UserModel");
            var sUserId = oModel.getData().name;
            console.log(sUserId);
            var oData;
            $.ajax({
                method:"POST",
                url:"/destinations/SSM_DEST/api/user/" + sUserId,
                contentType:"application/json",
                data:oModel.getData() ,
                success:function(data){
                console.log(data);
                oData = data;
                }
            });
            var oText1 = this.getView().byId("ssms-role");
             oText1.setText();
             var oText2 = this.getView().byId("ssms-team");
             oText2.setText();
		},
			/**
		 * @function
		 * @name onPressTile
		 * @description Event handler when click on the tile. Will go to the next view.
		 * @param {sap.ui.base.Event} - oEvent The fired event.
		 */
			onPressTile: function(oEvent) {
			var sId = oEvent.getSource().getId();

			switch (true) {
				case sId.indexOf("createSession") > -1:
					this.getRouter().navTo("createSession");
					break;
				case sId.indexOf("joinSession") > -1:
					MessageToast.show("Will go to the joinSession Page");
					break;
					case sId.indexOf("ownSession") > -1:
					MessageToast.show("Will go to the ownSession Page");
					break;
					case sId.indexOf("commentSession") > -1:
					MessageToast.show("Will go to the ownSession Page");
					break;
				default:
					break;
			}
		}

	});

});