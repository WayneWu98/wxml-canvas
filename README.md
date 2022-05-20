# wxml-camvas

一个用来将WXML转化为Canvas的工具，它的原理是根据类名查询所有WXML节点，并把每个结点构造成多个画布元素，这些画布元素会形成一个队列按顺序画在Canvas上。

![https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png](https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png)

## 支持的类型

**图像**

可以通过image标签或background-image的css属性添加，同时支持设置border-radius属性来控制圆角。图片裁剪、缩放模式和微信小程序image标签的mode属性相同，background-image 会根据background-size的值设定：cover对应aspectFill，contain对应aspectFit，默认为top left，不支持background-position css 属性，固定为center。

**颜色**

颜色通过background-color设定，并且可以设定background-image设定渐变颜色（linear-gradient和radial-gradient），并且支持设置border-radius属性来控制圆角，linear-gradient角度暂时只支持0deg、90deg、180deg、270deg。

> 注意：background-image: url("...") 会被认为是图像

**阴影**

**文字**
