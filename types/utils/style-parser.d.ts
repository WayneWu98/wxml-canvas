export declare const parseColor: (rawColor: string, ctx?: WechatMiniprogram.CanvasContext | undefined, metrics?: Metrics | undefined) => string | WechatMiniprogram.CanvasGradient;
export declare const parseSize: (size: string, refSize?: number | undefined) => number;
export declare const parseBgSize2Mode: (bgPosition: string) => IMAGE_MODE.ASPECT_FILL | IMAGE_MODE.ASPECT_FIT | IMAGE_MODE.TOP_LEFT;
