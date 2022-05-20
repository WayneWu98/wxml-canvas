"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse2els = exports.computeMetrcs = exports.normalizeWxmls = exports.queryWXML = void 0;
const style_parser_1 = require("./style-parser");
const computedStyle = [
    'padding',
    'color',
    'backgroundColor',
    'backgroundImage',
    'backgroundSize',
    'borderWidth',
    'borderColor',
    'borderRadius',
    'font',
    'opacity',
    'boxShadow',
    'textAlign',
    'textShadow',
    'textOverflow',
    'lineHeight',
    'fontSize',
];
const queryWXML = function (classNames = [], instanceContext) {
    return Promise.all(classNames.map(className => {
        return new Promise(resolve => {
            (instanceContext !== null && instanceContext !== void 0 ? instanceContext : wx)
                .createSelectorQuery()
                .selectAll(className)
                .fields({
                size: true,
                dataset: true,
                rect: true,
                properties: ['src', 'mode'],
                computedStyle,
            })
                .exec((res) => {
                resolve(res[0]);
            });
        });
    })).then(res => res
        .filter(wxmls => wxmls.length)
        .reduce((curr, next) => curr.concat(next), []));
};
exports.queryWXML = queryWXML;
const normalizeWxmls = function (wxmls) {
    const result = [];
    const wrapper = wxmls.shift();
    const refMetrics = {
        left: wrapper === null || wrapper === void 0 ? void 0 : wrapper.left,
        top: wrapper === null || wrapper === void 0 ? void 0 : wrapper.top,
        right: wrapper === null || wrapper === void 0 ? void 0 : wrapper.right,
        bottom: wrapper === null || wrapper === void 0 ? void 0 : wrapper.bottom,
        width: wrapper === null || wrapper === void 0 ? void 0 : wrapper.width,
        height: wrapper === null || wrapper === void 0 ? void 0 : wrapper.height,
    };
    const normalizedWrapper = constructWXML(wrapper);
    result.push(normalizedWrapper);
    wxmls.forEach(wxml => {
        result.push(constructWXML(wxml, refMetrics));
    });
    console.log('normalized', result);
    return result;
};
exports.normalizeWxmls = normalizeWxmls;
const computeMetrcs = (wxml, refMetrics) => {
    return {
        left: wxml.left - refMetrics.left,
        top: wxml.top - refMetrics.top,
        right: wxml.right - refMetrics.left,
        bottom: wxml.bottom - refMetrics.top,
        width: wxml.width,
        height: wxml.height,
    };
};
exports.computeMetrcs = computeMetrcs;
const constructWXML = (wxml, refMetrics = wxml) => {
    var _a;
    if (wxml.backgroundImage && /^url\(.*\)$/.test(wxml.backgroundImage)) {
        wxml.src = wxml.backgroundImage.replace(/^url\("?(.*)"?\)$/, '$1');
        wxml.backgroundImage = '';
        wxml.mode = (0, style_parser_1.parseBgSize2Mode)(wxml.backgroundSize);
    }
    const style = {};
    computedStyle.forEach(key => (style[key] = wxml[key]));
    return Object.assign(Object.assign({}, wxml), { text: (_a = wxml.dataset) === null || _a === void 0 ? void 0 : _a.text, src: wxml.src, mode: wxml.mode, metrics: (0, exports.computeMetrcs)(wxml, refMetrics), style: style });
};
const parse2els = function (wxmls, ctx, canvas) {
    const els = [];
    wxmls.forEach(wxml => {
        if (wxml.style.backgroundColor &&
            wxml.style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
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
        if (wxml.style.borderWidth && wxml.style.borderWidth !== '0px') {
            els.push(createBorderEl(wxml));
        }
        if (wxml.style.boxShadow && wxml.style.boxShadow !== 'none') {
            els.push(createShadowEl(wxml));
        }
        if (wxml.text) {
            els.push(createTextEl(wxml));
        }
    });
    console.log('els', els);
    return els;
};
exports.parse2els = parse2els;
const createColorEl = function (wxml, color = wxml.style.backgroundColor, ctx) {
    return {
        type: "color",
        color: (0, style_parser_1.parseColor)(color, ctx, wxml.metrics),
        radius: (0, style_parser_1.parseFittedRadius)(wxml.style.borderRadius, wxml.metrics),
        metrics: wxml.metrics,
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createImageEl = function (wxml) {
    return {
        type: "image",
        metrics: wxml.metrics,
        src: wxml.src,
        radius: (0, style_parser_1.parseFittedRadius)(wxml.style.borderRadius, wxml.metrics),
        mode: wxml.mode,
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createBorderEl = function (wxml) {
    const width = (0, style_parser_1.parseBorderWidth)(wxml.style.borderWidth);
    const metrics = Object.assign(Object.assign({}, wxml.metrics), { left: wxml.metrics.left + Math.floor(width[3] / 2), top: wxml.metrics.top + Math.floor(width[0] / 2), right: wxml.metrics.right - Math.floor(width[1] / 2), bottom: wxml.metrics.bottom - Math.floor(width[2] / 2) });
    return {
        type: "border",
        metrics,
        outerMetrics: wxml.metrics,
        color: (0, style_parser_1.parseBorderColor)(wxml.style.borderColor),
        width,
        radius: (0, style_parser_1.parseFittedRadius)(wxml.style.borderRadius, metrics),
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createShadowEl = function (wxml) {
    const { color, offsetX, offsetY, blur } = (0, style_parser_1.parseShadow)(wxml.style.boxShadow);
    return {
        type: "shadow",
        metrics: wxml.metrics,
        color,
        radius: (0, style_parser_1.parseFittedRadius)(wxml.style.borderRadius, wxml.metrics),
        offsetX,
        offsetY,
        blur,
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createTextEl = function (wxml) {
    const padding = (0, style_parser_1.parsePadding)(wxml.style.padding);
    const metrics = {
        top: wxml.metrics.top + padding[0],
        right: wxml.metrics.right - padding[1],
        bottom: wxml.metrics.bottom - padding[2],
        left: wxml.metrics.left + padding[3],
        width: wxml.metrics.width - padding[1] - padding[3],
        height: wxml.metrics.height - padding[0] - padding[2],
    };
    const lineHeight = (0, style_parser_1.parseLineHeight)(wxml.style.lineHeight, (0, style_parser_1.parseSize)(wxml.style.fontSize));
    const maxLines = metrics.height / lineHeight;
    return {
        type: "text",
        metrics,
        text: wxml.text,
        color: wxml.style.color,
        font: wxml.style.font,
        endian: (0, style_parser_1.parseTextOverflow2Endian)(wxml.style.textOverflow),
        textAlign: wxml.style.textAlign,
        maxLines,
        lineHeight,
        opacity: parseFloat(wxml.style.opacity),
        shadow: wxml.style.textShadow && wxml.style.textShadow !== 'none'
            ? (0, style_parser_1.parseShadow)(wxml.style.textShadow)
            : undefined,
    };
};
