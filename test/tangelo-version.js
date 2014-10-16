/*globals describe, it, expect, tangelo */

QUnit.module("Tangelo version");

(function () {
    var version = "0.7.0-dev";

    QUnit.test("Tangelo version is correct", function (assert) {
        var myVersion = tangelo.version();

        assert.strictEqual(myVersion, version);
    });
}());
