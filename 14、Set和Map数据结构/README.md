Set和Map数据结构
## 1、Set
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

```