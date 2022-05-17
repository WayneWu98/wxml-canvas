import WXMLCanvas from 'src';
import { INormalizedWXML } from './wxml-utils';

export const normalizer = {
  size(str: string) {
    return str.replace(/[^\d]/g, '');
  },
  isUrl(str: string) {
    return /^url\(.*\)$/.test(str);
  },
  url(str: string) {
    return str.replace(/^url\("(.*)"\)$/, '$1');
  },
  isLinearGradient(str: string) {
    return /^linear-gradient\(.*\)$/.test(str);
  },
  linearGradient(str: string, metrics: Metrics, ctx: CanvasRenderingContext2D) {
    const splited = str.replace(/^linear-gradient\((.*)\)$/, '$1').split(',');
    let linearPosition = {
      x0: (metrics.right - metrics.left) / 2,
      y0: 0,
      x1: (metrics.right - metrics.left) / 2,
      y1: 1,
    };
    if (/deg$/.test(splited[0])) {
      const radian = (parseFloat(splited.pop() as string) / 360) * Math.PI * 2;
      const w = (Math.tan(radian) * metrics.height) / 2;
      const h = (Math.atan(radian) * metrics.width) / 2;
    }
  },
};

export const drawRect = function (
  this: WXMLCanvas,
  {
    position,
    radius,
    backgroundColor,
    backgroundImage,
  }: {
    radius?: BorderRadius;
    position?: Metrics;
    backgroundColor?: string;
    backgroundImage?: string;
  }
) {
  return new Promise((resolve, reject) => {
    if (!this?.ctx) {
      return reject(new TypeError('canvas context has not been initialized'));
    }
    this.ctx.save();
    if (backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
    }
  });
};

export const drawBorder = function () {};

export const drawText = function () {};

export const drawImage = function () {};

export const drawBg = function (wxml: INormalizedWXML) {
  return new Promise((resolve, reject) => {
    // if (wxml.backgroundColor) {
    // }
  });
};

export const drawColor = function (
  { metrics, color, radius }: IElementColor,
  ctx: WechatMiniprogram.CanvasContext
) {
  console.log('fill color');

  ctx.save();

  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(metrics.left, metrics.top);
  ctx.lineTo(metrics.right, metrics.top);
  ctx.lineTo(metrics.right, metrics.bottom);
  ctx.lineTo(metrics.left, metrics.bottom);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
};

export const draw = (
  els: IElement[],
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
) => {
  els.forEach(el => {
    switch (el.type) {
      case ELEMENT_TYPE.COLOR:
        drawColor(el as IElementColor, ctx);
    }
  });
};
