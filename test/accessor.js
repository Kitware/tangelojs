QUnit.module("tangelo.accessor");

var data = {
    oranges: "tangelos",
    lemons: {
        car: "jalopy",
        fruit: "citrus"
    }
};

QUnit.test("Undefined accessors display 'undefined' property", function (assert) {
    var undef1 = tangelo.accessor(),
        undef2 = tangelo.accessor({});

    assert.expect(2);

    assert.strictEqual(undef1.undefined, true);
    assert.strictEqual(undef2.undefined, true);
});

Qunit.test("Undefined accessor throws exception when called", function (assert) {
    assert.expect(2);

    assert.throws(tangelo.accessor());
    assert.throws(tangelo.accessor({}));
});

Qunit.test("Defined accessors do not display 'undefined' property", function (assert) {
    var value = tangelo.accessor({value: 10});
    
    assert.expect(1);

    assert.strictEqual(value.undefined, undefined);
});

Qunit.test("Value spec produces accessor", function (assert) {
    var value = tangelo.accessor({value: 10});

    assert.expect(1);

    assert.strictEqual(value(data), 10);
});

Qunit.test("Index spec produces accessor", function (assert) {
    var index = tangelo.accessor({index: true});

    assert.expect(1);

    assert.strictEqual(index(data, 5), 5);
});

Qunit.test("Field spec produces accessor", function (assert) {
    var field1 = tangelo.accessor({field: "oranges"}),
        field2 = tangelo.accessor({field: "lemons.car"}),
        field3 = tangelo.accessor({field: "."});

    assert.expect(4);

    assert.strictEqual(field1(data), "tangelos");
    assert.strictEqual(field2(data), "jalopy");
    assert.strictEqual(field2({}), undefined);
    assert.strictEqual(field3(4), 4);
});

Qunit.test("Unknown spec throws exception", function (assert) {
    assert.expect(2);

    assert.throws(function () {
        return tangelo.accessor({invalid: "quux"});
    });
    assert.throws(tangelo.accessor(undefined));
});

Qunit.test("Clone a function (twice)", function (assert) {
    assert.expect(1);

    assert.strictEqual(tangelo.accessor(tangelo.accessor(function (d) { return d; }))(10), 10);
});
