import { parseColor, parseSize } from './style-parser';

const computedStyle: StyleName[] = [
  'color',
  'backgroundColor',
  'backgroundImage',
  'borderWidth',
  'borderColor',
  'borderRadius',
  'backgroundPosition',
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

  return result;
};

export const computeMetrcs = (wxml: any, refMetrics?: Metrics): Metrics => {
  return {
    left: wxml.left - (refMetrics ?? wxml).left,
    top: wxml.top - (refMetrics ?? wxml).top,
    right: wxml.right - (refMetrics ?? wxml).right,
    bottom: wxml.bottom - (refMetrics ?? wxml).bottom,
    width: wxml.right - wxml.left,
    height: wxml.bottom - wxml.top,
  };
};

const constructWXML = (wxml: any, refMetrics?: Metrics): INormalizedWXML => {
  const style: Style = {};
  computedStyle.forEach(key => (style[key] = wxml[key]));
  return {
    ...wxml,
    text: wxml.dataset?.text,
    src: wxml.src,
    mode: wxml.mode,
    metrics: computeMetrcs(wxml, refMetrics),
    style,
  };
};

export const parse2els = function (
  wxmls: INormalizedWXML[],
  ctx?: WechatMiniprogram.CanvasContext
): IElement[] {
  const els: IElement[] = [];
  wxmls.forEach(wxml => {
    if (wxml.style.backgroundColor) {
      els.push(createColorEl(wxml, wxml.style.backgroundColor, ctx));
    }
    if (wxml.style.backgroundImage) {
      if (wxml.style.backgroundImage.startsWith('linear-gradient')) {
        els.push(createColorEl(wxml, wxml.style.backgroundImage, ctx));
      }
    }
  });
  console.log(els);

  return els.slice(1, 2);
};

const createColorEl = function (
  wxml: INormalizedWXML,
  color: string = wxml.style.backgroundColor as string,
  ctx?: WechatMiniprogram.CanvasContext
): IElementColor {
  const metrics = wxml.metrics;

  return {
    type: ELEMENT_TYPE.COLOR,
    color: parseColor(color, ctx, wxml.metrics),
    radius: parseSize(wxml.style.borderRadius as string),
    metrics,
  };
};

const createImageEl = function (wxml: INormalizedWXML) {};

const createBorderEl = function (wxml: INormalizedWXML) {};
