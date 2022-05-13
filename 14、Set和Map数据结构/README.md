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
```




