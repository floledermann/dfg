var Node = require('./Node');

// This can hold symbols (i.e. variable names) for abstract expressions
function SymbolNode(name, properties) {
  if (!(this instanceof SymbolNode)) { return new SymbolNode(name, properties); }

  Node.call(this, properties);

  this.name = name;
}

SymbolNode.prototype = new Node();
SymbolNode.prototype.type = 'SymbolNode';

SymbolNode.prototype.toString = function() {
  return this.name;
}

SymbolNode.prototype.valueOf = function() {
  return undefined;
}

SymbolNode.prototype.forEach = function (callback) {
  // nothing to do, we don't have children
};

module.exports = SymbolNode;
