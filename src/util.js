var assert = require('assert');
var math = require('mathjs');

var LiteralNode = require('./LiteralNode');
var OperatorNode = require('./OperatorNode');
var FunctionNode = require('./FunctionNode');
var SymbolNode = require('./SymbolNode');

function fromMathString(str, options) {

  assert(typeof str == 'string', "String input expected");
  assert(str, "String cannot be empty");

  return fromMathNode(math.parse(str), options);

}

function fromMathNode(node, options) {

  assert(node instanceof math.expression.node.Node);

  // Helper to convert children recursively
  function mapChildren(children) {
    return children.map(n => fromMathNode(n, options));
  }

  switch (node.type) {

    case 'ConstantNode': return new LiteralNode(node.eval());

    case 'OperatorNode': return new OperatorNode(node.op, mapChildren(node.args));

    // Parenteses are simply replaced by their contents
    case 'ParenthesisNode': return fromMathNode(node.getContent(), options);

    case 'SymbolNode':
      if (node.name in math && typeof math[node.name] === 'number') {
        return new LiteralNode(math[node.name]);
      }
      return new SymbolNode(node.name);

    // FunctionNode uses a SymbolNode as its name -> convert
    case 'FunctionNode': return new FunctionNode(node.fn.name, mapChildren(node.args));

  }

  // TODO: Node types:
  // http://mathjs.org/docs/expressions/expression_trees.html#nodes

  // Inputs:
  // ArrayNode (?)
  // ObjectNode (?)

  // Operations:
  // AccessorNode
  // IndexNode

  throw new Error("Unsupported Node type: " + node.type);

}

function toMathNode(node) {

}

module.exports = {
  fromMathString: fromMathString,
  fromMathNode: fromMathNode,
  toMathNode: toMathNode
}
