var Node = require('./Node');

// TODO
COMMUTATIVE_FUNCTIONS = [
  'add',
  'multiply'
];

function FunctionNode(name, inputs, properties) {
  if (!(this instanceof FunctionNode)) { return new FunctionNode(name, inputs, properties); }

  Node.call(this, properties);

  this.name = name;
  this.inputs = inputs;

  this.commutative = COMMUTATIVE_FUNCTIONS.includes(name);

}

FunctionNode.prototype = new Node();
FunctionNode.prototype.type = 'FunctionNode';

FunctionNode.prototype.toString = function() {
  return this.name;
}

FunctionNode.prototype.forEach = function(callback) {
  for (var i = 0; i < this.inputs.length; i++) {
    callback(this.inputs[i], i, this);
  }
};

function permutate(inputArr) {

  var result = [];

  function generate(arr, m = []) {
    if (arr.length === 0) {
      result.push(m)
    }
    else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        generate(curr.slice(), m.concat(next))
      }
    }
  }

  generate(inputArr);

  return result;
}

function matchInputs(inputs, pattern, options) {
    var symbols = {};
    for (var i=0; i<inputs; i++) {
      var match = inputs[i].match(pattern.inputs[i], options);
      if (!match) return false;
      Object.assign(symbols, match.symbols);
    }
    return symbols;
}

FunctionNode.prototype.match = function(pattern, options) {

  if (pattern.type == this.type && pattern.name === this.name && pattern.inputs.length == this.inputs.length) {

    var symbols = {};

    if (this.commutative) {
      var permutations = permutate(this.inputs);
      var matched = false;
      for (var i=0; i<permutations.length; i++) {
        var match = matchInputs(permutations[i], pattern, options);
        if (match === false) continue;
        matched = true;
        symbols = match;
        break;
      }
      if (!matched) return false;
    }
    else {
      for (var i=0; i<this.inputs.length; i++) {
        var match = this.inputs[i].match(pattern.inputs[i], options);
        if (!match) return false;
        Object.assign(symbols, match.symbols);
      }
    }

    return {
      root: this,
      symbols: symbols
    }
  }

  // check superclass (handles Symbols)
  return this.constructor.prototype.match.call(this, pattern);
}

module.exports = FunctionNode;
