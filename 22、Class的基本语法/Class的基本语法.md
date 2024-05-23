# Class 的基本语法
- 1、类的由来
- 2、constructor() 方法
- 3、类的实例
- 4、实例属性的新写法
- 5、取值函数（getter）和存值函数（setter）
- 6、属性表达式
- 7、Class 表达式
- 8、静态方法
- 9、静态属性
- 10、私有方法和私有属性
- 11、静态块
- 12、类的注意点
- 13、new.target 属性

## 1、类的由来

```js
JavaScript 语言中，生成实例对象的传统方法是通过构造函数。下面是一个例子。
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
};

var p = new Point(1, 2);

上面这种写法跟传统的面向对象语言（比如 C++ 和 Java）差异很大，很容易让新学习这门语言的程序员感到困惑。

ES6 提供了更接近传统语言的写法，引入了 Class（类）这个概念，作为对象的模板。通过class关键字，可以定义类。

基本上，ES6 的class可以看作只是一个语法糖，它的绝大部分功能，ES5 都可以做到，新的class写法只是让对象原型的写法更加清晰、更像面向对象编程的语法而已。上面的代码用 ES6 的class改写，就是下面这样。

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

上面代码定义了一个“类”，可以看到里面有一个constructor()方法，这就是构造方法，而this关键字则代表实例对象。这种新的 Class 写法，本质上与本章开头的 ES5 的构造函数Point是一致的。

Point类除了构造方法，还定义了一个toString()方法。注意，定义toString()方法的时候，前面不需要加上function这个关键字，直接把函数定义放进去了就可以了。另外，方法与方法之间不需要逗号分隔，加了会报错。

ES6 的类，完全可以看作构造函数的另一种写法。

class Point {
  // ...
}

typeof Point // "function"
Point === Point.prototype.constructor // true

上面代码表明，类的数据类型就是函数，类本身就指向构造函数。

使用的时候，也是直接对类使用new命令，跟构造函数的用法完全一致。
class Bar {
  doStuff() {
    console.log('stuff');
  }
}

const b = new Bar();
b.doStuff() // "stuff"

构造函数的prototype属性，在 ES6 的“类”上面继续存在。事实上，类的所有方法都定义在类的prototype属性上面。
class Point {
  constructor() {
    // ...
  }

  toString() {
    // ...
  }

  toValue() {
    // ...
  }
}

// 等同于

Point.prototype = {
  constructor() {},
  toString() {},
  toValue() {},
};

上面代码中，constructor()、toString()、toValue()这三个方法，其实都是定义在Point.prototype上面。

因此，在类的实例上面调用方法，其实就是调用原型上的方法。

class B {}
const b = new B();

b.constructor === B.prototype.constructor // true

上面代码中，b是B类的实例，它的constructor()方法就是B类原型的constructor()方法。

由于类的方法都定义在prototype对象上面，所以类的新方法可以添加在prototype对象上面。Object.assign()方法可以很方便地一次向类添加多个方法。

class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});

prototype对象的constructor属性，直接指向“类”的本身，这与 ES5 的行为是一致的。
Point.prototype.constructor === Point // true
另外，类的内部所有定义的方法，都是不可枚举的（non-enumerable）。

class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]


上面代码中，toString()方法是Point类内部定义的方法，它是不可枚举的。这一点与 ES5 的行为不一致。

var Point = function (x, y) {
  // ...
};

Point.prototype.toString = function () {
  // ...
};

Object.keys(Point.prototype)
// ["toString"]
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]

上面代码采用 ES5 的写法，toString()方法就是可枚举的。
```
## 2、constructor() 方法
```js
constructor()方法是类的默认方法，通过new命令生成对象实例时，自动调用该方法。一个类必须有constructor()方法，如果没有显式定义，一个空的constructor()方法会被默认添加。

class Point {
}

// 等同于
class Point {
  constructor() {}
}

上面代码中，定义了一个空的类Point，JavaScript 引擎会自动为它添加一个空的constructor()方法。

constructor()方法默认返回实例对象（即this），完全可以指定返回另外一个对象。

class Foo {
  constructor() {
    return Object.create(null);
  }
}

new Foo() instanceof Foo
// false

上面代码中，constructor()函数返回一个全新的对象，结果导致实例对象不是Foo类的实例。

类必须使用new调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用new也可以执行。

class Foo {
  constructor() {
    return Object.create(null);
  }
}

Foo()
// TypeError: Class constructor Foo cannot be invoked without 'new'
```
## 3、类的实例
```js
生成类的实例的写法，与 ES5 完全一样，也是使用new命令。前面说过，如果忘记加上new，像函数那样调用Class()，将会报错。

class Point {
  // ...
}

// 报错
var point = Point(2, 3);

// 正确
var point = new Point(2, 3);

类的属性和方法，除非显式定义在其本身（即定义在this对象上），否则都是定义在原型上（即定义在class上）。

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}

var point = new Point(2, 3);

point.toString() // (2, 3)

point.hasOwnProperty('x') // true
point.hasOwnProperty('y') // true
point.hasOwnProperty('toString') // false
point.__proto__.hasOwnProperty('toString') // true

上面代码中，x和y都是实例对象point自身的属性（因为定义在this对象上），所以hasOwnProperty()方法返回true，而toString()是原型对象的属性（因为定义在Point类上），所以hasOwnProperty()方法返回false。这些都与 ES5 的行为保持一致。

与 ES5 一样，类的所有实例共享一个原型对象。
var p1 = new Point(2,3);
var p2 = new Point(3,2);

p1.__proto__ === p2.__proto__
//true
```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

``` 

## 11、静态块
静态属性的一个问题是，如果它有初始化逻辑，这个逻辑要么写在类的外部，要么写在constructor()方法里面。

```js
class C {
  static x = 234;
  static y;
  static z;
}

try {
  const obj = doSomethingWith(C.x);
  C.y = obj.y
  C.z = obj.z;
} catch {
  C.y = ...;
  C.z = ...;
}
```
上面示例中，静态属性y和z的值依赖于静态属性x的运算结果，这段初始化逻辑写在类的外部（上例的try...catch代码块）。另一种方法是写到类的constructor()方法里面。这两种方法都不是很理想，前者是将类的内部逻辑写到了外部，后者则是每次新建实例都会运行一次。

为了解决这个问题，ES2022 引入了静态块（static block），允许在类的内部设置一个代码块，在类生成时运行且只运行一次，主要作用是对静态属性进行初始化。以后，新建类的实例时，这个块就不运行了。

```js
class C {
  static x = ...;
  static y;
  static z;

  static {
    try {
      const obj = doSomethingWith(this.x);
      this.y = obj.y;
      this.z = obj.z;
    }
    catch {
      this.y = ...;
      this.z = ...;
    }
  }
}
```
上面代码中，类的内部有一个 static 代码块，这就是静态块。它的好处是将静态属性y和z的初始化逻辑，写入了类的内部，而且只运行一次。

每个类允许有多个静态块，每个静态块中只能访问之前声明的静态属性。另外，静态块的内部不能有return语句。

静态块内部可以使用类名或this，指代当前类。

```js
class C {
  static x = 1;
  static {
    this.x; // 1
    // 或者
    C.x; // 1
  }
}
```
上面示例中，this.x和C.x都能获取静态属性x。

除了静态属性的初始化，静态块还有一个作用，就是将私有属性与类的外部代码分享。
```js
let getX;

export class C {
  #x = 1;
  static {
    getX = obj => obj.#x;
  }
}

console.log(getX(new C())); // 1
```
上面示例中，#x是类的私有属性，如果类外部的getX()方法希望获取这个属性，以前是要写在类的constructor()方法里面，这样的话，每次新建实例都会定义一次getX()方法。现在可以写在静态块里面，这样的话，只在类生成时定义一次。
```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```

```js

```























