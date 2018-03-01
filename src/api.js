
var Node = require('./Node');
var LiteralNode = require('./LiteralNode');
var OperatorNode = require('./OperatorNode');
var FunctionNode = require('./FunctionNode');
var SymbolNode = require('./SymbolNode');

function fromJSON(json) {

  return root;
};

function toNode(valueOrNode, properties) {
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

function toValue(valueOrNode) {
  if (valueOrNode instanceof Node) {
    return valueOrNode.getValue();
  }

  // return others unchanged
  return valueOrNode;
};

function isNode(valueOrNode) {
  return valueOrNode instanceof Node;
}

var DEFAULT_FORMAT = {
  TYPE_FIELD: 'type',
  VALUE_FIELD: 'value',
  INPUTS_FIELD: 'inputs',
  OPERATOR_FIELD: 'op',
  NODE_TYPE_MAP: {
    'LiteralNode': 'LiteralNode',
    'OperatorNode': 'OperatorNode',
    'FunctionNode': 'FunctionNode',
    'SymbolNode': 'SymbolNode'
  }
};

function fromJSON(jsonString, format) {
  var data = JSON.parse(jsonString);
  if (Array.isArray(data)) {
    return data.map(spec => fromSpec(spec, format));
  }
  return fromSpec(data, format);
}

function toJSON(graph, format) {
  return '[]';
}

function fromSpec(spec, format) {

  format = Object.assign({}, DEFAULT_FORMAT, format);

  var typeStr = spec[format.TYPE_FIELD];
  var value = spec[format.VALUE_FIELD];
  var op = spec[format.OPERATOR_FIELD];

  var type = format.NODE_TYPE_MAP[typeStr];

  var inputs = spec[format.INPUTS_FIELD] || [];
  // remove inputs from properties
  delete spec[format.INPUTS_FIELD];
  inputs = inputs.map(spec => fromSpec(spec, format));

  switch (type) {
    case 'LiteralNode': return new LiteralNode(value, spec);
    case 'OperatorNode': return new OperatorNode(op, inputs, spec);
  }

  throw new Error("Unknown node type: " + type);
}

module.exports = {

  // main API methods
  toNode: toNode,
  toValue: toValue,
  isNode: isNode,
  fromJSON: fromJSON,
  toJSON: toJSON,
  fromSpec: fromSpec,

  // node types
  Node: Node,
  LiteralNode: LiteralNode,
  OperatorNode: OperatorNode,
  FunctionNode: FunctionNode,
  SymbolNode: SymbolNode,

  // sublibraries
  util: require('./util.js')

};
