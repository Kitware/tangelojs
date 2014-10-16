/*globals describe, it, expect, tangelo */

QUnit.module("isFunction()");

QUnit.test("Functions are functions", function (assert) {
    assert.ok(tangelo.isFunction(tangelo.isFunction));
});

QUnit.test("Numbers are not functions", function (assert) {
    assert.ok(!tangelo.isFunction(42));
});

QUnit.test("null is not a function", function (assert) {
    assert.ok(!tangelo.isFunction(null));
});

QUnit.test("Blank argument list is not a function", function (assert) {
    assert.ok(!tangelo.isFunction());
});
