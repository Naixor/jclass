var mocha = require('mocha');
var expect = require('chai').expect;
var JClass = require('../src/jclass');

describe('One class is ok', function() {
	var Animal;
	before(function() {
		Animal = JClass.class('Animal', {
			Animal: function(name) {
				this.name = name;
			},
			private: {
				name: "Animal",
				pSay: function() {
					return "pSay: " + this.name;
				}
			},
			public: {
				say: function() {
					return this.pSay();
				},
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
		console.log('Create a class Animal.');
	});

	it('Animal\'s static variable/method is ok.', function(done) {
		expect(Animal.sName).to.equal('hehe');
		expect(Animal.getName()).to.equal('hehe');
		done();
	});

	it('Now change Animal\'s static variable sName and static method getName is ok.', function(done) {
		Animal.sName = "haha";
		expect(Animal.getName()).to.equal('haha');
		done();
	});

	it('Instantiation Animal as a = new Animal("A"), then a\'s private variable/method is ok.', function(done) {
		var a = new Animal('A');
		expect(a.name).to.be.undefined;
		expect(a.pSay).to.be.undefined;
		expect(a.getName()).to.eql('A');
		expect(a.say()).to.eql('pSay: A');
		done();
	});
});

describe('One class extends another one is ok.', function() {
	var Animal, Dog;
	before(function() {
		Animal = JClass.class('Animal', {
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
		console.log('Create a class Animal.');

		Dog = JClass.class('Dog').extends(Animal, {
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
		console.log('Create another class Dog extends Animal.');
	});

	it('Static will be extended.', function(done) {
		expect(Dog.sName).to.equal(Animal.sName);
		expect(Dog.getName()).to.equal(Animal.getName());
		done();
	});

	it('Change static variable is ok.', function(done) {
		Dog.sName = 'haha';
		expect(Dog.sName).to.equal('haha');
		expect(Dog.getName()).to.equal('haha');
		expect(Animal.getName()).to.equal('hehe');
		done();
	});

	it('Private can not be extended and public can be extended.', function(done) {
		var b = new Dog('B');
		expect(b.name).to.be.undefined;
		expect(b.getName()).to.equal('B');
		done();
	});

	it('Super class\'s private variable can be got with this.$super.getName().', function(done) {
		var b = new Dog('B');
		expect(b.say()).to.equal('B');
		b.setName('BB')
		expect(b.say()).to.equal('BB');
		done();
	});
});