## Object
### 属性
#### 数据属性
|属性名|说明|默认值|
---|:--:|---:
|configurable|可删除，或者可以修改特性|true|
|enumerable|可通过for-in返回|true|
|writable|可修改|true|
|value|实际的值|undefined|

#### defineProperty
|参数名|说明|
---|:--:
|被添加属性的对象|-|
|属性的名称|-|
|描述符对象|-|

``` javascript
let a = {}
Object.defineProperty(
  a, "b", {
    writable: false,
    value, "n"
  }
)

console.log(a)
```
``` json
{"b": "n"}
```

#### 访问器属性
|属性名|说明|默认值|
---|:--:|---:
|configurable|可删除，或者可以修改特性|true|
|enumerable|可通过for-in返回|true|
|get|-|undefined|
|set|-|undefined|

``` javascript
let a = {
  b: 1
};
Object.defineProperty(
  a, "d", {
    get() {
      return 3
    },
    set(value) {
      this.b = value + 1
    }
  }
);

console.log(a.d)
a.d = 1
console.log(a.d)
console.log(a.b)
```
``` json
3
3
2
```

#### 常用对象方法
Object.getOwnPropertyDescriptor
|函数|说明|参数|
---|:--:|---:
|Object.getOwnPropertyDescriptor|获取指定属性的属性描述符|对象、属性|
|object.propertyIsEnumerable|对象属性是否可以枚举|对象、属性|
|object.hasOwnProperty|是否为自有属性|属性|
|object.hasPrototypeProperty|是否有原型属性|属性|
|Object.assign|将propertyIsEnumerable、hasOwnProperty返回true的对象属性赋值到新的对象，使用旧对象的get属性和新对象的set属性|-|
|Object.keys|返回所有可枚举的属性名称的列表|-|
|Object.getOwnPropertyNames|-|-|
|Object.getOwnPropertySymbols|-|-|
|Object.keys|返回所有可枚举的属性名称的列表|-|
|Object.values|返回所有可枚举的属性数值的列表|-|
|Object.entries|返回所有可枚举的属性[名称，数值]的列表|-|
#### 对象等于判定
Object.is(true, 1)
#### 增强语法
属性简写
``` javascript
let a = "a"
let b = { "a": a }
let b = { a: a }
let b = { a }
```
可计算属性
``` javascript
let a = "a"
let b = { [a]: "c" }
let b = { a: a }
let b = { a }
```
简写方法
``` javascript
let b = {
  name_: "",
  get name() {
    return '123'
  },
  set name(e) {
    this.name_ = e
  }
}
```
#### 对象解构
``` javascript
let a = {
  b: "1",
  c: "2"
}
// 普通赋值
let {b, c} = a
let {b: e, c: f} = a
// 结构赋值
let g = {}
({b: g.b1, c: g.c1} = a) // 括号不能省略
// 嵌套解构
let h = {
  a: '1',
  b: {
    c: '2'
  }
}
let {b: {c: i}} = h
console.log(b, c, e, f)
console.log(g)
console.log(i)
```
``` json
1, 2, 1, 2
{b: '1', c: '2'}
2
```
__解构可以分解为多个顺序操作。一个报错，之后的会失败__
``` javascript
let a = {
  b: "1",
  c: "2"
}
let b1, c1, d1
try {
  ({b: b1, d: {d1}, c: c1} = a)
} catch(e) {}
console.log(b1, c1, d1)
```
``` json
1, undefined, undefined
```

### 对象创建
#### 工厂模式
``` javascript
function person(a, b, c) {
  let o = {}; // let o = new Object()
  o.a = a
  o.b = b
  o.c = c
  o.print = function() {
    console.log(this)
  }
  return o
}
let person1 = person(1, 2, 3)
person1.print()
```
#### 构造函数模式
``` javascript
function Person(a, b, c) {
  this.a = a
  this.b = b
  this.c = c
  this.print = function() {
    console.log(this)
  }
}
let person2 = new Person(1, 2, 3)
person2.print()
```
##### 区别
* 没有显示创建对象
* 属性和方法直接赋值给 this
* 没有 return

##### new 实现得功能
* 内存中创建一个对象
* 新对象内部得prototype特性会被赋值给构造函数得prototype属性
* this 指向新对象
* 函数(构造函数)给新的对象添加属性
* 如果函数(构造函数)返回非空，则返回，否则返回空。

##### constructor
每一个对象都有一个constructor属性，当使用new+构造函数时。constructor指向函数\
```
person2.constructor === Person
```
问题\
每一个实例，会对所有属性创建一遍
```
function Person() {
  this.a = "1"
  this.func = function() {
    console.log(this.a)
  }
}
// 等价于
function Person() {
  this.a = "1"
  this.func = new Function("console.log(this.a)")
}
let person1 = new Person()
let person2 = new Person()

person1.func === person2.func // false
```
#### 原型模式
每个对象都会创建一个 prototype 属性，prototype 也是一个对象。包含类型的所有的共享的属性和方法。\
实际就是构造函数创建的对象的原型
```javascript
function Person() {} // let Person = function() {}
Person.prototype.a = 1
Person.prototype.b = 1
Person.prototype.c = function() {
  console.log(this.a)
}
// 也完全可以这么写
// Person.prototype = {
//   a: 1,
//   b: 1
//   c() {
//   console.log(this.a)
//   }
// }
let persion1 = new Person()
persion1.c()
```
##### 原型链
创建一个函数时，会按照规则为函数创建一个 prototype 属性(指向原型对象)。所有原型对象获得一个 constructor 属性，指向与之关联的构造函数。\
当构造函数创建对象时， prototype 自动指向构造函数的原型对象。每个对象(非IE浏览器)包含一个__proto__属性，通过这个属性可以访问对象的原型。\
实例于构造函数原型有直接的关系，但是实例和构造函数没有直接关系。
```javascript
function Person() { this.a = 1}
let person1 = new Person()
let person2 = new Person()

console.log(typeof Person.prototype) // object
console.log(Person.prototype) // {}
console.log(Person.prototype.constructor) // function Person() { this.a = 1}
console.log(Person === Person.prototype.constructor) // true

console.log(person1.__proto__ === Person.prototype) // true
console.log(person1.__proto__.constructor === Person) // true
console.log(person1.__proto__ === person2.__proto__) // true

console.log(person1 instanceof Person) // true
console.log(person1 instanceof Object) // true
```
##### 原型层级
先搜索实例本身，之后搜索对象原型
``` javascript
function Person() {}
Person.prototype.a = 1
let person1 = new Person()
let person2 = new Person()
person1.a = '3'
console.log(person1.a) // 3
console.log(person2.a) // 1
delete person1.a
console.log(person1.a) // 1
```
##### in 和 hasOwnProperty 的区别
in 只要通过对象可以访问，就返回true\
只有属性在实例时，hasOwnProperty才会返true
``` javascript
function Person() {}
Person.prototype.a = 1
let person1 = new Person()
person1.b = 2
console.log('a' in person1) // true
console.log('b' in person1) // true
console.log(person1.hasOwnProperty('a')) // false
console.log(person1.hasOwnProperty('b')) // true
```
##### 原型重写和动态原型
可以随时给原型增加或者修改属性，并立即反应到对象实例上。
``` javascript
function Person() {}
let person1 = new Person()
Person.prototype.a = function() {}
person1.a() // 运行成功
```
重写原型，会切断之前的原型和实例的关系\
实例依然指向最初的原型
``` javascript
function Person() {}
Person.prototype.a = function() {}
let person1 = new Person()
Person.prototype = {
  b: function() {}
}
person1.a() // 运行成功
person1.b() // 运行失败
```
重写原型后，Person.prototype.constructor不指向Person。默认指向Object的构造函数。可以通过直接设置constructor。但此时的constructor认为 enumerable属性为true。但是默认的constructor的enumerable属性为false
``` javascript
function Person() {}
Person.prototype = {
  constructor: Person
  b: function() {}
}
// 此时 for-in可以访问到constructor
```
``` javascript
function Person() {}
Person.prototype = {
  b: function() {}
}
Object.definProperty(
  Person.prototype, 'constructor', {
    enumerable: false,
    value: Person
  }
)
// 此时 for-in可以访问到constructor
```
## 类
### 类定义
```
class Person {}
const Person = class {}
```
__和函数表达式的区别__
* 函数申明可以提升，类的申明不能提升
```
console.log(function1) // undefined
var function1 = function() {}
console.log(function1) // function() {}

console.log(function2) // function2() {}
function function2() {}
console.log(function2) // function2() {}

console.log(class1) // undefined
var class1 = class {}
console.log(class1) // class {}

console.log(class2) // ReferenceError: class2 is not defined
class class2 {}
console.log(class2) // class class2 {}
```
### 类的构造函数和实例化
constructor 关键字，用于在类中创造类的构造函数。不定义为空函数\
使用new操作符实例化一个类，相当于使用new调用构造函数
##### new 实现得功能
* 内存中创建一个对象
* 新对象内部得prototype特性会被赋值给构造函数得prototype属性
* this 指向新对象
* 函数(构造函数)给新的对象添加属性
* 如果函数(构造函数)返回非空，则返回，否则返回空。

__和函数表达式的区别__\
类的构造函数必须以 new 调用，不然会报错。\
普通对象构造函数如果不以new调用。会议全局 this (window)作为内部对象(this)\
没有正式的类的数据类型。需要把js的类作为一种特殊函数

类的prototyoe属性，也有一个constructor属性指向类本身\
```javascript
class Person{}
console.log(Person.prototype) // { contructor: f() }
console.log(Person === Person.prototype.contructor) // true
```
类作为特殊函数，也可以被作为参数传递
```javascript
class Person{ b() {}}
function func1(cl1) {
  return new cl1()
}
let a = func1(Person)
console.log(a) // Person {}
```
### 实例、原型、类成员
每次通过new调用，会执行构造函数。在函数内部，创建新的实例 this 并添加属性\
构造函数执行完毕之后，仍然可以给实例继续添加新成员\
每个实例都对应一个唯一的成员对象。所有成员不会再原型上共享\

__为了方便实例之间共享方法，在类块中定义的方法都在原型上__
```javascript
class Person {
  constructor() {
    this.b = () => {}
    this.c = 1
  }
  a() {}
}
let person1 = new Person()
let person2 = new Person()
console.log(person1 === person2) // true
console.log(person1.a === person2.a) // true
console.log(person1.b === person2.b) // false
```
__类块中不能添加原始值或者对象作为成员的数据__
```javascript
class Person{
  a: 1
}
// Uncaught SyntaxError: Unexpected identifier 'a'
``` 
### 继承
extends \
继承，可以继承任何拥有 construct 和原型的对象。
可以继承普通的构造函数
```javascript
class A1 {}
class A2 extends A1 {}
let a = new A2()
console.log(a instanceof A1) // true
console.log(a instanceof A2) // true

function B1() {}
class B2 extends B1 {}
let b = new B2()
console.log(b instanceof B1) // true
console.log(b instanceof B2) // true
```
#### 构造函数、HomeObject、super
派生类的方法可以通过 super 关键词访问原型。关键字只能在派生类使用。并且只限于类的构造函数、实例方法、静态方法
```javascript
class A1 {
  constructor() {
    console.log('A1 constructor')
  }
  a() {
    console.log('A1 a')
  }
  static b() {
    console.log('A1 b')
  }
}
class A2 extends A1 {
  constructor() {
    super()
    console.log('A2 constructor')
  }
  a() {
    super.a()
    console.log('A2 a')
  }
  static b() {
    super.b()
    console.log('A1 b')
  }
}
let a = new A2()
a.a()
A2.b()
a.b()
```
```javascript
A1 constructor
A2 constructor
A1 a
A2 a
A1 b
A1 b
Uncaught TypeError: a.b is not a function
```
