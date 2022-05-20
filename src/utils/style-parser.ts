export const parseColor = function (
  rawColor: string,
  ctx?: WechatMiniprogram.CanvasContext,
  metrics?: Metrics
): string | WechatMiniprogram.CanvasGradient {
  // linear gradient color
  if (rawColor.startsWith('linear-gradient') && metrics && ctx) {
    const splitted = rawColor
      .replace(/linear-gradient\((.*)\)$/, '$1')
      .split(/\,\s(?=[(rgb)(#)])/)
      .map(s => s.trim());
    let x0 = 0;
    let y0 = 0;
    let x1 = 0;
    let y1 = metrics.height;
    let refSize = metrics.height;
    if (splitted[0].endsWith('deg')) {
      const angle = splitted.shift();
      switch (angle) {
        case '90deg':
          x0 = y0 = y1 = 0;
          refSize = x1 = metrics.width;
          break;
        case '0deg':
          x0 = x1 = y1 = 0;
          refSize = y0 = metrics.height;
          break;
        case '270deg':
          x1 = y0 = y1 = 0;
          refSize = x0 = metrics.width;
      }
    }
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    splitted
      .map(s => s.split(/\s(?=[^\s]+$)/))
      .forEach(([color, position]) => {
        gradient.addColorStop(parseSize(position, refSize) / refSize, color);
      });

    return gradient;
  }

  // TODO: radial gradient color
  // if (rawColor.startsWith('radial-gradient')) {
  // }

  if (/^#[0-9a-f]+/.test(rawColor) || /^rgb/.test(rawColor)) {
    return rawColor;
  }
  return '';
};

export const parseSize = function (size: string, refSize?: number) {
  if (/%$/.test(size)) {
    return (parseFloat(size) / 100) * (refSize ?? 1);
  }
  return parseFloat(size);
};

export const parseBgSize2Mode = function (bgPosition: string) {
  switch (bgPosition) {
    case 'cover':
      return IMAGE_MODE.ASPECT_FILL;
    case 'contain':
      return IMAGE_MODE.ASPECT_FIT;
    default:
      return IMAGE_MODE.TOP_LEFT;
  }
};

export const parseBorderWidth = function (borderWidth: string) {
  const ws = borderWidth.split(' ').map(parseSize);
  let width;
  if (ws.length === 1) {
    width = [ws[0], ws[0], ws[0], ws[0]];
  } else if (ws.length === 2) {
    width = [ws[0], ws[1], ws[0], ws[1]];
  } else if (ws.length === 3) {
    width = [ws[0], ws[1], ws[2], ws[0]];
  } else {
    width = [ws[0], ws[1], ws[2], ws[3]];
  }
  return width as [number, number, number, number];
};

export const parseBorderColor = function (borderColor: string) {
  const colors = borderColor.split(/\s(?=[(rgb)(#)])/);
  let color;
  if (colors.length === 1) {
    color = [colors[0], colors[0], colors[0], colors[0]];
  } else if (colors.length === 2) {
    color = [colors[0], colors[1], colors[0], colors[1]];
  } else if (colors.length === 3) {
    color = [colors[0], colors[1], colors[2], colors[0]];
  } else {
    color = [colors[0], colors[1], colors[2], colors[3]];
  }
  return color as [string, string, string, string];
};

export const parseFittedRadius = function (
  radius: string | number,
  { width, height }: Metrics
) {
  radius = parseSize(radius as string);
  if (radius > Math.min(width, height) / 2) {
    return Math.min(width, height) / 2;
  }
  return radius;
};
