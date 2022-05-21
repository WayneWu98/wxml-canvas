import {
  parseColor,
  parseSize,
  parseBgSize2Mode,
  parseBorderWidth,
  parseBorderColor,
  parseFittedRadius,
  parsePadding,
  parseTextOverflow2Endian,
  parseLineHeight,
  parseShadow,
} from './style-parser';

const computedStyle: StyleName[] = [
  'padding',
  'color',
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'borderWidth',
  'borderColor',
  'borderRadius',
  'font',
  'opacity',
  'boxShadow',
  'textAlign',
  'textShadow',
  'textOverflow',
  'lineHeight',
  'fontSize',
];

export type IPureWXML = Metrics & {
  [key in keyof typeof computedStyle]?: string;
} & {
  src?: string;
  mode?: string;
};

export type INormalizedWXML = {
  metrics: Metrics;
  rawMetrics: Metrics;
  style: Style;
  src?: string;
  mode?: IMAGE_MODE;
  text?: string;
};

export const queryWXML = function (
  selectors: string[] = [],
  instanceContext?: InstanceContext
): Promise<IPureWXML[]> {
  return Promise.all(
    selectors.map(selector => {
      return new Promise<IPureWXML[]>(resolve => {
        (instanceContext ?? wx)
          .createSelectorQuery()
          .selectAll(selector)
          .fields({
            size: true,
            dataset: true,
            rect: true,
            properties: ['src', 'mode'],
            computedStyle,
          })
          .exec((res: any) => {
            resolve(res[0] as IPureWXML[]);
          });
      });
    })
  ).then(res =>
    res
      .filter(wxmls => wxmls.length)
      .reduce((curr, next) => curr.concat(next), [] as IPureWXML[])
  );
};

export const normalizeWxmls = function (wxmls: IPureWXML[]) {
  const result: INormalizedWXML[] = [];
  const wrapper = wxmls.shift();
  const refMetrics = {
    left: wrapper?.left,
    top: wrapper?.top,
    right: wrapper?.right,
    bottom: wrapper?.bottom,
    width: wrapper?.width,
    height: wrapper?.height,
  };
  const normalizedWrapper = constructWXML(wrapper);

  result.push(normalizedWrapper);
  wxmls.forEach(wxml => {
    result.push(constructWXML(wxml, refMetrics as Metrics));
  });
  return result;
};

export const computeMetrcs = (wxml: any, refMetrics: Metrics): Metrics => {
  return {
    left: wxml.left - refMetrics.left,
    top: wxml.top - refMetrics.top,
    right: wxml.right - refMetrics.left,
    bottom: wxml.bottom - refMetrics.top,
    width: wxml.width,
    height: wxml.height,
  };
};

const constructWXML = (
  wxml: any,
  refMetrics: Metrics = wxml
): INormalizedWXML => {
  if (wxml.backgroundImage && /^url\(.*\)$/.test(wxml.backgroundImage)) {
    wxml.src = wxml.backgroundImage.replace(/^url\("?(.*?)"?\)$/, '$1');
    wxml.backgroundImage = '';
    wxml.mode = parseBgSize2Mode(wxml.backgroundSize!);
  }
  const style = {} as any;
  computedStyle.forEach(key => (style[key] = wxml[key]));
  return {
    ...wxml,
    text: wxml.dataset?.text,
    src: wxml.src,
    mode: wxml.mode,
    metrics: computeMetrcs(wxml, refMetrics),
    style: style as Style,
  };
};

export const parse2els = function (
  wxmls: INormalizedWXML[],
  ctx: WechatMiniprogram.CanvasContext,
  canvas: WechatMiniprogram.Canvas
): IElement[] {
  const els: IElement[] = [];
  wxmls.forEach(wxml => {
    if (
      wxml.style.backgroundColor &&
      wxml.style.backgroundColor !== 'rgba(0, 0, 0, 0)'
    ) {
      els.push(createColorEl(wxml, wxml.style.backgroundColor, ctx));
    }
    if (wxml.style.backgroundImage && wxml.style.backgroundImage !== 'none') {
      if (wxml.style.backgroundImage.startsWith('linear-gradient')) {
        els.push(createColorEl(wxml, wxml.style.backgroundImage, ctx));
      }
    }
    if (wxml.src) {
      els.push(createImageEl(wxml));
    }
    if (wxml.style.borderWidth && wxml.style.borderWidth !== '0px') {
      els.push(createBorderEl(wxml));
    }
    if (wxml.style.boxShadow && wxml.style.boxShadow !== 'none') {
      els.push(createShadowEl(wxml));
    }
    if (wxml.text) {
      els.push(createTextEl(wxml));
    }
  });
  return els;
};

const createColorEl = function (
  wxml: INormalizedWXML,
  color: string = wxml.style.backgroundColor!,
  ctx?: WechatMiniprogram.CanvasContext
): IColorElement {
  return {
    type: ELEMENT_TYPE.COLOR,
    color: parseColor(color, ctx, wxml.metrics),
    radius: parseFittedRadius(wxml.style.borderRadius, wxml.metrics),
    metrics: wxml.metrics,
    opacity: parseFloat(wxml.style.opacity!),
  };
};

const createImageEl = function (wxml: INormalizedWXML): IImageElement {
  return {
    type: ELEMENT_TYPE.IMAGE,
    metrics: wxml.metrics,
    src: wxml.src!,
    radius: parseFittedRadius(wxml.style.borderRadius, wxml.metrics),
    mode: wxml.mode!,
    opacity: parseFloat(wxml.style.opacity!),
  };
};

const createBorderEl = function (wxml: INormalizedWXML): IBorderElement {
  const width = parseBorderWidth(wxml.style.borderWidth!);
  const metrics = {
    ...wxml.metrics,
    left: wxml.metrics.left + Math.floor(width[3] / 2),
    top: wxml.metrics.top + Math.floor(width[0] / 2),
    right: wxml.metrics.right - Math.floor(width[1] / 2),
    bottom: wxml.metrics.bottom - Math.floor(width[2] / 2),
  };
  return {
    type: ELEMENT_TYPE.BORDER,
    metrics,
    outerMetrics: wxml.metrics,
    color: parseBorderColor(wxml.style.borderColor!),
    width,
    radius: parseFittedRadius(wxml.style.borderRadius, metrics),
    opacity: parseFloat(wxml.style.opacity!),
  };
};

const createShadowEl = function (wxml: INormalizedWXML): IShadowElement {
  const { color, offsetX, offsetY, blur } = parseShadow(wxml.style.boxShadow);

  return {
    type: ELEMENT_TYPE.SHADOW,
    metrics: wxml.metrics,
    color,
    radius: parseFittedRadius(wxml.style.borderRadius, wxml.metrics),
    offsetX,
    offsetY,
    blur,
    opacity: parseFloat(wxml.style.opacity!),
  };
};

const createTextEl = function (wxml: INormalizedWXML): ITextElement {
  const padding = parsePadding(wxml.style.padding);
  const metrics = {
    top: wxml.metrics.top + padding[0],
    right: wxml.metrics.right - padding[1],
    bottom: wxml.metrics.bottom - padding[2],
    left: wxml.metrics.left + padding[3],
    width: wxml.metrics.width - padding[1] - padding[3],
    height: wxml.metrics.height - padding[0] - padding[2],
  };
  const lineHeight = parseLineHeight(
    wxml.style.lineHeight,
    parseSize(wxml.style.fontSize)
  );
  const maxLines = metrics.height / lineHeight;
  return {
    type: ELEMENT_TYPE.TEXT,
    metrics,
    text: wxml.text!,
    color: wxml.style.color,
    font: wxml.style.font,
    endian: parseTextOverflow2Endian(wxml.style.textOverflow),
    textAlign: wxml.style.textAlign,
    maxLines,
    lineHeight,
    opacity: parseFloat(wxml.style.opacity!),
    shadow:
      wxml.style.textShadow && wxml.style.textShadow !== 'none'
        ? parseShadow(wxml.style.textShadow)
        : undefined,
  };
};
