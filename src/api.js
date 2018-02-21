
var Node = require('./Node');
var LiteralNode = require('./LiteralNode');
var OperatorNode = require('./OperatorNode');

function fromJSON(json) {

  return root;
};

function wrap(valueOrNode, properties) {
  if (typeof valueOrNode == "number" || typeof valueOrNode == "string") {
    return LiteralNode(valueOrNode, properties);
  }

  // TODO: we chould wrap some more well-known object types (e.g. DOM nodes)
  // maybe this should be done in external code
  // OR we could stick a hidden property to other objects (.__node) to track them,
  // but this could also have side effects (iterating over properties etc.)

  // return others unchanged
  return valueOrNode;
};

function unwrap(valueOrNode) {
  if (valueOrNode instanceof Node) {
    return valueOrNode.getValue();
  }

  // return others unchanged
  return valueOrNode;
};

function isNode(valueOrNode) {
  return valueOrNode instanceof Node;
}

module.exports = {

  // main API methods
  wrap: wrap,
  unwrap: unwrap,
  isNode: isNode,

  // node types
  Node: Node,
  LiteralNode: LiteralNode,
  OperatorNode: OperatorNode

};
