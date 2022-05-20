# wxml-camvas

一个用来将 WXML 转化为 Canvas 的工具，它的原理是根据类名查询所有 WXML 节点，并把每个结点构造成多个画布元素，这些画布元素会形成一个队列按顺序画在 Canvas 上。

![https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png](https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png)

## Quick Start

```javascript
const classNames = [
  '.billboard',
  '.name',
  '.row',
  '.left',
  '.right',
  '.qr-code',
];
const wc = new WC({
  backgroundColor: '#fff',
  canvas: '#canvas',
  classNames,
  instanceContext: this,
});

wc.on('ready', () => {
  wc.draw();
});

wc.on('finish', () => {
  console.log('finish');
  wx.canvasToTempFilePath(
    {
      canvas: wc.canvas,
    },
    this
  ).then(res => {
    console.log(res.tempFilePath);
  });
});

wc.on('error', err => {
  console.error(err);
});
```

## 支持的类型

**图像**

可以通过 image 标签或 background-image 的 css 属性添加，同时支持设置 border-radius 属性来控制圆角。图片裁剪、缩放模式和微信小程序 image 标签的 mode 属性相同，background-image 会根据 background-size 的值设定：cover 对应 aspectFill，contain 对应 aspectFit，默认为 top left，不支持 background-position css 属性，固定为 center。

**颜色**

颜色通过 background-color 设定，并且可以设定 background-image 设定渐变颜色（linear-gradient 和 radial-gradient），并且支持设置 border-radius 属性来控制圆角，linear-gradient 角度暂时只支持 0deg、90deg、180deg、270deg。

> 注意：background-image: url("...") 会被认为是图像。

**阴影**
box-shadow

**文字**
需要设置结点`data-text`属性，支持设置文字阴影。
