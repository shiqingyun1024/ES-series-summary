Proxy
1、概述
2、Proxy实例的方法
3、Proxy.revocable()
4、this问题
5、实例：web服务的客户端

## 1、概述
```
Proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元
编程”（meta programming），即对编程语言进行编程。
Proxy可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须
先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy
这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。
var obj = new Proxy({},{
    get:function(target,propKey,receiver){
       console.log(`getting ${propKey}!`);
       return Reflect.get(target,propKey,receiver);
    },
    set:function(target,propKey,value,receiver){
       console.log(`setting ${propKey}!`);
       return Reflect.set(target,propKey,value,receiver);
    }
})
上面代码对一个空对象架设一层拦截，重定义了属性的读取（get）和设置（set）
行为。这里暂时先不解释具体的语法，只看运行结果。对设置了拦截行为的对象obj，
去读写它的属性，就会得到下面的结果。
obj.count = 1
// setting count!
++obj.count
// getting count!
// setting count!
// 2
上面代码说明，Proxy实际上重载（overload）了点运算符，即用自己的定义覆盖了
语言的原始定义。

ES6原生提供Proxy构造函数，用来生成Proxy实例。
var proxy = new Proxy(target,handler);
Proxy 对象的所有用法，都是上面这种形式，不同的只是handler参数的参数的写法。其
中，new Proxy()表示生成Proxy实例，target参数表示所要拦截的目标对象，handler
参数也是一个对象，用来定制拦截行为。
下面是另一个拦截读取属性行为的例子。
var proxy = new Proxy({},{
    get: function(target,propKey){
        return 35;
    }
})
proxy.time // 35 
proxy.name // 35 
proxy.title // 35 

上面代码中，作为构造函数，Proxy接受两个参数。第一个参数是所要代理的目标对象
（上例是一个空对象），即如果没有Proxy的介入，操作原来要访问的就是这个对象：
第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，
该函数将拦截对应的操作。比如，上面代码中，配置对象有一个get方法，用来拦截对
目标对象属性的访问请求。get方法的两个参数分别是目标对象和所要访问的属性。可以
看到，由于拦截函数总是返回35，所以访问任何属性都得到35。

注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不
是针对目标对象（上例是空对象）进行操作。
如果handler没有设置任何拦截，那就等同于直接通向原对象。
var target = {};
var handler = {};
var proxy = new Proxy(target,handler);
proxy.a = 'b';
target.a // 'b'
上面代码中，handler是一个空对象，没有任何拦截效果，访问proxy就等同于访问
target。
一个技巧是将Proxy对象，设置到object.proxy属性，从而可以在object对象上调用。
var object = { proxy:new Proxy(target,handler)};
Proxy实例也可以作为其他对象的原型对象。
var proxy = new Proxy({},{
    get:function(target,propKey){
       return 35;
    }
})
let obj = Object.create(proxy); // 以proxy为原型对象进行创造对象。
obj.time // 35
上面代码中，proxy对象是obj对象的原型，obj对象本身没有time属性，所以根
据原型链，会在proxy对象上读取该属性，导致被拦截。

同一个拦截器函数，可以设置拦截多个操作。
var handler = {
    get:function(target,name) {
        if(name === 'prototype'){
            return Object.prototype;
        }
        return 'Hello,' + name;
    },
    apply:function(target,thisBinding,args){
        return args[0];
    },
    construct:function(target,args){
        return { value: args[1]};
    }
}

var fproxy = new Proxy(function(x,y){
    return x+y;
},handler);

fproxy(1,2) // 1    调用的是apply方法
new proxy(1,2) // {value:2}  调用的是construct方法
fproxy.prototype === Object.prototype // true 调用的是get方法
fproxy.foo === "Hello,foo" // true

对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生
结果。
下面是Proxy支持的拦截操作一览，一共13种。
- get(target,propKey,receiver)：（receiver为proxy实例本身）拦截对象属性的读取，
  比如proxy.foo和proxy['foo']。
- set(target,propKey,value,receiver)：拦截对象属性的设置，比如
  proxy.foo = v 或 proxy['foo'] = v，返回一个布尔值。
- has(target,propKey)：拦截propKey in proxy的操作，返回一个布尔值。
- deleteProperty(target,propKey)：拦截delete proxy[propKey]的操作，
  返回一个布尔值。
- ownKeys(target)：拦截Object.getOwnPropertyNames(proxy) 、
  Object.getOwnPropertySymbols(proxy) 、Object.keys(proxy)、
  for...in循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，
  而Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截
  Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。 
- defineProperty(target,propKey,propDesc)：拦截
  Object.defineProperty(target,propKey,propDesc)、
  Object.defineProperties(proxy,propDescs)，返回一个布尔值。
- preventExtensions(target)：拦截
  Object.preventExtensions(proxy),返回一个布尔值。
  （Object.preventExtensions()方法让一个对象变的不可扩展，也就是永远不能再添加新的属性。）
- getPrototypeOf(target)：拦截Object.getPrototypeOf(proxy),
  返回一个对象。
- isExtensible(target)：拦截 Object.isExtensible(proxy),返回一个布尔值。
Object.isExtensible() 方法判断一个对象是否是可扩展的（是否可以在它上面添加新的属性）
- setPrototypeOf(target,proto)：拦截Object.setPrototypeOf(proxy,proto),
返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target,object,args)：拦截Proxy实例作为函数调用的操作，比如
proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，
比如new proxy(...args)。      
```
## 2、Proxy实例的方法
```
下面是上面这些拦截方法的详细介绍。
get()
get方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名
和proxy实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。
get方法的用法，上文已经有一个例子，下面是另外一个拦截读取操作的例子。
var person = {
    name:"张三"
};
var proxy = new Proxy(person,{
    get:function(target,propKey) {
        if(propKey in target) {
            return target[propKey]
        }else{
            throw new ReferenceError(`Prop name"${propKey}"does not exist`)
        }
    }
});
proxy.name // "张三"
proxy.age // 抛出一个错误

上面代码表示，如果访问目标对象不存在的属性，会抛出一个错误。如果没有这个拦截函数，
访问不存在的属性，只会返回undefined。

get方法可以继承。
let proto = new Proxy({},{
    get(target,propertyKey,receiver) {
        console.log('GET'+propertyKey);
        return target[propertyKey];
    }
});
let obj = Object.create(proto);
obj.foo // "GET foo"
上面代码中，拦截操作定义在Prototype对象上面，所以如果读取obj对象继承的属性时，
拦截会生效。

下面的例子使用get拦截，实现数组读取负数的索引。
function createArray(...elements){ // 主要是使用扩展运算符
   let handler = {
       get(target,propKey,receiver) {
           let index = Number(propKey);
           if(index < 0){
               propKey = String(target.length + index);
           }
           return Reflect.get(target,propKey,receiver);
       }
   }
   let target = [];
   target.push(...elements); // 主要是使用扩展运算符
   return new Proxy(target,handler);
}
let arr = createArray('a','b','c');
arr[-1]  // c
上面代码中，数组的位置参数是-1，就会输出数组的倒数第一个成员。

利用Proxy，可以将读取属性的操作（get），转变为执行某个函数，从而实现属性的链式操作。
var pipe = function （）{
    var funcStack = [];
    var oproxy = new Proxy({},{
        get:function(pipeObject,fnName){
           if(fnName === 'get' ){
               return funcStack.reduce(function(val,fn){ // 使用数组的reduce方法
                   return fn(val);
               },value);
           }
           funcStack.push(window[fnName]); // 把所有的方法都添加到数组中，以便于后面用
           return oproxy;
        }
    });
    return oproxy;
}
var double = n => n*2;
var pow = n => n*n;
var reverseInt = n => n.toString().split("").reverse().join("")|0;

pipe(3).double.pow.reverseInt.get; // 63

```