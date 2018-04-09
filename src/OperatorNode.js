var FunctionNode = require('./FunctionNode');

var COMMUTATIVE_OPERATORS = ['+','*'];
var FUNCTION_NAMES = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide'
  // TODO: add ops
}

function OperatorNode(op, inputs, properties) {
  if (!(this instanceof OperatorNode)) { return new OperatorNode(op, inputs, properties); }

  FunctionNode.call(this, FUNCTION_NAMES[op], inputs, properties);

  this.op = op;

  this.commutative = COMMUTATIVE_OPERATORS.includes(op);
}

OperatorNode.prototype = new FunctionNode();
OperatorNode.prototype.type = 'OperatorNode';

OperatorNode.prototype.toString = function() {
  return this.op;
}

module.exports = OperatorNode;
