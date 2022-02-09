# A-person-Vue

一个自己按照底层响应式原理来做的一个小 Vue 案例

---

# 大体思路

1. 定义一个 Vue 类：

- 传入一个 options，并且将各种属性如 data、el、methods 等绑定在 Vue 上
- initRoot（初始化 Root）：主要判断 el 类型正确与否
- \_proxyData：将 data 中属性绑定在 Vue 上
- 初始化 Observer（响应式）、Compiler（编译器）

2. 定义 Observer 类：用于将 data 中属性变成响应式 （引入依赖 Dep 类，在 getter 中添加依赖，在 setter 中通知变化）

3. 定义 Dep 类：担任通知中心：添加观察者以及通知观察者

4. 定义 Watcher 类：每当有新数据创建时就需要 Watcher 来监听它

5. 定义解析器 Compiler 类 ：这涉及到 DOM 的属性的匹配操作！！

## 注意的问题点

- 定义的`_proxyData`方法除了将 data 中的属性绑定在 Vue 实例上以外，还能通过 setter 改变 data 的值，触发 data 中的响应监听机制。因此 data 中的属性不需要做 Observer 的监听

- 在 Observer 类中：

```js
set(newVal) {
    if (newVal === val) return
    val = newVal
    dep.notify()
}
```

一定要如上顺序这样写，一开始我先更新后改变值，导致第一次值变化的时候，更新机制执行时值实际上还没改变而 return 掉

- 如何实现 methods 中 this 指向 vue 实例？

我一开始不知道怎么解决，但搜了一下网上发现 Vue 的相关源码如下：

```js
// 当 methods 有方法时
if (methods) {
    // 对methods对象中的每一个方法遍历
    for (const key in methods) {
        // 取出每一个方法
      const methodHandler = (methods as MethodOptions)[key]
        // 判断是否是方法Function类型
      if (isFunction(methodHandler)) {
        // In dev mode, we use the `createRenderContext` function to define
        // methods to the proxy target, and those are read-only but
        // reconfigurable, so it needs to be redefined here
        // 在开发环境时
        if (__DEV__) {
          Object.defineProperty(ctx, key, {
            // 对每个方法进行绑定this的作用域 this等于这里的publicThis
            value: methodHandler.bind(publicThis),
            configurable: true,
            enumerable: true,
            writable: true
          })
        } else {
            // 非开发环境时，对每个方法进行this的绑定
          ctx[key] = methodHandler.bind(publicThis)
        }
        if (__DEV__) {
          checkDuplicateProperties!(OptionTypes.METHODS, key)
        }
      } else if (__DEV__) {
        warn(
          `Method "${key}" has type "${typeof methodHandler}" in the component definition. ` +
            `Did you reference the function correctly?`
        )
      }
    }
  }
```

可见 Vue 在实现的时候，methods 跟 data 一样，也是要通过重新绑定 methods 的方式，使用 bind 关键字强制让 methods 中所有方法函数的 this 指向 Vue 实例
