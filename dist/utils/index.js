export * from './wxml';
export * from './canvas';
export const getCanvasFittedScale = (size) => {
    const dpr = wx.getSystemInfoSync().pixelRatio;
    if (size * dpr < 4096) {
        return dpr;
    }
    return 4096 / size;
};
