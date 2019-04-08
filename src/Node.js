
function Node(value, properties) {
  // constructor can be used as factory function without 'new'
  if (!(this instanceof Node)) { return new Node(value, properties); }

  this.value = value;
  this.valueType = typeof value;

  this.properties = properties || {};
}

Node.prototype.type = 'Node';

Node.prototype.isNode = true;

Node.prototype.isLeafNode = function() {
  return !(this.inputs && (this.inputs.length > 0))
}

Node.prototype.getValue = function() {
  return this.value;
}

Node.prototype.toString = function() {
  // TODO: should string be enclosed in ""?
  return this.value + '';
}

Node.prototype.valueOf = function() {
  return this.value;
}

/**
Adds a value to an Array property.
*/
Node.prototype.addProperty = function(property, value) {
  this.properties[property] = this.properties[property] || [];
  this.properties[property].push(value);
}

/**
Adds a value to an Array property of the node and its descendents.
*/
Node.prototype.addPropertyToSubtree = function(property, value, test) {
  if (!test || test(this)) {
    this.addProperty(property, value);
    if (this.inputs) {
      this.inputs.forEach(n => n.addPropertyToSubtree(property, value, test));
    }
  }
}

Node.prototype.forEach = function(callback) {
  // no children -> nothing to do
  return;
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

/**
Return false if the tree rooted at this node does not match the given pattern,
Return an object {root: <Node>, symbols: {<name>: <Node>}} if the node matches the pattern.
*/
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

/**
Finds the first node for which the callback return true.
Traverses the graph in depth-first order.
*/

Node.prototype.findNodeByCallback = function(test) {
  if (test(this)) return this;
  if (this.inputs) {
    for (let i=0; i<this.inputs.length; i++) {
      let child = this.inputs[i];
      let found = child.findNodeByCallback(test);
      if (found) return found;
    }
  }
  return null;
}

/**
Traverses ancestors as long as callback returns true.
Returns node for which test for parent fails, or root node.
*/
Node.prototype.backtrack = function(test) {
  if (this.parent && test(this.parent)) {
    return this.parent.backtrack(test);
  }
  return this;
}


/**
Finds all occurences of the given pattern in the subgraph.
The provided callback is called with arguments (root: <Node>, symbols: {<name>: <Node>}) for each match.
*/
Node.prototype.find = function(pattern, callback, options) {

  var match = this.match(pattern);
  if (match) callback(match.root, match.symbols);

  if (this.inputs) {
    for (var i=0; i<this.inputs.length; i++) {
      this.inputs[i].find(pattern, callback, options);
    }
  }
}

/**
Finds all occurences of the given pattern in the subgraph.
Matched nodes are returned in an array
*/
Node.prototype.findAll = function(pattern, options) {
  var matches = [];
  this.find(pattern, (root, symbols) => matches.push({root: root, symbols: symbols}), options);
  return matches;
}

/**
Visit all nodes in the graph,
replace each node with the result of the callback before traversing further,
and return the transformed tree.
The graph is traversed depth first.
If the callback returns *undefined*, the node is kept unchanged.
If the callback returns *null*, the node is removed.
// TODO: clone each node to return a copy of the tree!
*/
Node.prototype.transform = function(callback, options) {

  var node = callback(this);
  if (node === undefined) node = this;

  if (node.inputs) {
    for (var i=0; i<node.inputs.length; i++) {
      node.inputs[i] = node.inputs[i].transform(callback, options);
    }
    node.inputs = node.inputs.filter(item => item !== null);
  }

  return node;
}

/**
Find all occurences of the given pattern in the subgraph, replace each match with
the result of the callback and return the transformed tree.
The graph is traversed depth first.
// TODO: clone each node to return a copy of the tree!
*/
Node.prototype.transformMatch = function(pattern, callback, options) {

  this.transform(node => {
    var match = node.match(pattern, options);
    if (!match) return node;
    else return callback(match.root, match.symbols);
  }, options);
}


// TODO: maybe inheritance should be set up like so:
// https://stackoverflow.com/a/4389429
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create

module.exports = Node;
