
var Node = require('./Node');
var LiteralNode = require('./LiteralNode');
var OperatorNode = require('./OperatorNode');
var FunctionNode = require('./FunctionNode');
var SymbolNode = require('./SymbolNode');


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
  VALUE_TYPE_FIELD: 'valueType',
  INPUTS_FIELD: 'inputs',
  OPERATOR_FIELD: 'op',
  FUNCTION_NAME_FIELD: 'name',
  SYMBOL_NAME_FIELD: 'name',
  PROPERTIES_FIELD: '', // by default us object itself as properties
  INPUT_NODE_TYPE_MAP: {
    'LiteralNode': 'LiteralNode',
    'OperatorNode': 'OperatorNode',
    'FunctionNode': 'FunctionNode',
    'SymbolNode': 'SymbolNode'
  }
};

/**
Construct a DFG from a JSON string.
*/
function fromJSON(jsonString, format) {
  var data = JSON.parse(jsonString);
  if (Array.isArray(data)) {
    return data.map(spec => fromSpec(spec, format));
  }
  return fromSpec(data, format);
}

/**
Construct a DFG from a JSON data structure.
*/
function fromSpec(spec, format) {

  format = Object.assign({}, DEFAULT_FORMAT, format);

  var typeStr = spec[format.TYPE_FIELD];
  var value = spec[format.VALUE_FIELD];

  var type = format.INPUT_NODE_TYPE_MAP[typeStr];

  var inputs = spec[format.INPUTS_FIELD] || [];
  // remove inputs from properties
  delete spec[format.INPUTS_FIELD];
  inputs = inputs.map(spec => fromSpec(spec, format));

  switch (type) {
    case 'LiteralNode': return new LiteralNode(value, spec);
    case 'OperatorNode': return new OperatorNode(spec[format.OPERATOR_FIELD], inputs, spec);
    case 'FunctionNode': return new FunctionNode(spec[format.FUNCTION_NAME_FIELD], inputs, spec);
    case 'SymbolNode': return new SymbolNode(spec[format.SYMBOL_NAME_FIELD], spec);
  }

  throw new Error("Unsupported node type: " + type + " from type specifier: " + typeStr);
}

/**
Return JSON string representation of graph.
*/
function toJSON(node, format) {
  return JSON.stringify(toSpec(node, format));
}

/**
Convert a tree to its JSON specification.

This is implemented here as a flat function instead of in individual Node classes,
to make Nodes independent from data format stuff like DEFAULT_FORMAT etc.
*/
function toSpec(node, format) {
  format = Object.assign({}, DEFAULT_FORMAT, format);

  // construct inverted type string mapping if not already present
  if (! format.OUTPUT_NODE_TYPE_MAP) {
    format.OUTPUT_NODE_TYPE_MAP = {};
    Object.entries(format.INPUT_NODE_TYPE_MAP).forEach((keyValue) => format.OUTPUT_NODE_TYPE_MAP[keyValue[1]] = keyValue[0]);
  }

  var type = node.type;
  var spec = {};

  spec[format.TYPE_FIELD] = format.OUTPUT_NODE_TYPE_MAP[type];
  spec[format.VALUE_FIELD] = node.value;
  spec[format.PROPERTIES_FIELD || 'properties'] = node.properties;

  if (node instanceof LiteralNode) {
    spec[format.VALUE_TYPE_FIELD] = node.valueType;
  }

  if (node instanceof SymbolNode) {
    spec[format.SYMBOL_NAME_FIELD] = node.name;
  }

  if (node instanceof FunctionNode) {
    spec[format.FUNCTION_NAME_FIELD] = node.name;
  }

  if (node instanceof OperatorNode) {
    spec[format.OPERATOR_FIELD] = node.op;
  }

  if (node.inputs) {
    spec[format.INPUTS_FIELD] = node.inputs.map(node => toSpec(node, format));
  }

  return spec;

}


module.exports = {

  // main API methods
  toNode: toNode,
  toValue: toValue,
  isNode: isNode,
  fromJSON: fromJSON,
  fromSpec: fromSpec,
  toJSON: toJSON,
  toSpec: toSpec,

  // node types
  Node: Node,
  LiteralNode: LiteralNode,
  OperatorNode: OperatorNode,
  FunctionNode: FunctionNode,
  SymbolNode: SymbolNode,

  // sublibraries
  util: require('./util.js')

};
