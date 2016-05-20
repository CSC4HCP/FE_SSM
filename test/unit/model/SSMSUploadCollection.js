sap.ui.require(
	[
		"ssms/control/uploadcollection/SSMSUploadCollection",
		"sap/ui/thirdparty/sinon"
	],
	function(SSMSUploadCollection,sinon) {
		"use strict";

		QUnit.module("Upload Unit");
		

		QUnit.test("Should get the correct UploadUrl", function(assert) {
			// Arrange

			// System under Test
			var oMyControl = new SSMSUploadCollection({

				multiple: true,
				instantUpload: false

			});

			// Act
			oMyControl.setUploadUrl("test");
			// Assert
			assert.strictEqual(oMyControl.getUploadUrl(), "test", "The UploadUrl set correctly");
			// Cleanup
			oMyControl.destroy();
		});
		
			QUnit.test("Should Upload Successfully", function(assert) {
			// Arrange

			// System under Test
			var oMyControl = new SSMSUploadCollection({

				multiple: true,
				instantUpload: true

			});
			
				var haha = function(oEvent) {
		    
		};
		
		 var oSpy = sinon.spy(haha);
		 
		 oMyControl.attachUploadComplete(oSpy);
		 	var item = new sap.m.UploadCollectionItem({
				fileName: "hehe"
			});

			oMyControl.addItem(item);

			// Act
			oMyControl.fireUploadComplete();
		oMyControl.setUploadUrl("test");
		   oMyControl.upload();
			// Assert
			assert.strictEqual(oSpy.callCount, 1, "The Upload action is completed");
			// Cleanup
			oMyControl.destroy();
		});
		
			QUnit.test("Should get correct FileUploader", function(assert) {
			// Arrange

			// System under Test
			var oMyControl = new SSMSUploadCollection({

				multiple: true,
				instantUpload: false

			});
         
			// Act
			var fileuploader = oMyControl._getFileUploader();
			// Assert
			assert.strictEqual(fileuploader.getProperty("useMultipart"), true, "The FileUploader get correct Url");
			// Cleanup
			oMyControl.destroy();
		});
		
			QUnit.test("Should Delete Item", function(assert) {
			// Arrange
              var done = assert.async();
			// System under Test
			var oMyControl = new SSMSUploadCollection({

				multiple: true,
				instantUpload: false

			});
			this.mycontrol = oMyControl;
				this.mycontrol.placeAt("qunit-fixture");
				 var item = new sap.m.UploadCollectionItem(
                {
                    fileName:"1.jpg",
                     documentId:"6333333"
                });
		
			this.mycontrol.addItem(item);
	    
	         var that = this;
            setTimeout(function() {
                
           
		
		 var oSpy = sinon.spy(function(oEvent) {
		    
		});
		 
		 that.mycontrol.attachFileDeleted(oSpy);
                    
                //   var deleteBtn = that.mycontrol.$().find("button")[1];
                //   $(deleteBtn).trigger("tap");
                //   var body = that.mycontrol.$().parent().parent();
                //   var ok = $(body).find("button")[0];
                //   $(ok).trigger("tap");
                  that.mycontrol.fireFileDeleted();
                   assert.strictEqual(oSpy.callCount, 1,"The Item has been deleted");
                  that.mycontrol.destroy();
                    done();
                   
              });
			
		
			
// 		var haha = function(oEvent) {
		    
// 		};
		
// 		 var oSpy = sinon.spy(haha);
		 
// 		 this.mycontrol.attachFileDeleted(oSpy);
		
		
		
          
			// Act
// 		oMyControl.fireFileDeleted();
	
		  //  oMyControl._onCloseMessageBoxDeleteItem(sap.m.MessageBox.Action.OK);
		    
		    
			// Assert
// 			assert.strictEqual(oSpy.callCount, 1,"The Item has been deleted");
			// Cleanup
			
		});
		
		

	}
);