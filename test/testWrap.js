var assert = require('assert');

var DFG = require('../index.js');

describe("Wrapping values", function() {

  describe("Wrap number", function() {

    var value = 2;
    var wrapped = DFG.wrap(value);

    it("is Node", function() {
      assert(DFG.isNode(wrapped));
    });

    it("is LiteralNode", function() {
      assert(wrapped instanceof DFG.LiteralNode);
    });

    it("has correct value", function() {
      assert.equal(wrapped.getValue(), value);
    });

    var unwrapped = DFG.unwrap(wrapped);

    it("unwrapped is not Node", function() {
      assert(!DFG.isNode(unwrapped));
    });

    it("unwrapped is correct value", function() {
      assert.strictEqual(unwrapped, value);
    });

  });

  describe("Multiple wrap", function() {

    var value = 2;
    var wrapped = DFG.wrap(DFG.wrap(value));

    it("is Node", function() {
      assert(DFG.isNode(wrapped));
    });

    it("is LiteralNode", function() {
      assert(wrapped instanceof DFG.LiteralNode);
    });

    it("has correct value", function() {
      assert.equal(wrapped.getValue(), value);
    });
  });

  describe("Wrap unknown", function() {

    var value = {};
    var wrapped = DFG.wrap(value);

    it("is not Node", function() {
      assert(!DFG.isNode(wrapped));
    });

    it("is original object", function() {
      assert.strictEqual(wrapped, value);
    });
  });



});
