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
```