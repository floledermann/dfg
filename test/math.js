var assert = require('assert');

var DFG = require('../index.js');

describe("From Math Expressions", function() {

  describe("Empty & Malformed Input", function() {

    it("missing input fails", function() {
      assert.throws(function() {
        DFG.util.fromMathString();
      });
    });

    it("empty input fails", function() {
      assert.throws(function() {
        DFG.util.fromMathString('');
      });
    });

    it("malformed math string fails", function() {
      assert.throws(function() {
        DFG.util.fromMathString('2 *');
      });
    });

  });

  describe("String Input", function() {

    it("converts constants", function() {

      var node = DFG.util.fromMathString('2');

      assert(node);
      assert(node instanceof DFG.LiteralNode);
      assert.equal(node.type, 'LiteralNode');
      assert.strictEqual(node.value, 2);

    });

    it("converts operators", function() {

      var node = DFG.util.fromMathString('2 * 2');

      assert(node);
      assert(node instanceof DFG.OperatorNode);
      assert.equal(node.type, 'OperatorNode');
      assert.equal(node.op, '*');

      var inputs = node.inputs;
      assert.strictEqual(inputs.length, 2);
      assert(inputs[0] instanceof DFG.LiteralNode);
      assert(inputs[1] instanceof DFG.LiteralNode);
      assert.strictEqual(inputs[0].value, 2);
      assert.strictEqual(inputs[1].value, 2);

    });

    it("converts functions", function() {

      var node = DFG.util.fromMathString('sqrt(2)');

      assert(node);
      assert(node instanceof DFG.FunctionNode);
      assert.equal(node.type, 'FunctionNode');
      assert.equal(node.name, 'sqrt');

      var inputs = node.inputs;
      assert.strictEqual(inputs.length, 1);
      assert(inputs[0] instanceof DFG.LiteralNode);
      assert.strictEqual(inputs[0].value, 2);

    });

    it("converts symbols", function() {

      var node = DFG.util.fromMathString('z');

      assert(node);
      assert(node instanceof DFG.SymbolNode);
      assert.equal(node.type, 'SymbolNode');
      assert.equal(node.name, 'z');

      var node = DFG.util.fromMathString('z * 2');

      assert(node);
      assert(node instanceof DFG.OperatorNode);
      assert.equal(node.op, '*');

      var inputs = node.inputs;
      assert.strictEqual(inputs.length, 2);
      assert(inputs[0] instanceof DFG.SymbolNode);
      assert.equal(inputs[0].name, 'z');

    });


  });

});

describe("To Math Expressions", function() {

  describe("To String", function() {

    function match(string) {
      var node = DFG.util.fromMathString(string);
      var result = DFG.util.toMathString(node);
      assert.equal(string, result);
    }

    it("single nodes", function() {
      match("2");
      match("x");
    });

    it("simple expressions", function() {
      match("2 + 2");
      match("2 + x");
      match("2 * 3");
      match("2 * (3 + 3)");
      match("2 * (n + 3)");
    });

  });

});
