export const parseColor = function (
  rawColor: string,
  ctx?: WechatMiniprogram.CanvasContext,
  metrics?: Metrics
): string | WechatMiniprogram.CanvasGradient {
  // linear gradient color
  if (rawColor.startsWith('linear-gradient') && metrics && ctx) {
    const splitted = rawColor
      .replace(/linear-gradient\((.*)\)$/, '$1')
      .replace(/\,\srgb/g, '_rgb')
      .replace(/\,\s\#/g, '_#')
      .split('_')
      .map(s => s.trim());
    let x0 = metrics.width / 2;
    let y0 = metrics.height;
    let x1 = metrics.width / 2;
    let y1 = 0;
    let refSize = metrics.height;
    let deg = splitted[0].endsWith('deg')
      ? (parseFloat(splitted.shift() as string) / 180) * Math.PI
      : Math.PI;

    if (Math.abs((Math.tan(deg) * metrics.height) / 2) < metrics.width / 2) {
      let reverse = false;
      if (deg > Math.PI / 2 && deg < (Math.PI * 3) / 2) {
        reverse = true;
        deg = deg - Math.PI;
        deg < 0 && (deg += 2 * Math.PI);
      }
      const dy = Math.abs(
        (metrics.width / 2 - (metrics.height / 2) * Math.tan(deg)) *
          Math.sin(deg) *
          Math.sin(Math.PI / 2 - deg)
      );
      const dx = dy * Math.tan(deg);

      if (reverse) {
        x0 = metrics.width / 2 + dx;
        y0 = -dy;
        x1 = metrics.width / 2 - dx;
        y1 = metrics.height + dy;
      } else {
        x1 = metrics.width / 2 + dx;
        y1 = -dy;
        x0 = metrics.width / 2 - dx;
        y0 = metrics.height + dy;
      }
    } else {
      deg -= Math.PI / 2;
      let reverse = false;
      if (deg > Math.PI / 2 && deg < (Math.PI * 3) / 2) {
        reverse = true;
        deg = deg - Math.PI;
        deg < 0 && (deg += 2 * Math.PI);
      }
      const dx = Math.abs(
        (metrics.height / 2 - (metrics.width / 2) * Math.tan(deg)) *
          Math.sin(deg) *
          Math.sin(Math.PI / 2 - deg)
      );
      const dy = dx * Math.tan(deg);

      if (reverse) {
        x0 = metrics.width + dx;
        y0 = metrics.height / 2 + dy;
        x1 = -dx;
        y1 = metrics.height / 2 - dy;
      } else {
        x0 = -dx;
        y0 = metrics.height / 2 - dy;
        x1 = metrics.width + dx;
        y1 = metrics.height / 2 + dy;
      }
    }
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
    splitted
      .map(s => s.replace(/\s([^\s]+?)$/, '_$1').split('_'))
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
  let parsed;
  if (ws.length === 1) {
    parsed = [ws[0], ws[0], ws[0], ws[0]];
  } else if (ws.length === 2) {
    parsed = [ws[0], ws[1], ws[0], ws[1]];
  } else if (ws.length === 3) {
    parsed = [ws[0], ws[1], ws[2], ws[0]];
  } else {
    parsed = [ws[0], ws[1], ws[2], ws[3]];
  }
  return parsed as [number, number, number, number];
};

export const parseBorderColor = function (borderColor: string) {
  const colors = borderColor
    .replace(/\srgb/g, '_rgb')
    .replace(/\s\#/, '_#')
    .split('_');
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

export const parseLineHeight = function (lineHeight: string, fontSize: number) {
  if (lineHeight === 'normal') {
    return fontSize * 1.375;
  }
  return parseSize(lineHeight);
};

export const parsePadding = function (padding: string) {
  const ps = padding.split(' ').map(parseSize);
  let parsed;
  if (ps.length === 1) {
    parsed = [ps[0], ps[0], ps[0], ps[0]];
  } else if (ps.length === 2) {
    parsed = [ps[0], ps[1], ps[0], ps[1]];
  } else if (ps.length === 3) {
    parsed = [ps[0], ps[1], ps[2], ps[0]];
  } else {
    parsed = [ps[0], ps[1], ps[2], ps[3]];
  }
  return parsed;
};

export const parseTextOverflow2Endian = function (textOverflow: string) {
  if (textOverflow === 'ellipsis') {
    return TEXT_ENDIAN.ELLIPSIS;
  }
  return TEXT_ENDIAN.CLIP;
};

export const parseShadow = function (boxShadow: string) {
  const splitted = boxShadow.split(/\s+/);
  const color = splitted.slice(0, -4).join(', ');
  const [offsetX, offsetY, blur] = splitted.slice(-4);
  return {
    color,
    offsetX: parseSize(offsetX),
    offsetY: parseSize(offsetY),
    blur: parseSize(blur),
  };
};
