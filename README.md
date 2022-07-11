# wxml-camvas

一个用来将 WXML 转化为 Canvas 的工具，它的原理是根据类名查询所有 WXML 节点，并把每个结点构造成多个画布元素，这些画布元素会形成一个队列按顺序画在 Canvas 上。

![https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png](https://resource.bearye.cn/29lY4Z_2022-05-19-19:53:59.png)

## 快速开始

```javascript
import WXMLCanvas from 'wxml-canvas';
const selectors = [
  '.billboard',
  '.name',
  '.row',
  '.left',
  '.right',
  '.qr-code',
];
const wc = new WXMLCanvas({
  canvas: '#canvas',
  selectors,
  instanceContext: this,
});

wc.on('drawing', () => {
  console.log('drawing');
});

wc.on('aborted', () => {
  console.log('aborted');
});

// 在节点挂载到页面后调用 draw 方法进行绘制
wc.draw().then(() => {
  wx.canvasToTempFilePath(
    {
      canvas: wc.canvas,
    },
    this
  ).then(res => {
    console.log(res.tempFilePath);
  });
});

// 可以调用 abort 方法中断绘制操作，注意该操作会清空canvas上的内容，触发aborted事件
// wc.abort();
```

## 最佳实践方式

正常使用 wxml+css 描述视图，并将 wxml 选择器按顺序放在数组传递给 WXMLCanvas 进行实例化，注意描述视图的 css 样式时统一使用像素单位`px`，因为 canvas 会自动设置为 wxml 的尺寸，而`rpx`会转换为`px`产生了缩放问题。

通过设置`position: absolute;`将 wxml 和 canvas 进行离屏，绘制完成后，通过`wx.canvasToTempFilePath`将图片转换为临时文件，将路径显示在`image`标签中，同时也可以保存图片，具体可以参考下图。

![https://resource.bearye.cn/best-practice_2022-05-23-21:18:45.png](https://resource.bearye.cn/best-practice_2022-05-23-21:18:45.png)

## API

### new WXMLCanvas(Options): WXMLCanvas

Options:

1. canvas: string - canvas 选择器，例如 "#canvas"；
2. selectors: string[] - 需要查询的 WXML 选择器，例如 `['.billboard', '.name']`，选择器支持类型请参考微信官方文档，注意数组前面的选择器对应的 WXML 节点会被先画到 canvas 上，所以第一个节点决定了 canvas 的尺寸；
3. instanceContext: object - 实例上下文，默认为`wx`，如果是在 component 里调用，请传递该参数（传递组件的`this`）；
4. interval: number - 绘制每个元素的时间间隔（目前小程序的 Canvas Context2D 还不是十分稳定，频繁的绘制操作可能会导致绘制不全，可以通过设置这个参数来控制绘制时间间隔，毫秒数，默认为 0）。

### WXMLCanvas.canvas: Canvas

canvas 节点实例

### WXMLCanvas.ctx: CanvasContext2D

canvas 绘制上下文实例

## WXMLCanvas.getFittedSize(limit: number = 1334): { width: number, height: number }

获取限制尺寸缩放后的尺寸，将其设置为 canvas 节点的 css 大小，以避免将 canvas 转换为临时资源链接时失败的情况。该函数会调用 WXMLCanvas 的静态方法 `getFittedSizeFromCanvas()`。

> canvas 节点尺寸过大时，可能会出现这种情况：使`wx.canvasToTempFilePath()`接口无法正常将 canvas 转换为临时资源链接，出来的结果图片是空白的。

## static WXMLCanvas.getFittedSizeFromCanvas(canvas: Canvas, limit: number = 1334): { width: number, height: number }

静态方法，从 canvas 实例上获取合适的 canvas 节点 css 尺寸。

### WXMLCanvas.on(eventType: EventType, callback: Function): void

用来监听一些事件，EventType 有以下几种类型：

1.  drawing - 绘制中
2.  aborted - 绘制操作被中断

### WXMLCanvas.off(eventType: EventType, callback: Function): void

取消事件监听，EventType 参考上面的`on`方法。

### WXMLCanvas.draw(): Promise<void>

开始绘制，必须在节点已经挂载后调用， 该方法返回 Promise。

### WXMLCanvas.abort(): Promise<void>

中断绘制操作，该操作会清空画布已有的内容。

### WXMLCanvas.redraw(): Promise<void>

该方法会自动调用 abort 和 draw 方法，同样必须在节点已经挂载后调用。

## 支持的类型

**图像**

有两种方式：一是通过 image 标签，二是设置 background-image 属性，图像裁剪、缩放模式和微信官方 image 的 mode 属性一致，background-image 设置的图像，使用 background-size 属性控制缩放、裁剪模式，`cover`与`aspect fill`等同，`contain`与`aspect fit`等同，默认为`top left`，不支持`background-position`属性，默认所有`background-position`都为`center` 。

> 额外支持的设置：
>
> 1. 圆角 `border-radius`

**颜色**

颜色通过 background-color 设定，并且可以设定 background-image 设定渐变颜色（linear-gradient）。

> 额外支持的设置：
>
> 1. 圆角 `border-radius`
>
> 注意：background-image: url("...") 会被认为是图像。

**阴影**

通过设置 `box-shadow` 来画阴影，不支持 inset 模式的阴影。

> 额外支持的设置：
>
> 1. 圆角 `border-radius`

**文字**

文字需要通过设置节点的`data-text`属性，并需要保证节点的`data-text`属性的值和节点的 innerText 一致。

> 额外支持的设置：
>
> 1. 文字大小 `font-size`
> 2. 文字颜色 `color`
> 3. 文字行高 `line-height`
> 4. 文字对齐方式 `text-align`
> 5. 文字字体 `font-family`
> 6. 文字粗细 `font-weight`
> 7. 文字阴影 `text-shadow`
> 8. 文本结束字符 `text-overflow`
>
> 注意：最好对于每个文本标签都设定 `line-height` 属性，并避免行高大于其容器元素的高度。

**边框**

可以单独设置容器的四个方向边框，同时只支持统一的圆角设置，边框设置还存在一些问题无法实现 html 渲染边框的逻辑。

> 额外支持的设置：
>
> 1. 圆角 `border-radius`
> 2. 边框颜色 `border-color`
> 3. 边框宽度 `border-width`

## 参考样式 CSS 写法

| 属性             | 参考写法                         |
| ---------------- | -------------------------------- |
| box-shadow       | 0px 1px 10px 0 rgba(0, 0, 0, .2) |
| background-image | url('xxxxxx')                    |
| border-radius    | 10px                             |

## 注意事项

1. 所有 border-radius 属性建议都传计算过的值，而不是简单的百分比，以免出现边界情况；
2. WXMLCanvas 实例化操作以及调用`draw`方法，需要节点已经挂载之后；
3. ~~目前画图任务的队列放在微任务中执行，暂时不支持中断绘制操作。~~

## 其他问题

### 解决 IOS 端图片分辨率低问题

可以画完图后设置 canvas css 上的宽高，然后通过`nextTick()`方法在下一队列中再调用`wx.canvasToTempFilePath()`进行转换成临时图片链接，同时调用参数`destWidth`和`destHeight`设置为 canvas 实际尺寸，可以通过`WXMLCanvas.canvas.width`和`WXMLCanvas.canvas.height`两个属性拿到值，具体参考例子中的**example1**。
