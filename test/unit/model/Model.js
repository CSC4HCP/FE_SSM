sap.ui.require([
    "ssms/model/Model",
	"sap/ui/thirdparty/sinon",
    "sap/ui/thirdparty/sinon-qunit"
], function(Model) {
	"use strict";

	QUnit.module("some module", {

	});

	QUnit.test("some test", function(assert) {
		// Assert
		assert.strictEqual(true, true, "correct");
	});

});