"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse2els = exports.computeMetrcs = exports.normalizeWxmls = exports.queryWXML = void 0;
const style_parser_1 = require("./style-parser");
const computedStyle = [
    'color',
    'backgroundColor',
    'backgroundImage',
    'backgroundSize',
    'borderWidth',
    'borderColor',
    'borderRadius',
    'font',
    'opacity',
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
    const wrapper = constructWXML(wxmls.shift());
    result.push(wrapper);
    wxmls.forEach(wxml => {
        result.push(constructWXML(wxml, wrapper.rawMetrics));
    });
    console.log('normalized', result);
    return result;
};
exports.normalizeWxmls = normalizeWxmls;
const computeMetrcs = (wxml, refMetrics) => {
    if (!refMetrics) {
        return {
            left: 0,
            right: wxml.right - wxml.left,
            top: 0,
            bottom: wxml.bottom - wxml.top,
            width: wxml.width,
            height: wxml.height,
        };
    }
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
const constructWXML = (wxml, refMetrics) => {
    var _a;
    if (wxml.backgroundImage && /^url\(.*\)$/.test(wxml.backgroundImage)) {
        wxml.src = wxml.backgroundImage.replace(/^url\("?(.*)"?\)$/, '$1');
        wxml.backgroundImage = '';
        wxml.mode = (0, style_parser_1.parseBgSize2Mode)(wxml.backgroundSize);
    }
    const style = {};
    computedStyle.forEach(key => (style[key] = wxml[key]));
    return Object.assign(Object.assign({}, wxml), { text: (_a = wxml.dataset) === null || _a === void 0 ? void 0 : _a.text, src: wxml.src, mode: wxml.mode, metrics: (0, exports.computeMetrcs)(wxml, refMetrics), rawMetrics: {
            left: wxml.left,
            right: wxml.right,
            top: wxml.top,
            bottom: wxml.bottom,
            width: wxml.width,
            height: wxml.height,
        }, style: style });
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
    });
    console.log('els', els);
    return els;
};
exports.parse2els = parse2els;
const createColorEl = function (wxml, color = wxml.style.backgroundColor, ctx) {
    const metrics = wxml.metrics;
    return {
        type: "color",
        color: (0, style_parser_1.parseColor)(color, ctx, wxml.metrics),
        radius: (0, style_parser_1.parseSize)(wxml.style.borderRadius),
        metrics,
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createImageEl = function (wxml) {
    return {
        type: "image",
        metrics: wxml.metrics,
        src: wxml.src,
        radius: (0, style_parser_1.parseSize)(wxml.style.borderRadius),
        mode: wxml.mode,
        opacity: parseFloat(wxml.style.opacity),
    };
};
const createBorderEl = function (wxml) {
    const width = (0, style_parser_1.parseBorderWidth)(wxml.style.borderWidth);
    const metrics = Object.assign(Object.assign({}, wxml.metrics), { left: wxml.metrics.left + Math.ceil(width[3] / 2), top: wxml.metrics.top + Math.ceil(width[0] / 2), right: wxml.metrics.right - Math.ceil(width[1] / 2), bottom: wxml.metrics.bottom - Math.ceil(width[2] / 2) });
    return {
        type: "border",
        metrics,
        outerMetrics: wxml.metrics,
        color: (0, style_parser_1.parseBorderColor)(wxml.style.borderColor),
        width,
        radius: (0, style_parser_1.parseSize)(wxml.style.borderRadius),
        opacity: parseFloat(wxml.style.opacity),
    };
};
