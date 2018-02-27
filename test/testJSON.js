var assert = require('assert');

var DFG = require('../index.js');

describe("Loading JSON", function() {

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
      "type": "LiteralNode",
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
      "type": "LiteralNode",
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
