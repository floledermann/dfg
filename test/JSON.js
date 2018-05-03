var assert = require('assert');

var DFG = require('../index.js');

describe("Constructing from JSON", function() {

  describe("Empty & Malformed Input", function() {

    it("missing input fails", function() {
      assert.throws(function() {
        DFG.fromJSON();
      });
    });

    it("empty input fails", function() {
      assert.throws(function() {
        DFG.fromJSON('');
      });
    });

    it("malformed JSON fails", function() {
      assert.throws(function() {
        DFG.fromJSON('{');
      });
      assert.throws(function() {
        DFG.fromJSON('"foo');
      });
    });

    it("String fails", function() {
      assert.throws(function() {
        DFG.fromJSON('"foo"');
      });
    });

    it("empty Object fails", function() {
      assert.throws(function() {
        DFG.fromJSON('{}');
      });
    });

    it("empty Object inside Array fails", function() {
      assert.throws(function() {
        DFG.fromJSON('[{}]');
      });
    });

    it("empty Array yields empty Array", function() {
      var dfg = DFG.fromJSON('[]');
      assert(Array.isArray(dfg));
      assert.equal(dfg.length, 0);
    });

  });


  describe("Malformed Nodes", function() {

    // TODO

  });

  describe("Single Nodes", function() {

    var node = DFG.fromJSON(`{
      "type": "Literal",
      "value": 2
    }`);

    it("has correct node type", function() {
      assert(node instanceof DFG.LiteralNode);
    });

    it("has correct value", function() {
      assert.equal(node.value, 2);
    });

  });

  describe("Array of nodes", function() {

    var dfg = DFG.fromJSON(`[{
      "type": "Literal",
      "value": 2
    }]`);

    it("is Array", function() {
      assert(Array.isArray(dfg));
    });

    it("of correct length", function() {
      assert.equal(dfg.length, 1);
    });

    it("containing correct node type", function() {
      assert(dfg[0] instanceof DFG.LiteralNode);
    });

  });

});


describe("Transforming to JSON", function() {

  describe("Basic Node Types", function() {

    it("Node (abstract base type) fails", function() {
      assert.throws(function() {
        DFG.toSpec(Node());
      });
    });

    it("Literal Node", function() {
      var node = DFG.LiteralNode("Foo");
      var spec = DFG.toSpec(node);
      assert.equal(spec.value, "Foo");
      assert.equal(spec.valueType, "string");
      assert.equal(spec.type, "Literal");
    });

    it("Symbol Node", function() {
      var node = DFG.SymbolNode("foo");
      var spec = DFG.toSpec(node);
      assert.equal(spec.name, "foo");
      assert.equal(spec.type, "Symbol");
    });

    it("Function Node", function() {
      var node = DFG.FunctionNode("add", [DFG.LiteralNode(1), DFG.LiteralNode(1)]);
      var spec = DFG.toSpec(node);
      assert.equal(spec.name, "add");
      assert.equal(spec.inputs.length, 2);
      assert.equal(spec.type, "Function");
    });

    it("Operator Node", function() {
      var node = DFG.OperatorNode("+", [DFG.LiteralNode(1), DFG.LiteralNode(1)]);
      var spec = DFG.toSpec(node);
      assert.equal(spec.op, "+");
      assert.equal(spec.inputs.length, 2);
      assert.equal(spec.type, "Operator");
    });


  });
});
