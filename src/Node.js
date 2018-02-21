
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

module.exports = Node;
