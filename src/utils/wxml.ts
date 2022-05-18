import { parseColor, parseSize, parseBgSize2Mode } from './style-parser';

const computedStyle: StyleName[] = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'backgroundSize',
  'borderRadius',
  'font',
];

export type IPureWXML = Metrics & {
  [key in keyof typeof computedStyle]?: string;
} & {
  src?: string;
  mode?: string;
};

export type INormalizedWXML = {
  metrics: Metrics;
  style: Style;
  src?: string;
  mode?: IMAGE_MODE;
  text?: string;
};

export const queryWXML = function (
  classNames: string[] = [],
  instanceContext?: InstanceContext
): Promise<IPureWXML[]> {
  return Promise.all(
    classNames.map(className => {
      return new Promise<IPureWXML[]>(resolve => {
        (instanceContext ?? wx)
          .createSelectorQuery()
          .selectAll(className)
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
  const wrapper = constructWXML(wxmls.shift());

  result.push(wrapper);
  wxmls.forEach(wxml => {
    result.push(constructWXML(wxml, wrapper.metrics));
  });

  console.log('normalized', result);

  return result;
};

export const computeMetrcs = (wxml: any, refMetrics?: Metrics): Metrics => {
  if (!refMetrics) {
    return {
      left: 0,
      right: wxml.right - wxml.left,
      top: 0,
      bottom: wxml.bottom - wxml.top,
      width: wxml.width,
      height: wxml.height,
    };
  }

  return {
    left: wxml.left - refMetrics.left,
    top: wxml.top - refMetrics.top,
    right: wxml.right - refMetrics.left,
    bottom: wxml.bottom - refMetrics.top,
    width: wxml.width,
    height: wxml.height,
  };
};

const constructWXML = (wxml: any, refMetrics?: Metrics): INormalizedWXML => {
  if (wxml.backgroundImage && /^url\(.*\)$/.test(wxml.backgroundImage)) {
    wxml.src = wxml.backgroundImage.replace(/^url\("?(.*)"?\)$/, '$1');
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
  });
  console.log('els', els);

  return els;
};

const createColorEl = function (
  wxml: INormalizedWXML,
  color: string = wxml.style.backgroundColor!,
  ctx?: WechatMiniprogram.CanvasContext
): IElementColor {
  const metrics = wxml.metrics;

  return {
    type: ELEMENT_TYPE.COLOR,
    color: parseColor(color, ctx, wxml.metrics),
    radius: parseSize(wxml.style.borderRadius!),
    metrics,
  };
};

const createImageEl = function (wxml: INormalizedWXML): IElementImage {
  return {
    metrics: wxml.metrics,
    type: ELEMENT_TYPE.IMAGE,
    src: wxml.src!,
    radius: parseSize(wxml.style.borderRadius!),
    mode: wxml.mode!,
  };
};
