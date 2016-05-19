sap.ui.require(
	[
		"ssms/control/uploadcollection/SSMSUploadCollection"
	],
	function(SSMSUploadCollection) {
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

	}
);