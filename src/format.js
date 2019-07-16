const equalsEpsilon = require('./util').equalsEpsilon;

module.exports = {

  v2: {
    TYPE_FIELD: 'type',
    VALUE_FIELD: 'value',
    VALUE_TYPE_FIELD: 'valueType',
    INPUTS_FIELD: 'inputs',
    OPERATOR_FIELD: 'op',
    FUNCTION_NAME_FIELD: 'name',
    SYMBOL_NAME_FIELD: 'name',
    PROPERTIES_FIELD: '', // by default use object itself as properties
    INPUT_NODE_TYPE_MAP: {
      'Literal': 'LiteralNode',
      'Operator': 'OperatorNode',
      'Function': 'FunctionNode',
      'Symbol': 'SymbolNode'
    },
    // callback function to transform input nodes before they are further processed.
    INPUT_NODE_TRANSFORM: null
  },
  
  v1: {
    TYPE_FIELD: 'type',
    VALUE_FIELD: 'val',
    VALUE_TYPE_FIELD: 'valuetype',
    INPUTS_FIELD: 'inputs',
    OPERATOR_FIELD: 'op',
    FUNCTION_NAME_FIELD: 'op',
    SYMBOL_NAME_FIELD: 'name',
    PROPERTIES_FIELD: '', // by default us object itself as properties
    INPUT_NODE_TYPE_MAP: {
      'literal': 'LiteralNode',
      'binary': 'OperatorNode',
      'unary': 'OperatorNode',
      'math': 'FunctionNode',
      'property': 'FunctionNode',
      'function': 'FunctionNode'
    },
    INPUT_NODE_TRANSFORM: function(node) {
      // take care of math constants
      if (node.type == "math" && equalsEpsilon(node.val, Math.PI)) {
        node.type = "literal";
      }
      //delete node.stack;
      return node;
    },
    OUTPUT_NODE_TYPE_MAP: {
      // for output, define output format explicitly (input format it not invertible)
      'LiteralNode': 'literal',
      'OperatorNode': 'binary',
      'FunctionNode': 'math'
    }
  }

}

module.exports.default = module.exports.v2;