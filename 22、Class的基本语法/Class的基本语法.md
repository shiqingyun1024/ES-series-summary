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























