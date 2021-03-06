
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

const DEFAULT_FORMAT = require('./format').default;

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

var idMap = {};
/**
Construct a DFG from a JSON data structure.
*/
function fromSpec(spec, format) {

  format = Object.assign({}, DEFAULT_FORMAT, format);

  if (format.INPUT_NODE_TRANSFORM) spec = format.INPUT_NODE_TRANSFORM(spec);

  // input processor can skip nodes by returning null
  if (!spec) return null;
  
  var node = null, id = null;
  
  if (id = spec[format.REF_FIELD]) {
    node = idMap[id];
    if (!node) throw new Error("Node with id " + id + " referenced but not defined before");
    return node;
  }

  var typeStr = spec[format.TYPE_FIELD];
  var value = spec[format.VALUE_FIELD];

  var type = format.INPUT_NODE_TYPE_MAP[typeStr];

  var inputs = spec[format.INPUTS_FIELD] || [];
  // remove inputs from properties
  delete spec[format.INPUTS_FIELD];
  inputs = inputs.map(spec => fromSpec(spec, format));
  
  // process conditions as these may contained REFed nodes - otherwise leave alone
  var conditions = spec[format.CONDITIONS_FIELD] || [];
  // transform, but do not store (for now)
  conditions.map(spec => fromSpec(spec, format));
  
  var properties = format.PROPERTIES_FIELD ? spec[format.PROPERTIES_FIELD] : spec;

  switch (type) {
    case 'LiteralNode': node = new LiteralNode(value, properties);
      break;
    case 'OperatorNode': node = new OperatorNode(spec[format.OPERATOR_FIELD], inputs, value, properties);
      break;
    case 'FunctionNode': node = new FunctionNode(spec[format.FUNCTION_NAME_FIELD], inputs, value, properties);
      break;
    case 'SymbolNode': node = new SymbolNode(spec[format.SYMBOL_NAME_FIELD], value, properties);
      break;
    default: node = new SymbolNode("UNKNOWN", undefined, properties);
  }
  
  if (id = node.properties[format.ID_FIELD]) {
    idMap[id] = node;
    // remove id for subsequent export
    delete node.properties[format.ID_FIELD];
  }

  //throw new Error("Unsupported node type: " + type + " from type specifier: " + typeStr);
  
  return node;
}

/**
Return JSON string representation of graph.
*/
function toJSON(node, options) {
  return JSON.stringify(toSpec(node, options), null, options.indent || 2);
}

var nodeID = 1;
/**
Convert a tree to its JSON specification.

This is implemented here as a flat function instead of in individual Node classes,
to make Nodes independent from data format stuff like DEFAULT_FORMAT etc.
*/
function toSpec(node, options) {

  options = Object.assign({}, {
    omitProperties: []
  }, options);

  let format = Object.assign({}, DEFAULT_FORMAT, options.format);
  
  let id = null,
      spec = {};
  
  if (id = node[format.ID_FIELD]) {
    spec[format.REF_FIELD] = id;
    return spec;
  }

  // construct inverted type string mapping if not already present
  if (! format.OUTPUT_NODE_TYPE_MAP) {
    format.OUTPUT_NODE_TYPE_MAP = {};
    Object.entries(format.INPUT_NODE_TYPE_MAP).forEach(
      (keyValue) => format.OUTPUT_NODE_TYPE_MAP[keyValue[1]] = keyValue[0]
    );
  }

  let type = node.type;

  spec[format.TYPE_FIELD] = format.OUTPUT_NODE_TYPE_MAP[type];
  spec[format.VALUE_FIELD] = node.value;
  spec[format.VALUE_TYPE_FIELD] = node.valueType;
  
  node[format.ID_FIELD] = nodeID;
  spec[format.ID_FIELD] = nodeID++;

  // shallow copy, omitting properties listed in options.omitProperties
  let propertiesOut = {};
  Object.keys(node.properties).forEach(key => {
    if (!options.omitProperties.includes(key)) {
      propertiesOut[key] = node.properties[key];
    }
  })
  spec[format.PROPERTIES_FIELD || 'properties'] = propertiesOut;

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
    spec[format.INPUTS_FIELD] = node.inputs.map(node => toSpec(node, options));
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
  util: require('./util.js'),
  format: require('./format.js')

};
