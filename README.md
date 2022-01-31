# A-person-Vue
一个自己按照底层响应式原理来做的一个小Vue案例

## 大体思路

1. 定义一个Vue类：
  - 传入一个options，并且将各种属性如data、el、methods等绑定在Vue上
  - initRoot（初始化Root）：主要判断el类型正确与否
  - _proxyData：将data中属性绑定在Vue上
  - 初始化Observer（响应式）、Compiler（编译器）
2. 定义Observer类：用于将data中属性变成响应式 （引入依赖Dep类，在getter中添加依赖，在setter中通知变化）
3. 定义Dep类：担任通知中心：添加观察者以及通知观察者
4. 定义Watcher类：每当有新数据创建时就需要Watcher来监听它
