# ES-series-summary
ES6系列相关的总结和笔记

### 2.1.let 关键字
、、、
let 关键字用来声明变量，使用 let 声明的变量有几个特点：
1) 不允许重复声明
2) 块儿级作用域
3) 不存在变量提升
4) 不影响作用域链
、、、
### 2.2. const 关键字
、、、
const 关键字用来声明常量，const 声明有以下特点
1) 声明必须赋初始值
2) 标识符一般为大写
3) 不允许重复声明
4) 值不允许修改
5) 块儿级作用域
注意: 对象属性修改和数组元素变化不会出发 const 错误
应用场景：声明对象类型使用 const，非对象类型声明选择 let
、、、
### 2.3.变量的解构赋值
、、、
ES6 允许按照一定模式，从数组和对象中提取值，对变量进行赋值，这被称为解构赋值。

//数组的解构赋值
const arr = ['张学友', '刘德华', '黎明', '郭富城'];
let [zhang, liu, li, guo] = arr; 4

//对象的解构赋值
const lin = {
name: '林志颖',
tags: ['车手', '歌手', '小旋风', '演员']
};
let {name, tags} = lin;

//复杂解构
let wangfei = {
name: '王菲',
age: 18,
songs: ['红豆', '流年', '暧昧', '传奇'],
history: [
{name: '窦唯'},
{name: '李亚鹏'},
{name: '谢霆锋'} ]
};
let {songs: [one, two, three], history: [first, second, third]} = 
wangfei;
注意：频繁使用对象方法、数组元素，就可以使用解构赋值形式
、、、
### 2.4.模板字符串
、、、
模板字符串（template string）是增强版的字符串，用反引号（`）标识，特点：
1) 字符串中可以出现换行符
2) 可以使用 ${xxx} 形式输出变量
// 定义字符串
let str = `<ul>
<li>沈腾</li>
<li>玛丽</li>
<li>魏翔</li>
<li>艾伦</li>
</ul>`;
// 变量拼接
let star = '王宁';
let result = `${star}在前几年离开了开心麻花`;
注意：当遇到字符串与变量拼接的情况使用模板字符串
、、、

### 2.5.简化对象写法
、、、
ES6 允许在大括号里面，直接写入变量和函数，作为对象的属性和方法。这
样的书写更加简洁。
let name = '努力加油';
let slogon = '永远追求行业更高标准';
let improve = function () {
console.log('可以提高你的技能');
}
//属性和方法简写
let atguigu = {
name,
slogon,
improve,
change() {
console.log('可以改变你') }
};
6
注意：对象简写形式简化了代码，所以以后用简写就对了
、、、