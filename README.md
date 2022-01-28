# A-person-Vue
一个自己按照底层响应式原理来做的一个小Vue案例

## 大体思路

1. 定义一个Vue类：
  - 传入一个options，并且将各种属性如data、el、methods等绑定在Vue上
  - initRoot（初始化Root）：主要判断el类型正确与否
  - _proxyData：将data中属性绑定在Vue上
  - 初始化Observer（响应式）、Compiler（编译器）
2. 定义Observer类：用于将data中属性变成响应式
