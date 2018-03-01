
function Node(properties) {
  if (!(this instanceof Node)) { return new Node(); }

  this.properties = properties || {};
}

Node.prototype.type = 'Node';

Node.prototype.isNode = true;

Node.prototype.getValue = function() {
  return this.value;
}

Node.prototype.traverse = function(callback) {
  // execute callback for itself
  callback(this, null, null);

  // recursively traverse over all childs of a node
  function _traverse(node, callback) {
    node.forEach(function (child, index, parent) {
      callback(child, index, parent);
      _traverse(child, callback);
    });
  }

  _traverse(this, callback);
};

// Return false if the tree rooted at this node does not match the given pattern
// Return an object {root: <Node>, symbols: {<name>: <Node>}} if the pattern is found

Node.prototype.match = function(pattern, options) {

  // base class only matches Symbols

  if (pattern.type == 'SymbolNode') {
    symbols = {};
    symbols[pattern.name] = this;
    return {
      root: this,
      symbols: symbols
    }
  }

  return false;

}

// Finds the given pattern in the subgraph
// Return false if the tree rooted at this node does not contain the given pattern
// Return an object {root: <Node>, symbols: {<name>: <Node>}} if the pattern is found

Node.prototype.find = function(pattern, options) {

  var match = this.match(pattern);
  if (match) return match;

  if (this.inputs && this.inputs.length) {
    // TODO: support finding ALL matches
    for (var i=0; i<this.inputs.length; i++) {
      match = this.inputs[i].find(pattern);
      if (match) return match;
    }
  }

  return false;

}

// TODO: maybe inheritance should be set up like so:
// https://stackoverflow.com/a/4389429
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

module.exports = Node;
