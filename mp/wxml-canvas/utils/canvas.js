"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.draw = exports.drawImage = exports.drawText = exports.drawColor = exports.normalizer = void 0;
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
const drawColor = function ({ metrics, color, radius }, ctx) {
    ctx.save();
    clipRect(ctx, Object.assign(Object.assign({}, metrics), { radius }));
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return Promise.resolve();
};
exports.drawColor = drawColor;
const drawText = function () { };
exports.drawText = drawText;
const drawImage = function (el, ctx, canvas) {
    return new Promise((resolve, reject) => {
        const img = canvas.createImage();
        img.onload = () => {
            ctx.save();
            const { sx, sy, sw, sh, tx, ty, tw, th } = img_metrics_1.default[el.mode]({
                sw: img.width,
                sh: img.height,
                tw: el.metrics.width,
                th: el.metrics.height,
            });
            clipRect(ctx, Object.assign(Object.assign({}, el.metrics), { radius: el.radius }));
            ctx.drawImage(img, sx, sy, sw, sh, el.metrics.left + tx, el.metrics.top + ty, tw, th);
            ctx.restore();
            resolve(true);
        };
        img.onerror = reject;
        img.src = el.src;
    });
};
exports.drawImage = drawImage;
const draw = (els, ctx, canvas) => {
    let p = Promise.resolve();
    els.forEach(el => {
        p = p.then(() => {
            switch (el.type) {
                case "color":
                    return (0, exports.drawColor)(el, ctx);
                case "image":
                    return (0, exports.drawImage)(el, ctx, canvas);
            }
        });
    });
    return p;
};
exports.draw = draw;
