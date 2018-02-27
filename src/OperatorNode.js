var Node = require('./Node');

function OperatorNode(op, inputs, properties) {
  if (!(this instanceof OperatorNode)) { return new OperatorNode(op, inputs, properties); }

  Node.call(this, properties);

  this.op = op;
  this.valueType = typeof value;

  this.inputs = inputs;
}

OperatorNode.prototype = new Node();
OperatorNode.prototype.type = 'OperatorNode';

OperatorNode.prototype.toString = function() {
  return this.op;
}

/*
OperatorNode.prototype.valueOf = function() {
  return this.value;
}
*/

OperatorNode.prototype.forEach = function (callback) {
  for (var i = 0; i < this.inputs.length; i++) {
    callback(this.inputs[i], i, this);
  }
};

module.exports = OperatorNode;
