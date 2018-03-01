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

LiteralNode.prototype.match = function(pattern, options) {

  options = options ||  {};

  if (pattern.type == 'LiteralNode') {
    var match = (pattern.value === this.value);
    if (!match && options.epsilon && this.valueType == 'number' && pattern.valueType == 'number') {
      match = (Math.abs(this.value - pattern.value) < options.epsilon);
    }
    if (match) {
      return {
        root: this,
        symbols:{}
      }
    }
  }

  // check superclass (handles Symbols)
  return this.constructor.prototype.match.call(this, pattern);
}

module.exports = LiteralNode;
