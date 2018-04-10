var assert = require('assert');

var DFG = require('../index.js');

describe("Find patterns in graph", function() {

  describe("Find all nodes", function() {

    it ("match single Literal", function() {
      var node = DFG.util.fromMathString("2 * 3");
      var pattern = DFG.util.fromMathString("3");

      var matches = node.findAll(pattern);

      assert(matches);
      assert.equal(matches.length, 1);
      assert.equal(matches[0].root, node.inputs[1]);
    });

    it ("match multiple Literals", function() {
      var node = DFG.util.fromMathString("2 * (3 + 3)");
      var pattern = DFG.util.fromMathString("3");

      var matches = node.findAll(pattern);

      assert(matches);
      assert.equal(matches.length, 2);
      assert.equal(matches[0].root, node.inputs[1].inputs[0]);
      assert.equal(matches[1].root, node.inputs[1].inputs[1]);
    });

  });

});
