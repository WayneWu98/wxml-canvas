/// <reference types="miniprogram-api-typings" />
/// <reference types="./src/typings" />
export declare const parseColor: (rawColor: string, ctx?: WechatMiniprogram.CanvasContext | undefined, metrics?: Metrics | undefined) => string | WechatMiniprogram.CanvasGradient;
export declare const parseSize: (size: string, refSize?: number | undefined) => number;
