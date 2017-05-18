<p style="border-bottom:1px solid #ccc;font-size:2.5em;font-weight:bold;">前端JS高级第6天</p>
<hr>

# 今天内容

## 作用域链-重要

根据js中作用域的规则，函数是可以限定作用域的，并且函数 还可以嵌套声明，这样 就可以使用函数 分割作用域，然后在局部作用域中，又可以使用函数继续分割，那么就会产生一个作用域的链式结构。被称作是 作用域链。

### 变量的搜索原则

当访问某个变量时，
* 首先在当前作用域上去查找该变量，如果找到就返回变量值，并停止查找；
* 如果没有找到就向 上一层作用域去查找，如果找到就返回变量值，并停止查找；
* 如果还是没有找到，就继续上层作用域查找，直到全局作用域。
* 如果找到就返回变量值；如果没有找到就报错（xxx is not defined）.

### 绘制作用链-了解

在js中 执行一段代码 是需要执行环境的，而所谓执行环境 包含两个部分：

1. 硬件资源（cpu 内存）

2. 软件资源（变量 数据 对象）

在代码执行时，为了保证可以正确获取代码所需数据、变量，在实际的执行环境中，是存在一个对象来存储的。一般将该对象命名为变量对象。

实际变量对象存储的是 代码所在当前作用域定义的变量（数据）。而在函数执行环境中，用一个名叫 “活动对象”来存储函数内部定义的形参和局部变量。所以 此时活动对象 就是 变量对象。

```javascript
var n = 10;

function foo(){
    var n = 100;
    function fn( n ){
        var m = 1010;
        console.log( m );
        console.log( n );
    }
    fn()
}

function f(){
    console.log( n );
}

foo();
f();
```

## 闭包 --面试重点

在实际开发时，由于函数执行完毕后，内部定义的活动对象 会被垃圾回收机制的GC对象回收所占用的内存资源。因此在函数执行后，是无法在获取到内部定义的变量和数据的。然而在实际应用中，经常要将函数内部的数据 保存起来，也就说想要在函数外部访问内部的数据。

那么 就要通过闭包的技术 来解决上面的问题。

注意：在使用闭包 获取函数内部数据时，必须保证每一次通过同一闭包获取到的数据 都是 同一数据，只要才具有实际开发意义。

### 闭包的概念

MDN：可以访问那些自由变量（就是指 那些没有绑定到对象上的变量）的函数。
讲义：可以访问函数内部数据的函数。

闭包的本质 就是 函数。

```javascript
var obj = {};

var n = 10;  // 不是 自由变量
var m = 100; // 自由变量

obj.n = n;
```

### 闭包的本质

在下面的栗子中，fn 可以 获取foo内部的数据，因此fn就是闭包。同时 发现 fn其实就是 foo内部的函数。

因此 闭包 其实 就是 内层函数。

```javascript
function foo(){
    var m = 10;
    function fn(){
        return m;
    }

    return fn;
}

var f = foo();
console.log( f() );
console.log( f() );
```

看下列代码

```javascript
function foo(){
    var m = Math.random();
    function fn(){
        return m;
    }

    return fn;
}

var f1 = foo();
var f2 = foo();
console.log( f1() );
console.log( f1() );
console.log( f2() );
console.log( f2() );
```

通过上面代码发现，外层函数foo执行一次，就会创建新的闭包。而不同的闭包 所缓存的数据不能互相访问的。

### 闭包的作用

正常来说，函数执行后，内部定义的变量 会被回收掉，但是由于闭包的使用 会将函数内部的数据 全部缓存起来。当然更准确的说，是将函数执行时，定义的活动对象 以及作用域链 都缓存起来。

总结：闭包可以缓存数据。

### 闭包的基本结构

1. 外层函数

2. 定义变量

3. 定义内层函数（使用外部定义的变量）

4. 将内层函数 作为 外层函数的返回值

### 闭包的深入

实际需求：想要访问函数内部多个数据

闭包的基本结构可以解决访问函数内部的单个数据。

```javascript
/*function foo(){
    var n = 1;
    var m = 2;

    function getN(){
        return n;
    }
    function getM(){
        return m;
    }

    return {
        getN: getN,
        getM: getM
    };
}*/

function foo(){
    var n = 1;
    var m = 2;

    return {
        getN: function(){
            return n;
        },
        getM: function(){
            return m;
        }
    };
}

var obj = foo();
console.log( obj.getN() );
console.log( obj.getN() );
console.log( obj.getM() );
console.log( obj.getM() );
```

### 闭包的缺点

由于闭包可以缓存数据，因此在使用闭包时要格外的小心。闭包的使用会增大内存的开销，使用不当就会造成内存泄漏。

内存泄漏：由于开发人员书写代码的问题而导致内存被占满。

内存溢出：在开辟内存空间时，由于计算机所剩内存不够，而导致内存溢出。

在实际开发时，使用完闭包后要及时清除掉。即将存储闭包的变量赋值null。 （ 推荐 参考js中垃圾回收机制 ）

### 闭包的应用

1. 缓存数据

```javascript
function fib( n ){
    if( n == 1 || n == 2 ){
        return 1;
    } else {
        return fib( n - 1 ) + fib( n - 2 );
    }
}
```

上面的代码递归性能很低，主要原因是出现了双递归，出现多次的重复计算。
解决方案：就是将每一次计算后的结果 都保存起来。

在求n项值时，首先从缓存里获取数据。如果等到的值 是undefined的话，就重新计算结果，并将其缓存起来，在返回结算的结果。

```javascript
var fib = function(){
    var cache = [ , 1, 1, 2, 3, 5, 8, 13 ];
    return function( n ){
        var ret;
        // 1: 过滤无效参数
        if( n < 1 ){
            return undefined;
        }
        // 2: 从缓存读取数据
        ret = cache[ n ];
        // 3: 如果ret为undefined，要重新计算
        if( !ret ){
            if( n == 1 || n == 2 ){
                ret = 1;
            } else {
                ret = arguments.callee( n -1 ) + arguments.callee( n -2 );
            }
            // 4: 将计算后的结果缓存起来
            cache[ n ] = ret;
        }
        // 5: 返回计算的结果
        return ret;
    };
}();
```

```javascript
( function( global ){
    var cache = [ , 1, 1, 2, 3, 5, 8, 13 ];
    global.fib = function( n ){
        var ret;
        // 1: 过滤无效参数
        if( n < 1 ){
            return undefined;
        }
        // 2: 从缓存读取数据
        ret = cache[ n ];
        // 3: 如果ret为undefined，要重新计算
        if( !ret ){
            if( n == 1 || n == 2 ){
                ret = 1;
            } else {
                ret = arguments.callee( n -1 ) + arguments.callee( n -2 );
            }
            // 4: 将计算后的结果缓存起来
            cache[ n ] = ret;
        }
        // 5: 返回计算的结果
        return ret;
    };
} )( window );
```

2. 沙箱模式--模仿块级作用域

在后台语言中，使用的是 块级作用域，通常以一对花括号来表示一个块，在块的内部是一个局部的作用域，被称做是块级作用域。

在js中 只有函数作用域和全局作用域，可以通过函数来模仿块级作用域。

IIFE: 立即执行函数表达式

```javascript
( function(){ 
    // 块级作用域
} )();
```

```javascript
( function( global ){ 
    // 在实际使用时，通常将window对象传入匿名函数内部
    // 好处：减短变量搜索时间；便于代码压缩。
    // 在实际开发，尽量多的使用局部变量。
} )( window );
```

* 目的

解决在全局上定义过多的全局变量以及全局函数，进而导致污染window对象；同时解决命名冲突的问题。

* 本质就是IIFE（Immediately-Invoked Function Expression），即立即执行函数表达式

```javascript
// function(){}();

// 将立即执行函数 转换成 表达式
// 1
!( function () {} )();
// 2 
+( function () {} )();
// 3
( function () {} () );
// 4
( function ( global ) {

} )( window );
通常将常用的全局对象 或 全局变量 当作实参传入沙箱内。
好处：A 提高变量和属性的搜索性能 B 利于代码压缩。

```

3. 私有变量

在js中对象并没有私有的成员。定义一个对象后，可以在任何地方 通过对象去获取以及修改属性值。在实际开发时，根据实际需求对象的属性 应该通过接口（暴漏出来方法）来获取 和 设置。

但是，在js中却有私有变量的说法，在函数内部定义的变量 只有在函数内部可以访问，出了函数后，就无法在去访问。因此可以通过js去实现私有变量，间接的实现对象成员的私有化。

在ES5之前，创建的对象属性默认都是 可读可写的。

在实际开发时，根据业务需求 对象的某些属性 应该是只读属性。为了模拟出对象私有属性，可以使用闭包结构来实现

```javascript
// 让name属性变成只读的, age是可读可写
function Person( name,age ){
    return {
        getName: function(){
            return name;
        },
        getAge: function(){
            return age;
        },
        setAge: function( val ){
            age = val;
        }
    }
}

var guo = Person( 'guoguo', 21 );

// 获取名字
console.log( guo.getName() );
// 获取年龄
console.log( guo.getAge() );
guo.setAge( 23 );
console.log( guo.getAge() );
```

4. 单例模式 - 设计模式

单例模式 就是指 在内存 只会创建一个对象。

创建一个对象，通过其getInstance方法来获取单例的对象。

```javascript
var singleton = function(){
    var instance;
    function Manager( options ){
        this.name = options.name;
    }
    return {
        getInstance: function( args ){
            if( !instance ){
                instance = new Manager( args );
            }

            return instance;
        }
    };
}();

var s1 = singleton.getInstance({  name: 'guoguo' } );
var s2 = singleton.getInstance( { name: 'jingjing' } );
console.log( s1 == s2 );
```

```javascript
var singleton = function(){
    var instance;
    return {
        getInstance: function( factory, args ){
            if( !instance ){
                instance = new factory( args );
            }
            return instance;
        }
    };
}();

var s1 = singleton.getInstance( function( args ){
    this.name = args.name;
}, { name: 'guoguo' } );
var s2 = singleton.getInstance( function( args ){
    this.name = args.name;
}, { name: 'jingjing' } );

console.log( s1 == s2 );
```

```javascript
var singleton = function(){
    var instance;
    return {
        getInstance: function(){
            return instance;
        },
        init: function( factory, args ){
            instance = new factory( args );
            return this;
        }
    };
}();

var s1 = singleton.init( function( args ){
    this.name = args.name;
}, { name: 'guoguo' }  ).getInstance();

var s2 = singleton.getInstance();

console.log( s1 == s2 );
```

5. 扩展高阶函数

定义：函数作为参数 或 函数作为返回值的函数 被称为高阶函数

应用

* 回调函数

* 事件节流( 函数节流 )

debounce 和 throttle 可以限制函数的执行次数。

debounce 强制函数在某段时间内只执行一次， throttle 强制函数以固定的周期delay执行。在处理一些高频率触发的 DOM 事件的时候，它们都能极大提高用户体验。

以下场景往往由于事件频繁被触发，因而频繁执行DOM操作、资源加载等重行为，导致UI停顿甚至浏览器崩溃。

  1 window对象的resize、scroll事件

  2 拖拽时的mousemove事件

  3 射击游戏中的mousedown、keydown事件

  4 文字输入、自动完成的keyup事件

实际上对于window的resize事件，实际需求大多为停止改变大小n毫秒后执行后续处理；而其他事件大多的需求是以一定的频率执行后续处理。针对这两种需求就出现了debounce和throttle两种解决办法。

```javascript
var throttle = function( fn, delay ) {
    var timer,               // 定时器
        firstTime = true;    // 是否是第一次调用

    return function() {
        var args = arguments,
            context = this;

        if ( firstTime)  {    // 如果是第一次调用，不需延迟执行
            fn.apply( context, args );
            return firstTime = false;
        }

        if ( timer )  {    // 如果定时器还在，说明前一次延迟执行还没有完成
            return false;
        }

        timer = setTimeout( function() {  // 延迟一段时间执行
            clearTimeout( timer );
            timer = null;
            fn.apply( context, args );
        }, delay || 500 );
    };
};

var debounce = function( fn, delay ){
    var timer;
    return function(){
        var context = this,
            args = arguments;

        clearTimeout( timer );
        setTimeout( function() {
            fn.apply( context, args );
        }, delay || 500 );
    };
};
```

* 科里化currying

* 实现AOP

AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后，再通过“动态植入”的方式掺入业务逻辑模块中。这样做的好处首先是可以保持业务逻辑模块的纯净和高内聚性，其次是可以很方便地复用日志统计等功能模块。

通常，在JavaScript中实现AOP，都是指把一个函数“动态植入”到另外一个函数之中，具体的实现技术有很多，下面的例子通过扩展Function.prototype来做到这一点。

```javascript
Function.prototype.before = function( beforefn ) {
    var __self = this;    // 保存原函数的引用
    return function() {    // 返回包含了原函数和新函数的"代理"函数
        beforefn.apply( this, arguments );     // 执行新函数，修正this
        return __self.apply( this, arguments );    // 执行原函数
    }
};

Function.prototype.after = function( afterfn ) {
    var __self = this;
    return function() {
        var ret = __self.apply( this, arguments );
        afterfn.apply( this, arguments );
        return ret;
    }
};

var func = function() {
    console.log( 2 );
};

func = func.before(function() {
    console.log( 1 );
}).after(function() {
    console.log( 3 );
});

func();
```
