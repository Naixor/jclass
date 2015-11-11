# 仿照Java OOP写法实现的一个JS OOP库，可用于node和浏览器环境开发

## 特性

```Javascript
// 创建
// 仿照Java中`class A extends B`的形式开发，支持相对于JS层次上的`private` `public` `static`
var Animal = JClass.class('Animal', {
    Animal: function(name) {
        this.name = name;
    },
    private: {
        name: "Animal",
    },
    public: {
        setName: function(name) {
            this.name = name;
        },
        getName: function() {
            return this.name;
        }
    },
    static: {
        sName: 'hehe',
        getName: function() {
            return this.sName;
        }
    }
}); 
// 继承
// 可通过`this.$super.`来调用父亲以及曾父亲...的方法，`this.$super()`相当于类方法，作用等同于Java中`super`
var Dog = JClass.class('Dog').extends(Animal, {
    Dog: function(_name) {
        this.$super(_name);
    },
    private: {
        _name: 'a dog'
    },
    public: {
        setName: function(name) {
            this.$super.setName(name);
        },
        _getName: function() {
            return this._name;
        },
        say: function() {
            return this.$super.getName();
        }
    }
});
```

## 使用

`node`下直接`require('yourjclaspath/jclass')`
浏览器环境下直接通过`<script>`引入`jclass.js`文件就好
语法可参见`test/class.js`用例中的使用方法

## 联系

欢迎提出各种改进意见~