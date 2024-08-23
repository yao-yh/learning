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





































































































