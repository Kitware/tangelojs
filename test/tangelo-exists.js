/*globals describe, it, expect, tangelo */

QUnit.module("Tangelo exists);

QUnit.test("'tangelo' is not undefined", function (assert) {
    assert.notStrictEqual(tangelo, undefined);
});
