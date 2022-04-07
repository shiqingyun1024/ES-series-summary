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
    get:function(target,propKey,recever){
       console.log(`getting ${propKey}!`);
       return Reflect.get(target,propKey,recever);
    }
})
```