var assert = require('assert');

var DFG = require('../index.js');

// test basic math first
require("./math");

describe("Match patterns in graph", function() {

  describe("Simple nodes", function() {

    it("Node base class cannot match", function() {
      assert.throws(function() {
        var node = new DFG.Node();

        node.match();
      });
    });

    it ("matches equal Literal", function() {
      var node = DFG.util.fromMathString("2");
      var pattern = DFG.util.fromMathString("2");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
    });

    it ("does not match different Literal", function() {
      var node = DFG.util.fromMathString("2");
      var pattern = DFG.util.fromMathString("3");

      var match = node.match(pattern);

      assert(!match);
    });

    it ("matches Operator", function() {
      var node = DFG.util.fromMathString("2 * 3");
      var pattern = DFG.util.fromMathString("2 * 3");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
    });

    it ("matches Function", function() {
      var node = DFG.util.fromMathString("sqrt(2)");
      var pattern = DFG.util.fromMathString("sqrt(2)");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
    });

  });

  describe("Permutations", function() {

    it ("commutative Operators", function() {
      var node = DFG.util.fromMathString("2 * 3");
      var pattern = DFG.util.fromMathString("3 * 2");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
    });

  });

  describe("Symbol", function() {

    it ("matches Literal", function() {
      var node = DFG.util.fromMathString("2");
      var pattern = DFG.util.fromMathString("z");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
      assert.equal(match.symbols.z, node);
    });

    it ("matches inside Function", function() {
      var node = DFG.util.fromMathString("sqrt(2)");
      var pattern = DFG.util.fromMathString("sqrt(z)");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
      assert.equal(match.symbols.z.type, 'LiteralNode');
      assert.equal(match.symbols.z.value, 2);
    });

  });

});
