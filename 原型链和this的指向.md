<p style="border-bottom:1px solid #ccc;font-size:2.5em;font-weight:bold;">前端JS高级第4天</p>
<hr>

# 今天内容

## 扩展继承方式

### ES5方法

var child = Object.create( parent, [对象] );

替换原型 来实现继承的，也就说 child对象的原型就是 parent

在通过第二个参数 设置对象属性时，

writable、enumerable、configurable 这些属性 默认都是 false。

```javascript
var parent = {
    talk: function(){
        console.log( 'talking' );
    }
};

var child = Object.create( parent, {
    name: {
        value: 'guoguo',
        writalbe: false, // 可写性 如果为false 表示该属性 是只读的
        enumerable: false, // 可以通过for in遍历到的属性 是 可枚举的
        configurable: false // 如果该属性值为false，在重新配置对象属性的 writalbe enumerable configurable就会报错
    }
} );

Object.defineProperty( child, 'name', {
    writable: true
} ); // 报错的

child.name = 'jingjing'; // 坑? 不会报错，默默的失败
console.log( child.name ); // guoguo
for( var k in child ){
    console.log( k );
}
```

### Object.defineProperty

### Object.defineProperties

## 原型链

默认 对象 都有原型，而且可以通过 对象本身 或者 其构造函数去获取。而原型的本质 也是 对象。

那么 原型也具有 非标准属性\__proto__ 找到 原型的原型。

原型链 是有 尽头，在原型链的末尾 是Object.prototype

默认 原型的原型 就是 Object.prototype

举个栗子
```javascript
var obj = {}; // Object
// obj -> Object.prototype -> null
console.log( obj.__proto__ );
console.log( obj.__proto__  == Object.prototype ); // true
console.log( obj.__proto__.__proto__ ); // null

var arr = [];
// arr -> Array.prototype -> Object.prototype -> null
console.log( arr.__proto__ );
console.log( arr.__proto__ == Array.prototype );
console.log( arr.__proto__.__proto__ == Object.prototype );

var date = new Date();
// date -> Date.prototype -> Object.prototype -> null
function Parent(){

}
var p = new Parent();
// p -> Parent.prototype -> Object.prototype -> null
function Child(){}
Child.prototype = p;
var c = new Child();
// c -> Child.prototype( p ) -> Parent.prototype -> Object.prototype -> null
```

### 概念

从任意对象出发到Object.prototype之间，存在一条由非标准属性\__proto__连接起来的，并且体现对象的继承层次关系的链式结构。该结构被叫做 对象的原型链。

### 属性搜索原则

当对象访问属性时,

* 首先在当前对象本身上去查找，如果找到就返回属性值，并停止查找；
* 如果没有找到，就向其原型上查找，如果找到就返回属性值，并停止查找；
* 如果还是没有找到，就继续向原型的原型上查找，直到Object.prototype;
* 如果找到就返回属性值；如果没有找到呢，就返回undefined。

### instanceof运算规则

instance 实例

of 的

<对象> instanceof 函数 判断该对象是否是指定函数的实例

规则：

如果 函数的原型属性 出现在 对象的原型链上，那么 表达式的返回值 是 true；否则，就是false。

## 函数

### 在JS中函数是一等公民

是因为 在js中 函数的使用方式 非常灵活，有些高级写法 都是由于函数的灵活性产生的。

1. 具有双重身份：既是 函数 也是 对象
2. 可以嵌套
3. 可以作为另一个函数的参数--回调函数
4. 可以作为另一个函数的返回值--闭包
5. 可以作为对象的属性值--对象的方法
6. 可以限定作用域--函数作用域 或者叫做 局部作用域

### 函数的创建

1. 声明式

```javascript
function fn( param ){
    // statement
}
```

2. 表达式

```javascript
var fn = function( param ){
    // statement
};
```

两者区别：前者 会有函数名和函数体的提升；而后者 只会将函数名提升（即变量名的提升）

3. Function构造函数 -- 不推荐使用Function来创建函数

在js中，所有的函数 都是 Function的实例。

var fnName = new Function( [arg1~argN], [body] );
* [arg1~argN] 可选参数，类型为 字符串，含义：表示定义生成函数的形参部分
* [body] 可选参数，类型为 字符串，含义：表示定义生成函数的函数体部分

在实际使用时，
* 如果没有传入任何实参，那么就创建一个没有的形参列表 并且函数体部分没有任何代码的函数
* 如果传入一个实参，相当于 指定了函数体部分
* 否则，最后一个参数 是 函数体部分，其他都是定义函数的形参
 
举个栗子

```javascript
var fn1 = new Function( 'console.log( 1 );' );
fn1();
var fn2 = new Funciton( 'n', 'console.log( n );' )
// ==
// function fn2( n ){
//     console.log( n );
// }
fn2( 2 );
```

## 函数的调用模式

目的：为了区分函数不同调用模式下的this指向问题

要认清this的指向，首先 要确定this属于哪个函数；然后再确定该函数的调用模式，最后通过函数调用模式来确定this。

### 普通函数的执行模式

就是 通过函数的名字 或者 参数 获取到函数体的引用，然后加上 一对圆括号 来执行函数。

在该模式下，this -> window对象

```javascript
function fn(){
    console.log( this );
}
fn(); // window
function foo( callback ){
    callback(); // window
} 

foo( fn );
```

### 构造函数执行模式

将函数当作构造函数来实例化对象，此时函数的调用模式 为 构造函数执行模式。

在该模式下，this -> 要实例化的对象

```javascript
function init(){
    this.name = 'init';
    console.log( this );
}
var i = new init(); // init实例化的对象
```

### 方法调用模式

将一个函数 赋值给 对象的属性，然后通过对象属性来调用函数，此时属于方法调用模式；

在该模式下，this -> 方法的调用者

```javascript
function fn(){
    console.log( this );
}

var obj = {
    foo: fn,
    foo1: function(){
        console.log( this );
    }
};

obj.foo();
obj.foo1();
```

### 上下文模式（call/apply模式）

可以改函数在执行时 内部的this指向

1. <fn>.call( thisObj, arg1 ~ argN );

* thisObj : 表示执行函数fn在执行时 this 的新指向；必须是对象类型，不是会尝试隐式转换，若失败就会抛出异常。
    如果传入的实参值 是 null | undefined，此时在 fn执行时，内部this -> window对象。
* arg1 ~ argN 可选的形参列表，给fn执行时 传入实参。

举个栗子
```javascript
var name = 'global';
var obj = {
    name: 'obj'
};

function fn( n, m ){
    // this = obj; error
    console.log( m + n );
    console.log( this.name );
}

fn(); // global
fn.call( obj, 1, 2 ); // obj
```

2. <fn>.apply( thisObj, <[数组]> )
* thisObj : 表示执行函数fn在执行时 this 的新指向；必须是对象类型，不是会尝试隐式转换，若失败就会抛出异常。
    如果传入的实参值 是 null | undefined，此时在 fn执行时，内部this -> window对象
* [数组]： 可选，通过数组元素给fn执行时传入实参。

举个栗子
```javascript
var name = 'global';
var obj = {
    name: 'obj'
};

function fn( n, m ){
    // this = obj; error
    console.log( m + n );
    console.log( this.name );
}

fn(); // global
fn.apply( obj, [ 1, 2 ] ); // obj
```

3. call 和 apply 的异同

相同点：a 都可以通过第一个参数 改变this； b 当函数调用call 或 apply方法时 都会立即执行函数

不同点：前者 通过可选的形参列表 给函数传入实参； 后者 通过可选的数组对象 给函数 传入实参。

### 上下文模式的应用

1. 改变this

2. 实现一种继承方式-借用构造函数

```javascript
function Parent( name, age, gender ){
    this.name = name;
    this.age = age;
    this.gender = gender;
}
function Child(  name, age, gender, address ){
    Parent.call( this, name, age, gender );
    this.address = address;
}

var c = new Child( 'child', 19, 'girl', 'beijing china' );
console.log( c );
```

3. 借调方法

* 伪数组对象借调数组方法

```javascript
var likeArray = {
    0: 1,
    1: 2,
    length: 2,
    name: 'guoguo'
};

likeArray[ 2 ] = 3;
likeArray[ 3 ] = 4;
likeArray.length = 4;

console.log( likeArray );
```

* 伪数组 转换成 真数组

```javascript
var likeArray = {
    0: 1,
    1: 2,
    length: 2,
    name: 'guoguo'
};

likeArray[ 2 ] = 3;
likeArray[ 3 ] = 4;
likeArray.length = 4;

console.log( likeArray );

var arr;

// arr = [];

// arr.push.apply( arr, likeArray );

arr = Array.prototype.slice.call( likeArray );

console.log( arr );
```

* 将数组元素 或 伪数组元素 作为函数的实参

```javascript
var arr1 = [ 1, 2 ];
var arr2 = [ 3, 4 ];

// arr1 = arr1.concat( arr2 );
arr1.push.apply( arr1, arr2 );

console.log( arr1 );
```

```javascript
var arr = [ 1, 20, 40, 21, 34 ];
var max = arr[ 0 ];
for( var i = 1; i < arr.length; i++ ){
    if( max < arr[ i ] ){
        max = arr[ i ];
    }
}

var max = Math.max.apply( null, arr );

console.log( max );
```

* 获取内置对象类型

在开发时，可能会需要获取内置对象的类型，比如 Array等等，根据数据的类型不同，而进行不同的逻辑处理。

Object.prototype.toString方法的实现，是返回对象的基本信息（包括 typeof 该对象的返回值 以及 对象的构造函数名）；
eg："[object Object]" "[object Array]"

对象的类型命名：通常使用构造函数的名字来表示对象的类型名。也就说，对象的类型名 就是 其构造函数的名称的小写方式。

```javascript
var obj = {};
console.log( obj.toString() );
function getType( obj ){
    // null undefined
    if( obj == null ){
        return obj + '';
    }
    // 如果obj是简单数据
    /* if( typeof obj != 'object' ){
        return typeof obj;
    } else { // 如果 obj 是 复杂数据
        return Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase();
    }*/
    return typeof obj == 'object' ?
        Object.prototype.toString.call( obj ).slice( 8, -1 ).toLowerCase() :
        typeof obj;
}
```