var assert = require('assert');

var DFG = require('../index.js');

// test basic math first
require("./math");

describe("Match graph patterns", function() {

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

  describe("Operations", function() {

    it ("do not match non-matching patterns", function() {
      var node = DFG.util.fromMathString("2 * 2");
      var pattern = DFG.util.fromMathString("3 * 3");

      var match = node.match(pattern);

      assert.equal(false, match);
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

    it ("matches in Operation", function() {
      var node = DFG.util.fromMathString("2 + 2");
      var pattern = DFG.util.fromMathString("a + 2");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
      assert.equal(match.symbols.a.type, 'LiteralNode');
      assert.equal(match.symbols.a.value, 2);
    assert.equal(match.symbols.a, node.inputs[0]);
    });


  });

  describe("Named constants", function() {

    it ("PI matches correct value", function() {
      var node = DFG.util.fromMathString("3.141592653589793");
      var pattern = DFG.util.fromMathString("PI");

      var match = node.match(pattern);

      assert(match);
      assert.equal(match.root, node);
    });

    it ("PI doesn't match other value", function() {
      var node = DFG.util.fromMathString("4");
      var pattern = DFG.util.fromMathString("PI");

      var match = node.match(pattern);

      assert.strictEqual(match, false);
    });

    it ("PI matches within epsilon", function() {
      var node = DFG.util.fromMathString("3.1415");
      var pattern = DFG.util.fromMathString("PI");

      var match = node.match(pattern, {epsilon: 0.0001});

      assert(match);
      assert.equal(match.root, node);
    });

    it ("PI doesn't match with too small epsilon", function() {
      var node = DFG.util.fromMathString("3.1415");
      var pattern = DFG.util.fromMathString("PI");

      var match = node.match(pattern, {epsilon: 0.00001});

      assert.strictEqual(match, false);
    });

  });

});
