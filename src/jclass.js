try {
    window;
    module;
} catch (e) {
    if (/window/.test(e.toString())) {
        window = null;
    } 
    if (/module/.test(e.toString())) {
        module = null;
    }
}
;(function(window, module) {
    var JClass = {};
    JClass.class = function(className, prop) {
        if (!prop) {
            return {
                extends: function(parent, prop) {
                    return build(className, prop, parent);
                }
            }
        } else {
            return build(className, prop);
        }

        function build(className, prop, parent) {
            var _map = {};
            var privates = prop.private && Object.keys(prop.private) || [],
                publics = prop.public && Object.keys(prop.public) || [],
                statics = prop.static && Object.keys(prop.static) || [],
                constructor = typeof prop[className] === 'function' ? prop[className] : function(){},
                _super = null;
            
            privates.forEach(function(key) {
                _map[key] = 'private';
            });
            publics.forEach(function(key) {
                if (_map[key]) {
                    throw new Error('You can not set one name for both public and '+ _map[key] +'!');
                };
                _map[key] = 'public';
            });
            // statics.forEach(function(key) {
            //  if (_map[key]) {
            //      throw new Error('You can not set one name for both static and '+ _map[key] +'!');
            //  };
            //  _map[key] = 'static';
            // });

            if (_map.super) {
                throw new Error('Super is a key word, can not be set.');
            };

            if (parent && parent.__ClassName__) {
                throw new Error('Your parent class is not use JSClass build.');
                if (parent.__ClassName__ === className) {
                    throw new Error('You can not set a class extends with itself!');
                }
            }

            if (parent) {
                _super = new parent;
                statics = statics.concat(Object.keys(parent));
            } else {
                parent = Object.create(null);
                _super = Object.create({});
            }

            function typeOf (value) {
                return Object.prototype.toString.call(value).slice(8, -1);
            };
            function merge (source, target) {
                var keys = Object.keys(target);
                keys.forEach(function(key) {
                    // if (target.hasOwnProperty(key)) {
                    source[key] = target[key];
                    // }
                });  
            };

            function createThis (_super) {
                var _this = function (){};
                _this.prototype = _super;
                var $this = new _this();
                $this.$super = _super.constructor;
                merge($this.$super, _super);
                return $this;
            }

            var Class = function(){
                this.__ClassName__ = className;
                var that = this;

                var privateThis = {},
                    protectedThis = {},
                    This = createThis(_super);

                privates.forEach(function(key) {
                    if (typeOf(prop.private[key]) !== 'Function') {
                        privateThis[key] = prop.private[key];
                        This[key] = prop.private[key];
                    } else {
                        privateThis[key] = prop.private[key].bind(This);
                        This[key] = prop.private[key].bind(This);
                    }
                });

                publics.forEach(function(key) {
                    if (typeOf(prop.public[key]) !== 'Function') {
                        that[key] = prop.public[key];
                        This[key] = prop.public[key];
                    } else {
                        that[key] = prop.public[key].bind(This);
                        This[key] = prop.public[key].bind(This);
                    }
                });

                constructor.apply(This, arguments);
                this.constructor = constructor.bind(This);
            };

            if (_super) {
                Class.prototype = _super;
            };
            // Class.prototype.constructor = _super.constructor;

            statics.forEach(function(st) {
                Class[st] = prop.static && prop.static[st] || parent[st];
            });

            return Class;
        }
    };
    if (module) {
        module.exports = JClass
    } else {
        window.JClass = JClass;
    }
})(window, module)