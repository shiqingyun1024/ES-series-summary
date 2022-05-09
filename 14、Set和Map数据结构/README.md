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




