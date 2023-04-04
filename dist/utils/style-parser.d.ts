/// <reference types="miniprogram-api-typings" />
/// <reference types="./src/typings" />
export declare const parseColor: (rawColor: string, ctx?: WechatMiniprogram.CanvasContext | undefined, metrics?: Metrics | undefined) => string | WechatMiniprogram.CanvasGradient;
export declare const parseSize: (size: string, refSize?: number | undefined) => number;
export declare const parseBgSize2Mode: (bgPosition: string) => IMAGE_MODE.ASPECT_FILL | IMAGE_MODE.ASPECT_FIT | IMAGE_MODE.TOP_LEFT;
export declare const parseBorderWidth: (borderWidth: string) => [number, number, number, number];
export declare const parseBorderColor: (borderColor: string) => [string, string, string, string];
export declare const parseFittedRadius: (radius: string | number, { width, height }: Metrics) => number;
export declare const parseLineHeight: (lineHeight: string, fontSize: number) => number;
export declare const parsePadding: (padding: string) => number[];
export declare const parseTextOverflow2Endian: (textOverflow: string) => TEXT_ENDIAN;
export declare const parseShadow: (boxShadow: string) => {
    color: string;
    offsetX: number;
    offsetY: number;
    blur: number;
};
