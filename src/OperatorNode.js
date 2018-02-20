var Node = reuqire('./Node');

function OperatorNode(op, children, properties) {
  if (!(this instanceof OperatorNode)) { return new OperatorNode(op, children, properties); }

  this.op = op;
  this.valueType = typeof value;

  this.children = children;

  this.properties = properties;
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
  for (var i = 0; i < this.children.length; i++) {
    callback(this.children[i], i, this);
  }
};

module.exports = OperatorNode;
