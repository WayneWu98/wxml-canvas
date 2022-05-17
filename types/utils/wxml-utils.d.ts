/// <reference types="./src/typings" />
declare const computedStyle: StyleName[];
export declare type IPureWXML = Metrics & {
    [key in keyof typeof computedStyle]?: string;
} & {
    src?: string;
    mode?: string;
};
export declare type INormalizedWXML = {
    metrics: Metrics;
    style: Style;
    src?: string;
    mode?: IMAGE_MODE;
    text?: string;
};
export declare const queryWXML: (classNames?: string[], instanceContext?: InstanceContext) => Promise<IPureWXML[]>;
export declare const normalizeWxmls: (wxmls: IPureWXML[]) => INormalizedWXML[];
export declare const computeMetrcs: (wxml: any, refMetrics?: Metrics | undefined) => Metrics;
export declare const parse2els: (wxmls: INormalizedWXML[], ctx?: WechatMiniprogram.CanvasContext | undefined) => IElement[];
export {};
