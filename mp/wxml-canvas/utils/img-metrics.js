"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bottomRight = exports.bottomLeft = exports.topRight = exports.topLeft = exports.right = exports.left = exports.center = exports.bottom = exports.top = exports.heightFix = exports.widthFix = exports.aspectFill = exports.aspectFit = exports.scaleToFill = void 0;
const scaleToFill = function ({ sw, sh, tw, th }) {
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
exports.scaleToFill = scaleToFill;
const aspectFit = function ({ sw, sh, tw, th }) {
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
exports.aspectFit = aspectFit;
const aspectFill = function ({ sw, sh, tw, th }) {
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
exports.aspectFill = aspectFill;
const widthFix = function ({ sw, sh, tw, th }) {
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
exports.widthFix = widthFix;
const heightFix = function ({ sw, sh, tw, th }) {
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
exports.heightFix = heightFix;
const top = function ({ sw, sh, tw, th }) {
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
exports.top = top;
const bottom = function ({ sw, sh, tw, th }) {
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
exports.bottom = bottom;
const center = function ({ sw, sh, tw, th }) {
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
exports.center = center;
const left = function ({ sw, sh, tw, th }) {
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
exports.left = left;
const right = function ({ sw, sh, tw, th }) {
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
exports.right = right;
const topLeft = function ({ sw, sh, tw, th }) {
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
exports.topLeft = topLeft;
const topRight = function ({ sw, sh, tw, th }) {
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
exports.topRight = topRight;
const bottomLeft = function ({ sw, sh, tw, th }) {
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
exports.bottomLeft = bottomLeft;
const bottomRight = function ({ sw, sh, tw, th }) {
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
exports.bottomRight = bottomRight;
exports.default = {
    ["scaleToFill"]: exports.scaleToFill,
    ["aspectFit"]: exports.aspectFit,
    ["aspectFill"]: exports.aspectFill,
    ["widthFix"]: exports.widthFix,
    ["heightFix"]: exports.heightFix,
    ["top"]: exports.top,
    ["bottom"]: exports.bottom,
    ["center"]: exports.center,
    ["left"]: exports.left,
    ["right"]: exports.right,
    ["top left"]: exports.topLeft,
    ["top right"]: exports.topRight,
    ["bottom left"]: exports.bottomLeft,
    ["bottom right"]: exports.bottomRight,
};
