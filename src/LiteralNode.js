var Node = require('./Node');

function LiteralNode(value, properties) {
  // constructor can be used as factory function without 'new'
  if (!(this instanceof LiteralNode)) { return new LiteralNode(value, properties); }

  Node.call(this, value, properties);
}

LiteralNode.prototype = new Node();
LiteralNode.prototype.type = 'LiteralNode';

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
