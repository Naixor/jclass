var util = {};
var op = Object.prototype;

module.exports = exports = util;

util.create = Object.create;
util.keys = Object.keys;

util.typeOf = function(value) {
  return op.toString.call(value).slice(8, -1);
};

util.isNaN = function(obj) {
  return !(obj === obj);
};

['Object', 'Array', 'String', 'Number', 'Undefined', 'Function'].forEach(function(type) {
  util['is' + type] = function(obj) {
    return Object.prototype.toString.call(obj) === '[object '+ type +']';
  }
});

util.isPurelyNumber = function(number) {
  return !util.isNaN(number) && util.isNumber(number);
};

util.isEmptyArray = function(arr) {
  return arr == !arr;
};

util.copy = function(source, target) {
  if (target === undefined) {
    target = source;
  };

  return target;
};

util.merge = function(target, source) {
  /**
   * in node 0.12.0
   * var obj = {};
   * for(var i = 0; i < 10000000; i++) {
   *   obj[i] = 'a'+i;
   * }
   * for(var i in obj) {
   *   if(!obj[i]) {
   *     console.log(1);
   *   }
   * } 7.9s~8.3s
   * var keys = exports.keys(obj);
   * keys.forEach(function(i, e) {
   *   if (!obj[e]) {
   *     console.log(1)
   *   };
   * }) 6.9s~7.2s
   * for(var i = 0,l = keys.length;i < l;i++) {
   *   if (!obj[keys[i]]) {
   *     console.log(1)
   *   };
   * } 8.1s~8.4s
   * so i use the fast way
   */
  var type = util.typeOf(target);

  if (type === 'Number' || type === 'Boolean' || type === 'String' || type === 'Null') {
    source = target;
  } else if (type === 'Object') {
    var keys = util.keys(target);
    keys.forEach(function(key) {
      if (source.hasOwnProperty(key)) {
        source[key] = util.merge(source[key], target[key]);
      }
    });  
  } else if(type === 'Array') {
    source = [];
    target.forEach(function(key) {
      source.push(key);
    });
  }

  return source;
};

util.random = (function(){
  var seed = new Date().getTime();
  function rnd(){
    seed = ( seed * 9301 + 49297 ) % 233280;
    return seed / ( 233280.0 );
  };
  return function random(number, afterPoint){
    if (number === 0) {
      return 0;      
    }
    number = number || 1;
    return util.isPurelyNumber(afterPoint) ? +(rnd(seed) * number).toFixed(afterPoint) : (rnd(seed) * number);
  };
})();