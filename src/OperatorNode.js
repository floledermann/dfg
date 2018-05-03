var FunctionNode = require('./FunctionNode');

var COMMUTATIVE_OPERATORS = ['+','*'];
var FUNCTION_NAMES = {
  '+': 'add',
  '-': 'subtract',
  '*': 'multiply',
  '/': 'divide',
  '%': 'remainder',
  '++': 'inc',
  '--': 'dec',
  '**': 'exp'
  // TODO: more operators?
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Expressions_and_Operators
}

function OperatorNode(op, inputs, value, properties) {
  // constructor can be used as factory function without 'new'
  if (!(this instanceof OperatorNode)) { return new OperatorNode(op, inputs, value, properties); }

  FunctionNode.call(this, FUNCTION_NAMES[op], inputs, value, properties);

  this.op = op;

  this.commutative = COMMUTATIVE_OPERATORS.includes(op);
}

OperatorNode.prototype = new FunctionNode();
OperatorNode.prototype.type = 'OperatorNode';

OperatorNode.prototype.toString = function() {
  return this.op;
}

module.exports = OperatorNode;
