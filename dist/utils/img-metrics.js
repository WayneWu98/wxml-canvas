export const scaleToFill = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: 0,
        tw,
        th,
    };
};
export const aspectFit = function ({ sw, sh, tw, th }) {
    const sr = sw / sh;
    const tr = tw / th;
    if (sr > tr) {
        return {
            sx: 0,
            sy: 0,
            sw,
            sh,
            tx: 0,
            ty: (th - tw / sr) / 2,
            tw,
            th: tw / sr,
        };
    }
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: (tw - sr * th) / 2,
        ty: 0,
        tw: sr * th,
        th,
    };
};
export const aspectFill = function ({ sw, sh, tw, th }) {
    const sr = sw / sh;
    const tr = tw / th;
    if (sr > tr) {
        return {
            sx: (sw - tr * sh) / 2,
            sy: 0,
            sw: tr * sh,
            sh,
            tx: 0,
            ty: 0,
            tw,
            th,
        };
    }
    return {
        sx: 0,
        sy: (sh - sw / tr) / 2,
        sw,
        sh: sw / tr,
        tx: 0,
        ty: 0,
        tw,
        th,
    };
};
export const widthFix = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: 0,
        tw,
        th,
    };
};
export const heightFix = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: 0,
        tw,
        th,
    };
};
export const top = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: (tw - sw) / 2,
        ty: 0,
        tw: sw,
        th: sh,
    };
};
export const bottom = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: (tw - sw) / 2,
        ty: th - sh,
        tw: sw,
        th: sh,
    };
};
export const center = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: (tw - sw) / 2,
        ty: (th - sh) / 2,
        tw: sw,
        th: sh,
    };
};
export const left = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: (th - sh) / 2,
        tw: sw,
        th: sh,
    };
};
export const right = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: tw - sw,
        ty: (th - sh) / 2,
        tw: sw,
        th: sh,
    };
};
export const topLeft = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: 0,
        tw: sw,
        th: sh,
    };
};
export const topRight = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: tw - sw,
        ty: 0,
        tw: sw,
        th: sh,
    };
};
export const bottomLeft = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: 0,
        ty: th - sh,
        tw: sw,
        th: sh,
    };
};
export const bottomRight = function ({ sw, sh, tw, th }) {
    return {
        sx: 0,
        sy: 0,
        sw,
        sh,
        tx: tw - sw,
        ty: th - sh,
        tw: sw,
        th: sh,
    };
};
export default {
    ["scaleToFill"]: scaleToFill,
    ["aspectFit"]: aspectFit,
    ["aspectFill"]: aspectFill,
    ["widthFix"]: widthFix,
    ["heightFix"]: heightFix,
    ["top"]: top,
    ["bottom"]: bottom,
    ["center"]: center,
    ["left"]: left,
    ["right"]: right,
    ["top left"]: topLeft,
    ["top right"]: topRight,
    ["bottom left"]: bottomLeft,
    ["bottom right"]: bottomRight,
};
