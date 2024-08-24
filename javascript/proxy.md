## Proxy
### 创建代理
代理使用Proxy构造函数创建。本函数需要两个参数，目标对象和处理程序对象
``` javascript
const target = {
  a: 0
}
const handler = {}
const proxy = new Proxy(target, handler)
console.log(target.a) // 0
console.log(proxy.a) // 0

target.a = 1
console.log(target.a) // 1
console.log(proxy.a) // 1

target.b = 2
console.log(target.b) // 2
console.log(proxy.b) // 2

proxy.c = 3
console.log(target.c) // 3
console.log(proxy.c) // 3

console.log(target) // {a: 1, b: 2, c: 3}
console.log(proxy) // Proxy(Object) {a: 1, b: 2, c: 3}

// Proxy.prototype 是undefine
console.log(target.prototype) // undefine
console.log(proxy.prototype) // undefine
```

### 捕获器
捕获器共13个，常用有 get, set, has, defineProperty, apply, construct
``` javascript
const target = {
  a: 0
}
const handler = {
  get() {
    return 1
  }
}
const proxy = new Proxy(target, handler)
console.log(target.a) // 0
console.log(proxy.a) // 1

console.log(target.b) // undefined
console.log(proxy.b) // 1
```
捕获器可以访问对应的参数
get为 目标对象，属性名称，代理对象三个
``` javascript
const target = {
  a: 0
}
const handler = {
  get(targetItem, propertyItem, proxyItem) {
    console.log(targetItem === target) // true
    console.log(propertyItem) // a
    console.log(proxyItem === proxy) // true
  }
}
const proxy = new Proxy(target, handler)
console.log(proxy.a) // undefined
```
### 反射
每个捕获器都可以基于自己支持的参数重建原始操作，但是不同捕获器支持的参数大不一样。为了方便重建原始行为，提供了一个全局对象 Reflect (反射)。封装了所有的原始行为。
所以有以下
``` javascript
const target = {
  a: 0
}
const handler = {
  get(targetItem, propertyItem, proxyItem) {
    return Reflect.get(...arguments)
  }
}
const proxy = new Proxy(target, handler)
console.log(proxy.a) // 0

const handler1 = {
  get: Reflect.get
}
const proxy1 = new Proxy(target, handler1)
console.log(proxy1.a) // 0

// const handler2 = {}
const proxy2 = new Proxy(target, Reflect)
console.log(proxy2.a) // 0

const handler3 = {
  get(targetItem, propertyItem, proxyItem) {
    return Reflect.get(...arguments) + 1
  }
}
const proxy3 = new Proxy(target, handler3)
console.log(proxy3.a) // 1
```
### 捕获器不变 和 撤销
``` javascript
const target = {}
Object.defineProperty(
  target, 'a',  {
    configurable: false,
    writable: false,
    value: '1'
  }
)
const handler = {
  get(targetItem, propertyItem, proxyItem) {
    return '1'
  }
}
const proxy = new Proxy(target, handler)

const handler1 = {
  get(targetItem, propertyItem, proxyItem) {
    return '2'
  }
}
const proxy1 = new Proxy(target, handler1)

// 由于变量不可修改。handler1 中相当于返回了一个变化了的值。这个是不可能的
// 这种机制被称为 捕获器不变
console.log(target.a) // 1
console.log(proxy.a) // 1
console.log(proxy1.a) // TypeError: 'get' on proxy: property 'a' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected '1' but got '2')
```
Proxy提供了revocable方法。这个方法支持撤销代理和目标对象的关联。\
撤销操作是不可逆的，并且幂等
``` javascript
const target = {}
const handler = {
  get() {
    return '1'
  }
}

const res = Proxy.revocable(target, handler)
console.log(res) // {proxy: Proxy(Object), revoke: ƒ}
const { proxy, revoke } = res

console.log(proxy.a) // 1

// 重复调用看不到任何效果
revoke()
revoke()
console.log(proxy.a) // TypeError: Cannot perform 'get' on a proxy that has been revoked
```
### 代理的不足
方法中的this 一般指向调用方法的对象
``` javascript
  a() {
      return this
  }
}
const proxy = new Proxy(target, {})

console.log(target.a()) // {a: ƒ}
console.log(proxy.a()) // Proxy(Object) {a: ƒ}
```
基于this的内存槽位的对象，可能报错
``` javascript
const target = new Date()
const proxy = new Proxy(target, {})

console.log(proxy instanceof Date) // true
proxy.getDate() // TypeError: this is not a Date object.
```
### 代理的设计模式和可能的使用场景
1. 跟踪属性的访问\
通过对 get, set, has 的操作，可以知道对象什么时候被访问、被查询。
``` javascript
const target = {
  a:1
}
const proxy = new Proxy(target, {
  get() {
    console.log('get')
    return Reflect.get(...arguments)
  },
  set() {
    console.log('set')
    return Reflect.set(...arguments)
  },
  has() {
    console.log('has')
    return Reflect.has(...arguments)
  },
})
proxy.a // get
proxy.a = 1 // set
'a' in proxy // has
```
2. 隐藏属性、静止修改
``` javascript
const target = {
  a: 1,
  b: 2
}
const proxy = new Proxy(target, {
  get() {
    if (arguments[1] === 'a') {
      return Reflect.get(...arguments)
    } else {
      return undefined
    }
  },
  set() {
    if (arguments[1] === 'b') {
      return Reflect.set(...arguments)
    }
    return true
  },
})
console.log(proxy.a) // 1
console.log(proxy.b) // undefined
proxy.a = 3
proxy.b = 3
console.log(proxy) // Proxy(Object) {a: 1, b: 3}
```
3. 函、构造函数参数验证
4. 数据绑定于可观察对象
