/*globals describe, it, expect, tangelo */

QUnit.module("tangelo.isNumber()");

QUnit.test("Boolean should not be a number", function (assert) {
    assert.ok(!tangelo.isNumber(true));
});

QUnit.test("'35' is a number", function (assert) {
    assert.ok(tangelo.isNumber(35));
});

QUnit.test("Strings are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber("not a number"));
});

QUnit.test("Strings of numbers are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber("42"));
});

QUnit.test("Strings of numbers cast to numbers (with +) are numbers", function (assert) {
    assert.ok(tangelo.isNumber(+"42"));
});

QUnit.test("Empty strings are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber(""));
});

QUnit.test("Floating point numbers are numbers", function (assert) {
    assert.ok(tangelo.isNumber(3.14159));
});

QUnit.test("Infinity is a number", function (assert) {
    assert.ok(tangelo.isNumber(Infinity));
});

QUnit.test("NaN is a number", function (assert) {
    assert.ok(tangelo.isNumber(0./0.));
});

QUnit.test("undefined (blank argument list) is not a number", function (assert) {
    assert.ok(!tangelo.isNumber());
});

QUnit.test("Objects are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber({foo: 42}));
});

QUnit.test("Arrays are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber([1, 2, 3]));
});

QUnit.test("Functions are not numbers", function (assert) {
    assert.ok(!tangelo.isNumber(tangelo.isNumber));
});
