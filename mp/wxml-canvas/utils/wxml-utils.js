import { parseColor, parseSize } from './style-parser';
const computedStyle = [
    'color',
    'backgroundColor',
    'backgroundImage',
    'borderWidth',
    'borderColor',
    'borderRadius',
    'backgroundPosition',
    'font',
];
export const queryWXML = function (classNames = [], instanceContext) {
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
                console.log(res);
                resolve(res[0]);
            });
        });
    })).then(res => res
        .filter(wxmls => wxmls.length)
        .reduce((curr, next) => curr.concat(next), []));
};
export const normalizeWxmls = function (wxmls) {
    const result = [];
    const wrapper = constructWXML(wxmls.shift());
    result.push(wrapper);
    wxmls.forEach(wxml => {
        result.push(constructWXML(wxml, wrapper.metrics));
    });
    return result;
};
export const computeMetrcs = (wxml, refMetrics) => {
    return {
        left: wxml.left + (refMetrics !== null && refMetrics !== void 0 ? refMetrics : wxml).left,
        top: wxml.top + (refMetrics !== null && refMetrics !== void 0 ? refMetrics : wxml).top,
        right: wxml.right + (refMetrics !== null && refMetrics !== void 0 ? refMetrics : wxml).right,
        bottom: wxml.bottom + (refMetrics !== null && refMetrics !== void 0 ? refMetrics : wxml).bottom,
        width: wxml.right - wxml.left,
        height: wxml.bottom - wxml.top,
    };
};
const constructWXML = (wxml, refMetrics) => {
    var _a;
    return Object.assign(Object.assign({}, wxml), { text: (_a = wxml.dataset) === null || _a === void 0 ? void 0 : _a.text, src: wxml.src, mode: wxml.mode, metrics: computeMetrcs(wxml, refMetrics) });
};
const parse2els = function (wxmls, ctx) {
    const els = [];
    wxmls.forEach(wxml => {
        if (wxml.style.backgroundColor) {
            els.push(createColorEl(wxml, ctx));
        }
    });
    return els;
};
const createColorEl = function (wxml, ctx) {
    const radius = wxml.style.borderRadius;
    const metrics = wxml.metrics;
    return {
        type: ELEMENT_TYPE.COLOR,
        color: parseColor(wxml.style.backgroundColor),
        radius: parseSize(wxml.style.borderRadius),
        metrics,
    };
};
const createImageEl = function (wxml) { };
const createBorderEl = function (wxml) { };
