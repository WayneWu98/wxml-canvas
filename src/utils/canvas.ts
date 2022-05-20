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

const drawLine = function (
  ctx: WechatMiniprogram.CanvasContext,
  [x0, y0, x1, y1]: [number, number, number, number],
  {
    lineWidth,
    color,
    opacity,
  }: { lineWidth: number; color: string; opacity: number }
) {
  if (!lineWidth) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.restore();
};

const drawArc = function (
  ctx: WechatMiniprogram.CanvasContext,
  {
    x,
    y,
    radius,
    startAngle,
    endAngle,
    lineWidth,
    opacity,
    color,
  }: {
    x: number;
    y: number;
    radius: number;
    startAngle: number;
    endAngle: number;
    lineWidth: number;
    opacity: number;
    color: string;
  }
) {
  if (!lineWidth) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, endAngle);
  ctx.stroke();
  ctx.restore();
};

const drawColor = function (
  { metrics, color, radius, opacity }: IColorElement,
  ctx: WechatMiniprogram.CanvasContext
): Promise<void> {
  ctx.save();
  ctx.globalAlpha = opacity;
  clipRect(ctx, { ...metrics, radius });
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();

  return Promise.resolve();
};

const drawText = function () {};

const drawImage = function (
  el: IImageElement,
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = canvas.createImage();
    img.onload = () => {
      ctx.save();
      ctx.globalAlpha = el.opacity;
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
      resolve();
    };
    img.onerror = reject;
    img.src = el.src;
  });
};

const drawBorder = function (
  { width, metrics, outerMetrics, radius, color }: IBorderElement,
  ctx: WechatMiniprogram.CanvasContext
): Promise<void> {
  ctx.save();
  clipRect(ctx, { ...outerMetrics, radius });
  const newLeft = metrics.left + radius;
  const newRight = metrics.right - radius;
  const newTop = metrics.top + radius;
  const newBottom = metrics.bottom - radius;

  drawLine(
    ctx,
    [
      radius ? newLeft : outerMetrics.left,
      metrics.top,
      radius ? newRight : outerMetrics.right,
      metrics.top,
    ],
    {
      lineWidth: width[0],
      color: color[0],
      opacity: 1,
    }
  );
  drawLine(
    ctx,
    [
      metrics.right,
      radius ? newTop : outerMetrics.top,
      metrics.right,
      radius ? newBottom : outerMetrics.bottom,
    ],
    {
      lineWidth: width[1],
      color: color[1],
      opacity: 1,
    }
  );
  drawLine(
    ctx,
    [
      radius ? newLeft : outerMetrics.left,
      metrics.bottom,
      radius ? newRight : outerMetrics.right,
      metrics.bottom,
    ],
    {
      lineWidth: width[2],
      color: color[2],
      opacity: 1,
    }
  );
  drawLine(
    ctx,
    [
      metrics.left,
      radius ? newTop : outerMetrics.top,
      metrics.left,
      radius ? newBottom : outerMetrics.bottom,
    ],
    {
      lineWidth: width[3],
      color: color[3],
      opacity: 1,
    }
  );

  if (width[0]) {
    if (width[1]) {
      // 如果存在上、右边框
      drawArc(ctx, {
        x: newRight,
        y: newTop,
        radius,
        startAngle: -Math.PI / 2,
        endAngle: 0,
        lineWidth: width[1],
        opacity: 1,
        color: color[1],
      });
    }

    if (width[3]) {
      // 如果存在上、左边框
      drawArc(ctx, {
        x: newLeft,
        y: newTop,
        radius,
        startAngle: Math.PI,
        endAngle: (Math.PI * 3) / 2,
        lineWidth: width[0],
        opacity: 1,
        color: color[0],
      });
    }
  }

  if (width[2]) {
    if (width[1]) {
      // 如果存在下、右边框
      drawArc(ctx, {
        x: newRight,
        y: newBottom,
        radius,
        startAngle: 0,
        endAngle: Math.PI / 2,
        lineWidth: width[2],
        opacity: 1,
        color: color[2],
      });
    }

    if (width[3]) {
      // 如果存在下、左边框
      drawArc(ctx, {
        x: newLeft,
        y: newBottom,
        radius,
        startAngle: Math.PI / 2,
        endAngle: Math.PI,
        lineWidth: width[3],
        opacity: 1,
        color: color[3],
      });
    }
  }

  ctx.restore();
  return Promise.resolve();
};

export const draw = (
  els: IElement[],
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
) => {
  let p: Promise<any> = Promise.resolve();

  els.forEach(el => {
    p = p.then(() => {
      if (el.metrics.width === 0 || el.metrics.height === 0) {
        // 元素没有尺寸就没必要绘制了，可能会存在特殊情况
        return Promise.resolve();
      }
      switch (el.type) {
        case ELEMENT_TYPE.COLOR:
          return drawColor(el as IColorElement, ctx);
        case ELEMENT_TYPE.IMAGE:
          return drawImage(el as IImageElement, ctx, canvas);
        case ELEMENT_TYPE.BORDER:
          return drawBorder(el as IBorderElement, ctx);
      }
    });
  });

  return p;
};
