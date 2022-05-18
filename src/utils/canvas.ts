import ImgMetrics from './img-metrics';

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

const clipRect = function (
  ctx: WechatMiniprogram.CanvasContext,
  {
    left,
    top,
    right,
    bottom,
    width,
    height,
    radius,
  }: Metrics & { radius?: number }
) {
  ctx.beginPath();
  if (radius) {
    const newLeft = left + radius;
    const newRight = right - radius;
    const newTop = top + radius;
    const newBottom = bottom - radius;

    ctx.moveTo(newLeft, top);
    ctx.lineTo(newRight, top);
    ctx.arc(newRight, newTop, radius, -Math.PI / 2, 0);
    ctx.lineTo(right, newBottom);
    ctx.arc(newRight, newBottom, radius, 0, Math.PI / 2);
    ctx.lineTo(newLeft, bottom);
    ctx.arc(newLeft, newBottom, radius, Math.PI / 2, Math.PI);
    ctx.lineTo(left, newTop);
    ctx.arc(newLeft, newTop, radius, Math.PI, -Math.PI / 2);
  } else {
    ctx.rect(left, top, width, height);
  }
  ctx.closePath();
  ctx.clip();
};

const clipCircle = function (
  ctx: WechatMiniprogram.CanvasContext,
  { x, y, r }: { x: number; y: number; r: number }
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.clip();
};

const computeImgMetrcsByMode = function (
  { sw, sh, tw, th }: { sw: number; sh: number; tw: number; th: number },
  mode: IMAGE_MODE
) {};

export const drawColor = function (
  { metrics, color, radius }: IElementColor,
  ctx: WechatMiniprogram.CanvasContext
) {
  ctx.save();
  clipRect(ctx, { ...metrics, radius });
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

  return Promise.resolve();
};

export const drawText = function () {};

export const drawImage = function (
  el: IElementImage,
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
) {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage();
    img.onload = () => {
      ctx.save();
      const { sx, sy, sw, sh, tx, ty, tw, th } = ImgMetrics[el.mode]({
        sw: img.width,
        sh: img.height,
        tw: el.metrics.width,
        th: el.metrics.height,
      });
      clipRect(ctx, { ...el.metrics, radius: el.radius });
      ctx.drawImage(
        img as any,
        sx,
        sy,
        sw,
        sh,
        el.metrics.left + tx,
        el.metrics.top + ty,
        tw,
        th
      );
      ctx.restore();
      resolve(true);
    };
    img.onerror = reject;
    img.src = el.src;
  });
};

export const draw = (
  els: IElement[],
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
) => {
  let p: Promise<any> = Promise.resolve();

  els.forEach(el => {
    p = p.then(() => {
      switch (el.type) {
        case ELEMENT_TYPE.COLOR:
          return drawColor(el as IElementColor, ctx);
        case ELEMENT_TYPE.IMAGE:
          return drawImage(el as IElementImage, ctx, canvas);
      }
    });
  });

  return p;
};
