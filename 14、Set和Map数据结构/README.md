Set和Map数据结构
# 1、Set
```
基本用法
ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，
没有重复的值。

Set本身是一个构造函数，用来生成Set数据结构。
const s = new Set();
[2,3,5,4,5,2,2].forEach(x=>s.add(x));
for(let i of s){
    console.log(i);
}
// 2 3 5 4
上面代码通过add()方法向Set结构加入成员，结果表明Set结构不会添加重复的值。
Set函数可以接受一个数组（或者具有iterable接口的其他数据结构）作为参数，用来初始化。
// 例一
const set = new Set([1,2,3,4,4]);
[...set]
// [1,2,3,4]

// 例二
const items = new Set([1,2,3,4,5,5,5,5]);
items.size // 5

// 例三
const set = new Set(document.querySelectorAll('div'));
set.size // 56

// 类似于
const set = new Set();
document.querySelectorAll('div').forEach(div=>set.add(div));
set.size // 56
上面代码中，例一和例二都是Set函数接受数组作为参数，例三是接受类似数组的对象
作为参数。
上面代码也展示了一种去除数组重复成员的方法。
// 去除数组的重复成员
[...new Set(array)]
上面的方法也可以用于，去除字符串里面的重复字符。
[...new Set('ababbc')].join('')
// "abc"

向Set加入值的时候，不会发生类型转换，所以5和“5”是两个不同的值。Set内部
判断两个值是否不同，使用的算法叫做“Same-value-zero equality”,它类似
于精确相等运算符（===），主要的区别是向Set加入值时认为NaN等于自身，而精确
相等运算符认为NaN不等于自身。
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set // Set {NaN} 
上面代码向Set实例添加了两次NaN，但是只会加入一个。这表明，在Set内部，
两个NaN是相等的。
另外，两个对象总是不相等的。
let set = new Set();
set.add({});
set.size // 1

set.add({});
set.size // 2
上面代码表示，由于两个空对象不相等，所以它们被视为两个值。

```
## Set实例的属性和方法
```
Set结构的实例有以下属性。

- Set.prototype.constructor ：构造函数，默认就是Set函数。
- Set.prototype.size ： 返回Set实例的成员总数。

Set实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。
下面先介绍四个操作方法。
- Set.prototype.add(value)：添加某个值，返回Set结构本身。
- Set.prototype.delete(value)：删除某个值，返回一个布尔值，表示删除是
否成功。
- Set.prototype.has(value)：返回一个布尔值，表示该值是否为Set的成员。
- Set.prototype.clear()：清除所有成员，没有返回值。
add has delete clear

上面这些属性和方法的实例如下。
let s = new Set()
s.add(1).add(2).add(2);
// 注意2被加入了两次

s.size // 2
s.has(1) // true
s.has(2) // true
s.has(3) // false

s.delete(2);
s.has(2) // false

下面是一个对比，看看在判断是否包括一个键上面，Object结构和Set结构的写法不同。
// 对象的写法
const properties = {
    'width':1,
    'height':1
};
if(properties[someName]){
    // do something
}

// Set的写法
const properties = new Set();
properties.add('width');
properties.add('height');

if(properties.has(someName)){
    // do something
}

Array.from方法可以将Set结构转为数组。
const items = new Set([1,2,3,4,5])
const array = Array.from(items);
这就提供了去除数组重复成员的另一种方法。
function dedupe(array){
    return Array.from(new Set(array));
}
dedupe([1,2,2,3,1]) // [1,2,3]
```
### 遍历操作
```
Set结构的实例有四个遍历方法，可以用于遍历成员。
- Set.prototype.keys()：返回键名的遍历器
- Set.prototype.values()：返回键值的遍历器
- Set.prototype.entries()：返回键值对的遍历器
- Set.prototype.forEach()：使用回调函数遍历每个成员

需要特别指出的是，Set的遍历顺序就是插入顺序。这个特性有时非常有用，比如使用
Set保存一个回调函数列表，调用时就能保证按照添加顺序调用。
（1）keys(),values(),entries()
keys方法、values方法、entries方法返回的都是遍历器对象（详见《Iterator对象》
一章）。由于Set结构没有键名，只有键值（或者说键名和键值是同一个值），所以keys方法
和values方法的行为完全一致。

let set = new Set(['red','green','blue']);
for(let item of set.keys()){
    console.log(item);
}
// red
// green
// blue

for(let item of set.values){
    console.log(item);
}
// red
// green
// blue

for(let item of set.entries()){
    console.log(item);
}
// ["red","red"]
// ["green","green"]
// ["blue","blue"]
上面代码中，entries方法返回的遍历器，同时包括键名和键值，所以每次输出
一个数组，它的两个成员完全相等。
Set结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
Set.prototype[Symbol.iterator] === Set.prototype.values
// true
这就意味着，可以省略values方法，直接用for...of循环遍历Set。
let set = new Set(['red','green','blue'])

for(let x of set){
    console.log(x);
}
// red
// green
// blue
(2) forEach()
Set结构的实例与数组一样，也拥有forEach方法，用于对每个成员执行某种操作，
没有返回值。
let set = new Set([1,4,9]);
set.forEach((value,key)=>console.log(key+':'+value))
// 1:1
// 4:4
// 9:9
上面代码说明，forEach方法的参数就是一个处理函数。该函数的参数与数组的
forEach一致，依次为键值、键名、集合本身（上例省略了该函数）。这里需要注意，
Set结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远
都是一样的。

另外，forEach方法还可以有第二个参数，表示绑定处理函数内部的this对象。
（3）遍历的应用
扩展运算符（...）内部使用for...of循环，所以也可以用于Set结构。
let set = new Set(['red','green','blue']);
let arr = [...set];
// ['red', 'green', 'blue']
扩展运算符和Set结构相结合，就可以去除数组的重复成员。
let arr = [3,5,2,2,5,3,5];
let unique = [...new Set(arr)]; // 或者是Array.from(new Set(arr))
// [3,5,2]
而且，数组的map和filter方法也可以间接用于Set了。

let set = new Set([1,2,3]);
set = new Set([...set].map(x=>x*2));
// 返回Set结构：{2,4,6}
let set = new Set([1,2,3,4,5]);
set = new Set([...set].filter(x=>(x%2)==0));
// 返回Set结构：{2,4}
因此使用Set可以很容易地实现并集(Union)、交集(Intersert)和差集（Difference）
let a = new Set([1,2,3]);
let b = new Set([4,2,3]);
// 并集
let union = new Set([...a,...b]);
// Set {1,2,3,4}

// 交集
let intersect = new Set([...a].filter(x=>b.has(x)));
// set {2,3}

//(a相对于b的)差集
let difference = new Set([...a].filter(x=>!b.has(x)));
// Set {1}
如果想在遍历操作中，同步改变原来的Set结构，目前没有直接的方法，但有两种变
通方法。一种是利用原Set结构映射出一个新的结构，然后赋值给原来的Set结构；
另一种是利用Array.from方法。
// 方法一
let set = new Set([1,2,3]);
set = new Set([...set].map(val=>val*2));
// set的值是2,4,6

// 方法二
let set = new Set([1,2,3]);
set = new Set(Array.from(set,val=>val*2));
// set的值是2,4,6
Array.from(arr, mapfn,thisArg)方法，用于将两类可以把对象转换为真正的数组：类似数组的对象和可遍历的对象（部署了Iterator接口的，String，ES6新增的Map和Set）。可以传3个参数，其中第一个是数组，必传；第二个是一个函数（类似map函数），对数组元素进行操作后再返回数组，可选；第三个是对于 this关键字的指向，可选。

上面代码提供了两种方法，直接在遍历操作中改变原来的 Set 结构。
```
## WeakSet
```
含义
WeakSet结构与Set类似，也是不重复的值的集合。但是，它与Set有两个区别。
首先，WeakSet的成员只能是对象，而不能是其他类型的值。
const ws = new WeakSet();
ws.add(1)
// TypeError: Invalid value used in weak set
ws.add(Symbol())
// TypeError: invalid value used in weak set
上面代码试图向WeakSet添加一个数值和Symbol值，结果报错，因为WeakSet
只能放置对象。
其次，WeakSet中的对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象
的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收
该对象所占用的内存，不考虑对象还存在于WeakSet之中。
这是因为垃圾回收机制根据对象的可达性来判断回收，如果对象还能被访问到，
垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致
内存无法释放，进而可能会引发内存泄露。WeakSet里面的引用，都不计入垃圾回收机制，
所以就不存在这个问题。因此，WeakSet适合临时存放一组对象，以及存放跟对象绑定的
信息。只要这些对象在外部消失，它在WeakSet里面的引用就会自动消失。
由于上面这个特点，WeakSet的成员是不适合引用的，因为它会随时消失。另外，
由于WeakSet内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很
可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此ES6规定
WeakSet不可遍历。
这些特点同样适用于本章后面要介绍的WeakMap结构。
```
### 语法
```
WeakSet是一个构造函数，可以使用new命令，创建WeakSet数据结构。
const ws = new WeakSet();
作为构造函数，WeakSet可以接受一个数组或类似数组的对象作为参数。
（实际上，任何具有Iterable接口的对象，都可以作为WeakSet的参数。）
该数组的所有成员，都会自动成为WeakSet实例对象的成员。
const a = [[1,2],[3,4]];
const ws = new WeakSet(a);
// WeakSet {[1,2],[3,4]}
上面代码中，a是一个数组，它有两个成员，也都是数组。将a作为WeakSet构造
函数的参数，a的成员会自动成为WeakSet的成员。
注意，是a数组的成员成为WeakSet的成员，而不是a数组本身。这意味着，数组
的成员只能是对象。（WeakSet的成员只能是对象，而不能是其他类型的值。）
const b = [3,4];
const ws = new WeakSet(b);
// Uncaught TypeError:Invalid value used in weak set(...)
上面代码中，数组b的成员不是对象，加入WeakSet就会报错。
WeakSet结构有以下三个方法。
- WeakSet.prototype.add(value):向WeakSet实例添加一个新成员。
- WeakSet.prototype.delete(value):清除WeakSet实例的指定成员。
- WeakSet.prototype.has(value):返回一个布尔值，表示某个值是否在WeakSet实例之中。

下面是一个例子。
const ws = new WeakSet();
const obj = {};
const foo = {};
ws.add(window);
ws.add(obj);

ws.has(window); // true
ws.has(foo); // false

ws.delete(window);
ws.has(window); // false

WeakSet没有size属性，没办法遍历它的成员。
ws.size  // undefined
ws.forEach // undefined
ws.forEach(function(item){
    console.log('WeakSet has ' + item)
})
// TypeError:undefined is not a function
上面代码试图获取size和forEach属性，结果都不能成功。

WeakSet不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制
无法保证成员的存在，很可能刚刚遍历结束，成员就取不到值了。WeakSet
的一个用处，是储存DOM节点，而不用担心这些节点从文档移除时，会引发内存泄露
("===为什么会这样说呢===")。

下面是WeakSet的另外一个例子。
const foos = new WeakSet();
class Foo{
    constructor(){
        foos.add(this)
    }
    method(){
        if(!foos.has(this)){
            throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
        }
    }
}

上面代码保证了Foo的实例方法，只能在Foo的实例上调用。这里使用WeakSet的好处是，
foos对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑foos，
也不会出现内存泄露。
```
## 3、Map
```
含义和基本用法
JavaScript的对象（Object），本质上是键值对的集合（Hash结构），但是传统上
只能用字符串当做键（”===实验了一下，如果用数字当做键，取值的时候，会报
Uncaught SyntaxError: Unexpected number===“）。
这给它的使用带来了很大的限制。
const data = {};
const element = document.getElementById('myDiv');

data[element] = 'metadata';
data['[object HTMLDivElement]'] // "metedata"

上面代码愿意是将一个DOM节点作为对象data的键，但是由于对象只接受字符串作为
键名，所以element被自动转为字符串[object HTMLDivElement]。

为了解决这个问题，ES6提供了Map数据结构.它类似于对象，也是键值对的集合，但是
‘键’的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，Object
结构提供了”值--值“的对应，是一种更完善的Hash结构实现。如果你需要”键值对“的数据结构，
Map比Object更合适。

const m = new Map();
const o = {p:'Hello World'};

m.set(o,'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
上面代码使用Map结构的set方法，将对象o当作m的一个键，然后
又使用get方法读取这个键，接着使用delete方法删除了这个键。
上面的例子展示了如何向Map添加成员。作为构造函数，Map也可以接受
一个数组作为参数。该数组的成员是一个个表示键值对的数组。
const map = new Map([
    ['name','张三'],
    ['title','Author']
]);
map.size // 2
map.has('name') // true
map.get('name') // '张三'
map.has('title') // true
map.get('title') // 'Author'
上面代码在新建Map实例时，就指定了两个键name和title。

Map构造函数接受数组作为参数，实际上执行的是下面的算法。
（”==Map实际上执行的是下面的步骤==“）
const items = [
    ['name','张三'],
    ['title','Author']
]
const map = new Map();

items.forEach(
    ([key,value])=>map.set(key,value)
);
事实上，不仅仅是数组，任何具有Iterator接口，且每个成员都是一个双元素
的数组结构（详见《Iterator》一章）都可以当做Map构造函数的参数。这就是说，
Set和Map都可以用来生成新的Map。
const set = new Set([
    ['foo',1],
    ['bar',2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz',3]]);
const m3 = new Map(m2);
m3.get('baz') // 3
上面代码中，我们分别使用Set对象和Map对象，当做Map构造函数的参数，
结构都生成了新的Map对象。
如果对同一个键对此赋值，后面的值将覆盖前面的值。
const map = new Map();
map.set(1,'aaa').set(1,'bbb');
map.get(1) // "bbb"
上面的代码对键1连续赋值两次后，后一次的值覆盖前一次的值。
如果读取一个未知的键，则返回undefined。
new Map().get('asdfg')
// undefined
注意，只有对同一个对象的引用，Map结构才将其视为同一个键。这一点
要非常小心。
const map = new Map();
map.set(['a'],555);
map.get(['a']) // undefined
上面代码的set和get方法，表面是针对同一个键，但实际上这是两个不同的数组
实例，内存地址是不一样的，因此get方法无法读取该键，返回undefined。
同理，同样的值的两个实例，在Map结构中被视为两个键。
const map = new Map();

const k1 = ['a'];
const k2 = ['a'];
map.set(k1,111).set(k2,222);

map.get(k1) // 111
map.get(k2) // 222
上面代码中，变量k1和k2的值是一样的，但是它们在Map结构中被视为两个键。

由上可知，Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为
两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，
如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果Map的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格
想等，Map将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则
是两个不同的键。另外，undefined和null也是两个不同的键。虽然NaN不严格等于
自身，但Map将其视为同一个键。
let map = new Map();
map.set(-0,123);
map.get(+0) // 123

map.set(true,1);
map.set('true', 2);
map.get(true) // 1

map.set(undefined, 3);
map.set(null, 4);
map.get(undefined) // 3

map.set(NaN, 123);
map.get(NaN) // 123
```
### 实例的属性和操作方法
```
Map结构的实例有以下属性和操作方法。
（1）size属性
size属性返回Map结构的成员总数。
const map = new Map();
map.set('foo',true);
map.set('bar',false);

map.size // 2

(2) Map.prototype.set(key,value)
set方法设置键名key对应的键值为value，然后返回整个Map结构。
如果key已经有值，则键值会被更新，否则就新生成该键。
const m = new Map();
m.set('edition',6)  // 键是字符串
m.set(262,'standrad')  // 键是数值
m.set(undefined,'nah') // 键是undefined

set方法返回的是当前的Map对象，因此可以采用链式写法。
let map = new Map().set(1,'a').set(2,'b').set(3,'c')

(3) Map.prototype.get(key)
get方法读取key对应的键值，如果找不到key，返回undefined
const m = new Map();
const hello = function() { console.log('hello')}
m.set(hello,'Hello ES6!') // 键是函数

m.get(hello) // Hello ES6!

（4）Map.prototype.has(key)
has方法返回一个布尔值，表示某个键是否在当前Map对象之中。
const m = new Map();
m.set('edition',6)  // 键是字符串
m.set(262,'standrad')  // 键是数值
m.set(undefined,'nah') // 键是undefined

m.has('edition')  // true
m.has('years')  // false
m.has(262)  // true
m.has(undefined)  // true

(5) Map.prototype.delete(key)
delete 方法删除某个键，返回true。如果删除失败，返回false。
const m = new Map();
m.set(undefined,'nah')k
m.has(undefined) // true

m.delete(undefined)  // true
m.has(undefined) // false

(6) Map.prototype.clear()
clear方法清除所有成员，没有返回值。
let map = new Map();
map.set('foo',true);
map.set('bar',false);

map.size // 2
map.clear()
map.size // 0
```
### 遍历方法
```
Map结构原生提供三个遍历器生成函数和一个遍历方法。
- Map.prototype.keys()：返回键名的遍历器。
- Map.prototype.values()：返回键值的遍历器。
- Map.prototype.entries()：返回所有成员的遍历器。
- Map.prototype.forEach()：遍历Map的所有成员。

需要特别注意的是，Map的遍历顺序就是插入顺序。

const map = new Map([
    ['F','no'],
    ['T','yes'],
]);
for(let key of map.keys()){
    console.log(key);
}
// "F"
// "T"
for(let value of map.values()){
    console.log(value);
}
// "no"
// "yes"

for(let item of map.entries()){
    console.log(item[0],item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for(let [key,value] of map.entries()){
    console.log(key,value);
}
// "F" "no"
// "T" "yes"

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
// "F" "no"
// "T" "yes"

上面代码最后的那个例子，表示Map结构的默认遍历器接口（Symbol.iterator属性），
就是entries方法。
map[Symbol.iterator] === map.entries
Map结构转为数组结构，比较快速的方法是使用扩展运算符（...）。
const map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]

结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤
（Map 本身没有map和filter方法）。
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}

此外，Map 还有一个forEach方法，与数组的forEach方法类似，也可以实现遍历。
map.forEach(function(value, key, map) {
  console.log("Key: %s, Value: %s", key, value);
});
forEach方法还可以接受第二个参数，用来绑定this。


```






