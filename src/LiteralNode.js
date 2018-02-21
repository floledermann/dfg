var Node = require('./Node');

function LiteralNode(value, properties) {
  if (!(this instanceof LiteralNode)) { return new LiteralNode(value, properties); }

  Node.call(this, properties);

  this.value = value;
  this.valueType = typeof value;
}

LiteralNode.prototype = new Node();
LiteralNode.prototype.type = 'LiteralNode';

LiteralNode.prototype.toString = function() {
  return this.value + '';
}

LiteralNode.prototype.valueOf = function() {
  return this.value;
}

LiteralNode.prototype.forEach = function (callback) {
  // nothing to do, we don't have children
};

module.exports = LiteralNode;
