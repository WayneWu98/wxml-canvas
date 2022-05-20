"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseShadow = exports.parseTextOverflow2Endian = exports.parsePadding = exports.parseLineHeight = exports.parseFittedRadius = exports.parseBorderColor = exports.parseBorderWidth = exports.parseBgSize2Mode = exports.parseSize = exports.parseColor = void 0;
const parseColor = function (rawColor, ctx, metrics) {
    if (rawColor.startsWith('linear-gradient') && metrics && ctx) {
        const splitted = rawColor
            .replace(/linear-gradient\((.*)\)$/, '$1')
            .split(/\,\s(?=[(rgb)(#)])/)
            .map(s => s.trim());
        let x0 = 0;
        let y0 = 0;
        let x1 = 0;
        let y1 = metrics.height;
        let refSize = metrics.height;
        if (splitted[0].endsWith('deg')) {
            const angle = splitted.shift();
            switch (angle) {
                case '90deg':
                    x0 = y0 = y1 = 0;
                    refSize = x1 = metrics.width;
                    break;
                case '0deg':
                    x0 = x1 = y1 = 0;
                    refSize = y0 = metrics.height;
                    break;
                case '270deg':
                    x1 = y0 = y1 = 0;
                    refSize = x0 = metrics.width;
            }
        }
        const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
        splitted
            .map(s => s.split(/\s(?=[^\s]+$)/))
            .forEach(([color, position]) => {
            gradient.addColorStop((0, exports.parseSize)(position, refSize) / refSize, color);
        });
        return gradient;
    }
    if (/^#[0-9a-f]+/.test(rawColor) || /^rgb/.test(rawColor)) {
        return rawColor;
    }
    return '';
};
exports.parseColor = parseColor;
const parseSize = function (size, refSize) {
    if (/%$/.test(size)) {
        return (parseFloat(size) / 100) * (refSize !== null && refSize !== void 0 ? refSize : 1);
    }
    return parseFloat(size);
};
exports.parseSize = parseSize;
const parseBgSize2Mode = function (bgPosition) {
    switch (bgPosition) {
        case 'cover':
            return "aspectFill";
        case 'contain':
            return "aspectFit";
        default:
            return "top left";
    }
};
exports.parseBgSize2Mode = parseBgSize2Mode;
const parseBorderWidth = function (borderWidth) {
    const ws = borderWidth.split(' ').map(exports.parseSize);
    let parsed;
    if (ws.length === 1) {
        parsed = [ws[0], ws[0], ws[0], ws[0]];
    }
    else if (ws.length === 2) {
        parsed = [ws[0], ws[1], ws[0], ws[1]];
    }
    else if (ws.length === 3) {
        parsed = [ws[0], ws[1], ws[2], ws[0]];
    }
    else {
        parsed = [ws[0], ws[1], ws[2], ws[3]];
    }
    return parsed;
};
exports.parseBorderWidth = parseBorderWidth;
const parseBorderColor = function (borderColor) {
    const colors = borderColor.split(/\s(?=[(rgb)(#)])/);
    let color;
    if (colors.length === 1) {
        color = [colors[0], colors[0], colors[0], colors[0]];
    }
    else if (colors.length === 2) {
        color = [colors[0], colors[1], colors[0], colors[1]];
    }
    else if (colors.length === 3) {
        color = [colors[0], colors[1], colors[2], colors[0]];
    }
    else {
        color = [colors[0], colors[1], colors[2], colors[3]];
    }
    return color;
};
exports.parseBorderColor = parseBorderColor;
const parseFittedRadius = function (radius, { width, height }) {
    radius = (0, exports.parseSize)(radius);
    if (radius > Math.min(width, height) / 2) {
        return Math.min(width, height) / 2;
    }
    return radius;
};
exports.parseFittedRadius = parseFittedRadius;
const parseLineHeight = function (lineHeight, fontSize) {
    if (lineHeight === 'normal') {
        return fontSize * 1.375;
    }
    return (0, exports.parseSize)(lineHeight);
};
exports.parseLineHeight = parseLineHeight;
const parsePadding = function (padding) {
    const ps = padding.split(' ').map(exports.parseSize);
    let parsed;
    if (ps.length === 1) {
        parsed = [ps[0], ps[0], ps[0], ps[0]];
    }
    else if (ps.length === 2) {
        parsed = [ps[0], ps[1], ps[0], ps[1]];
    }
    else if (ps.length === 3) {
        parsed = [ps[0], ps[1], ps[2], ps[0]];
    }
    else {
        parsed = [ps[0], ps[1], ps[2], ps[3]];
    }
    return parsed;
};
exports.parsePadding = parsePadding;
const parseTextOverflow2Endian = function (textOverflow) {
    if (textOverflow === 'ellipsis') {
        return "ellipsis";
    }
    return "clip";
};
exports.parseTextOverflow2Endian = parseTextOverflow2Endian;
const parseShadow = function (boxShadow) {
    const [color, offsetX, offsetY, blur] = boxShadow.split(/(?<=[^\,])\s/);
    return {
        color,
        offsetX: (0, exports.parseSize)(offsetX),
        offsetY: (0, exports.parseSize)(offsetY),
        blur: (0, exports.parseSize)(blur),
    };
};
exports.parseShadow = parseShadow;
