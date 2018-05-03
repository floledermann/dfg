var Node = require('./Node');

// This can hold symbols (i.e. variable names) for abstract expressions
function SymbolNode(name, value, properties) {
  // constructor can be used as factory function without 'new'
  if (!(this instanceof SymbolNode)) { return new SymbolNode(name, value, properties); }

  Node.call(this, value, properties);

  this.name = name;
}

SymbolNode.prototype = new Node();
SymbolNode.prototype.type = 'SymbolNode';

SymbolNode.prototype.toString = function() {
  return this.name;
}

module.exports = SymbolNode;
