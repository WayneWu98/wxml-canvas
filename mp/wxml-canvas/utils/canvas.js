"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw = exports.normalizer = void 0;
const img_metrics_1 = __importDefault(require("./img-metrics"));
exports.normalizer = {
    size(str) {
        return str.replace(/[^\d]/g, '');
    },
    isUrl(str) {
        return /^url\(.*\)$/.test(str);
    },
    url(str) {
        return str.replace(/^url\("(.*)"\)$/, '$1');
    },
    isLinearGradient(str) {
        return /^linear-gradient\(.*\)$/.test(str);
    },
    linearGradient(str, metrics, ctx) {
        const splited = str.replace(/^linear-gradient\((.*)\)$/, '$1').split(',');
        let linearPosition = {
            x0: (metrics.right - metrics.left) / 2,
            y0: 0,
            x1: (metrics.right - metrics.left) / 2,
            y1: 1,
        };
        if (/deg$/.test(splited[0])) {
            const radian = (parseFloat(splited.pop()) / 360) * Math.PI * 2;
            const w = (Math.tan(radian) * metrics.height) / 2;
            const h = (Math.atan(radian) * metrics.width) / 2;
        }
    },
};
const clipRect = function (ctx, { left, top, right, bottom, width, height, radius, }) {
    ctx.beginPath();
    if (radius) {
        const newLeft = left + radius;
        const newRight = right - radius;
        const newTop = top + radius;
        const newBottom = bottom - radius;
        ctx.moveTo(newLeft, top);
        ctx.lineTo(newRight, top);
        ctx.arc(newRight, newTop, radius, -Math.PI / 2, 0);
        ctx.lineTo(right, newBottom);
        ctx.arc(newRight, newBottom, radius, 0, Math.PI / 2);
        ctx.lineTo(newLeft, bottom);
        ctx.arc(newLeft, newBottom, radius, Math.PI / 2, Math.PI);
        ctx.lineTo(left, newTop);
        ctx.arc(newLeft, newTop, radius, Math.PI, -Math.PI / 2);
    }
    else {
        ctx.rect(left, top, width, height);
    }
    ctx.closePath();
    ctx.clip();
};
const clipCircle = function (ctx, { x, y, r }) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.clip();
};
const computeImgMetrcsByMode = function ({ sw, sh, tw, th }, mode) { };
const drawLine = function (ctx, [x0, y0, x1, y1], { lineWidth, color, opacity, }) {
    if (!lineWidth) {
        return;
    }
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.restore();
};
const drawArc = function (ctx, { x, y, radius, startAngle, endAngle, lineWidth, opacity, color, }) {
    if (!lineWidth) {
        return;
    }
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, startAngle, endAngle);
    ctx.stroke();
    ctx.restore();
};
const drawColor = function ({ metrics, color, radius, opacity }, ctx) {
    ctx.save();
    ctx.globalAlpha = opacity;
    clipRect(ctx, Object.assign(Object.assign({}, metrics), { radius }));
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return Promise.resolve();
};
const drawText = function () { };
const drawImage = function (el, ctx, canvas) {
    return new Promise((resolve, reject) => {
        const img = canvas.createImage();
        img.onload = () => {
            ctx.save();
            ctx.globalAlpha = el.opacity;
            const { sx, sy, sw, sh, tx, ty, tw, th } = img_metrics_1.default[el.mode]({
                sw: img.width,
                sh: img.height,
                tw: el.metrics.width,
                th: el.metrics.height,
            });
            clipRect(ctx, Object.assign(Object.assign({}, el.metrics), { radius: el.radius }));
            ctx.drawImage(img, sx, sy, sw, sh, el.metrics.left + tx, el.metrics.top + ty, tw, th);
            ctx.restore();
            resolve();
        };
        img.onerror = reject;
        img.src = el.src;
    });
};
const drawBorder = function ({ width, metrics, outerMetrics, radius, color }, ctx) {
    ctx.save();
    clipRect(ctx, Object.assign(Object.assign({}, metrics), { radius }));
    if (width.every(v => v === width[0]) && radius === 0) {
        ctx.rect(metrics.left, metrics.top, metrics.width, metrics.height);
        ctx.stroke();
    }
    else {
        const newLeft = metrics.left + radius;
        const newRight = metrics.right - radius;
        const newTop = metrics.top + radius;
        const newBottom = metrics.bottom - radius;
        clipRect(ctx, Object.assign(Object.assign({}, outerMetrics), { radius }));
        drawLine(ctx, [newLeft, metrics.top, newRight, metrics.top], {
            lineWidth: width[0],
            color: color[0],
            opacity: 1,
        });
        drawLine(ctx, [metrics.right, newTop, metrics.right, newBottom], {
            lineWidth: width[1],
            color: color[1],
            opacity: 1,
        });
        drawLine(ctx, [newLeft, metrics.bottom, newRight, metrics.bottom], {
            lineWidth: width[2],
            color: color[2],
            opacity: 1,
        });
        drawLine(ctx, [metrics.left, newTop, metrics.left, newBottom], {
            lineWidth: width[3],
            color: color[3],
            opacity: 1,
        });
        if (width[0]) {
            if (width[1]) {
                drawArc(ctx, {
                    x: newRight,
                    y: newTop,
                    radius,
                    startAngle: -Math.PI / 2,
                    endAngle: 0,
                    lineWidth: width[1],
                    opacity: 1,
                    color: color[1],
                });
            }
            if (width[3]) {
                drawArc(ctx, {
                    x: newLeft,
                    y: newTop,
                    radius,
                    startAngle: Math.PI,
                    endAngle: (Math.PI * 3) / 2,
                    lineWidth: width[0],
                    opacity: 1,
                    color: color[0],
                });
            }
        }
        if (width[2]) {
            if (width[1]) {
                drawArc(ctx, {
                    x: newRight,
                    y: newBottom,
                    radius,
                    startAngle: 0,
                    endAngle: Math.PI / 2,
                    lineWidth: width[2],
                    opacity: 1,
                    color: color[2],
                });
            }
            if (width[3]) {
                drawArc(ctx, {
                    x: newLeft,
                    y: newBottom,
                    radius,
                    startAngle: Math.PI / 2,
                    endAngle: Math.PI,
                    lineWidth: width[3],
                    opacity: 1,
                    color: color[3],
                });
            }
        }
    }
    ctx.restore();
    return Promise.resolve();
};
const draw = (els, ctx, canvas) => {
    let p = Promise.resolve();
    els.forEach(el => {
        p = p.then(() => {
            if (el.metrics.width === 0 || el.metrics.height === 0) {
                return Promise.resolve();
            }
            switch (el.type) {
                case "color":
                    return drawColor(el, ctx);
                case "image":
                    return drawImage(el, ctx, canvas);
                case "border":
                    return drawBorder(el, ctx);
            }
        });
    });
    return p;
};
exports.draw = draw;
