var assert = require('assert');

var DFG = require('../index.js');

describe("Constructing from JSON using DAG", function() {

  describe("Single Nodes", function() {

    var node = DFG.fromJSON(`
    {
      "type": "Operator",
      "op": "+",
      "id": 1,
      "inputs": [
        {
          "type": "Literal",
          "value": 2,
          "id": 2
        },
        {
          "ref": 2
        }
      ]
    }
      `);

    it("returns DFG", function() {
      assert(node instanceof DFG.OperatorNode);
    });

    it("instantiated REF nodes", function() {
      assert.equal(node.inputs.length, 2);
      assert.equal(node.inputs[0].value, 2);
      assert.equal(node.inputs[1].value, 2);
    });

  });

});
