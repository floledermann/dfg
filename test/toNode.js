var assert = require('assert');

var DFG = require('../index.js');

describe("Wrapping values", function() {

  describe("Number to Node", function() {

    var value = 2;
    var node = DFG.toNode(value);

    it("is Node", function() {
      assert(DFG.isNode(node));
    });

    it("is LiteralNode", function() {
      assert(node instanceof DFG.LiteralNode);
    });

    it("has correct value", function() {
      assert.equal(node.getValue(), value);
    });

    var val = DFG.toValue(node);

    it("unwrapped is not Node", function() {
      assert(!DFG.isNode(val));
    });

    it("unwrapped is correct value", function() {
      assert.strictEqual(val, value);
    });

  });

  describe("Multiple toNode()", function() {

    var value = 2;
    var node = DFG.toNode(DFG.toNode(value));

    it("is Node", function() {
      assert(DFG.isNode(node));
    });

    it("is LiteralNode", function() {
      assert(node instanceof DFG.LiteralNode);
    });

    it("has correct value", function() {
      assert.equal(node.getValue(), value);
    });
  });

  describe("Wrap unknown", function() {

    var value = {};
    var node = DFG.toNode(value);

    it("is not Node", function() {
      assert(!DFG.isNode(node));
    });

    it("is original object", function() {
      assert.strictEqual(node, value);
    });
  });



});
