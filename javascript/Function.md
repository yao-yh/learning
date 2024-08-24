## Function
函数也有构造函数
``` javascript
let func = new Function('data1', 'data2', "console.log(data1, data2)")
func(1, 2) // 1, 2
```
不推荐以上用法。因为代码会被解释两遍。慎重选择\
js中没有函数重载，只有覆盖
### 箭头函数
``` javascript
let func1 = (a) => {
  console.log(a)
}
// 参数只有一个，可以省略括号
let func2 = a => {
  console.log(a)
}
// 函数体只有一行时，大括号可以省略。此时表示返回执行结果
let func3 = a => a
```
#### 箭头函数的局限性
1. 函数中不能使用以下默认对象\
  arguments、super、new.target
2. 不能用于构造函数
3. 没有prototype
### 函数的参数
ECMA函数的参数，并不关心传入的函数个数，多余或少于函数定义的参数数量，解释器都不会报错。可以认为只是为了方便和支持默认参数。\
提供了一个arguments对象。是一个类数据的对象(不是数组)可以通过中括号加下标访问参数。并可以通过arguments.length获取参数数量。箭头函数不能访问这个对象。\
ES6开始支持默认参数。arguments不能访问默认参数 \
函数提供多个默认参数时，遵循暂时性死区原则。后边的函数可以访问前边的。
``` javascript
function func1() {
  console.log(arguments) // Arguments(5) [1, 2, 3, 4, 5, callee: (...), Symbol(Symbol.iterator): ƒ]
}
func1(1, 2, 3, 4, 5)
function func2(value=1) {
  console.log(value) // 1
  console.log(arguments) // Arguments [callee: (...), Symbol(Symbol.iterator): ƒ]
}
func2()
function func3(value1=1, value2=value1) {
  console.log(value1, value2) // 1 1
}
func3()
function func4(value1=value2, value2=1) {
  console.log(value1, value2) // ReferenceError: Cannot access 'value2' before initialization
}
func4()
```
### 参数扩展、参数收集
ES6支持通过扩展操作符简单实现将数组内全部元素传入函数作为参数
``` javascript
function func1() {
  console.log(arguments)
}
const list = [1, 2, 3, 4, 5]
func1(...list) // Arguments(5) [1, 2, 3, 4, 5, callee: (...), Symbol(Symbol.iterator): ƒ]
func1.apply(null, list) // Arguments(5) [1, 2, 3, 4, 5, callee: (...), Symbol(Symbol.iterator): ƒ]
```
多个函数，每个参数数量不同，可以将参数组合成一个数组。\
组合的对象区别于arguments，是一个真正的数组。
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
``` javascript
```
