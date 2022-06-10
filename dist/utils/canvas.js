import ImgMetrics from './img-metrics';
function createRectPath(ctx, metrics, radius = 0) {
    const { left, top, right, bottom, width, height } = metrics;
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
        ctx.arc(newLeft, newTop, radius, Math.PI, (Math.PI * 3) / 2);
    }
    else {
        ctx.rect(left, top, width, height);
    }
}
function mesureText(ctx, text, font) {
    ctx.save();
    font && (ctx.font = font);
    const metrics = ctx.measureText(text);
    ctx.restore();
    return metrics;
}
function clipRect(ctx, { metrics, radius }, outer = false, containerSize) {
    ctx.beginPath();
    createRectPath(ctx, metrics, radius);
    if (outer && containerSize?.length) {
        ctx.moveTo(0, 0);
        ctx.lineTo(0, containerSize[1]);
        ctx.lineTo(containerSize[0], containerSize[1]);
        ctx.lineTo(containerSize[0], 0);
        ctx.lineTo(0, 0);
    }
    ctx.closePath();
    ctx.clip();
}
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
    clipRect(ctx, { metrics, radius });
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
    return Promise.resolve();
};
const drawText = function (el, ctx) {
    const { metrics, text, lineHeight, textAlign, font, opacity, color, endian, shadow, } = el;
    const textArray = text.split('');
    ctx.save();
    clipRect(ctx, { metrics });
    ctx.globalAlpha = opacity;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = textAlign;
    ctx.textBaseline = 'middle';
    const nLine = Math.round(metrics.height / lineHeight);
    const textList = [textArray.shift() ?? ''];
    while (textArray.length) {
        const w = textArray.shift();
        const str = textList?.[textList.length - 1] ?? '';
        if (textList.length >= nLine &&
            endian === "ellipsis" &&
            mesureText(ctx, str + w).width > metrics.width) {
            let lastLine = str;
            while (lastLine) {
                if (mesureText(ctx, lastLine + '...').width <= metrics.width) {
                    textList[textList.length - 1] = lastLine + '...';
                    break;
                }
                lastLine = lastLine.slice(0, -1);
            }
            break;
        }
        if (mesureText(ctx, str + w, font).width > metrics.width) {
            textList.push(w);
        }
        else {
            textList.splice(textList.length - 1, 1, str + w);
        }
    }
    if (shadow) {
        ctx.shadowBlur = shadow.blur;
        ctx.shadowColor = shadow.color;
        ctx.shadowOffsetX = shadow.offsetX;
        ctx.shadowOffsetY = shadow.offsetY;
    }
    let left = metrics.left;
    if (textAlign === 'center') {
        left += metrics.width / 2;
    }
    else if (textAlign === 'right' || textAlign === 'end') {
        left += metrics.width;
    }
    let top = metrics.top + lineHeight / 2;
    textList.forEach(text => {
        ctx.fillText(text, left, top);
        top += lineHeight;
    });
    ctx.restore();
};
const drawImage = function (el, ctx, canvas) {
    return new Promise((resolve, reject) => {
        const img = canvas.createImage();
        img.onload = () => {
            ctx.save();
            ctx.globalAlpha = el.opacity;
            const { sx, sy, sw, sh, tx, ty, tw, th } = ImgMetrics[el.mode]({
                sw: img.width,
                sh: img.height,
                tw: el.metrics.width,
                th: el.metrics.height,
            });
            clipRect(ctx, { metrics: el.metrics, radius: el.radius });
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
    clipRect(ctx, { metrics: outerMetrics, radius });
    const newLeft = metrics.left + radius;
    const newRight = metrics.right - radius;
    const newTop = metrics.top + radius;
    const newBottom = metrics.bottom - radius;
    drawLine(ctx, [
        radius ? newLeft : outerMetrics.left,
        metrics.top,
        radius ? newRight : outerMetrics.right,
        metrics.top,
    ], {
        lineWidth: width[0],
        color: color[0],
        opacity: 1,
    });
    drawLine(ctx, [
        metrics.right,
        radius ? newTop : outerMetrics.top,
        metrics.right,
        radius ? newBottom : outerMetrics.bottom,
    ], {
        lineWidth: width[1],
        color: color[1],
        opacity: 1,
    });
    drawLine(ctx, [
        radius ? newLeft : outerMetrics.left,
        metrics.bottom,
        radius ? newRight : outerMetrics.right,
        metrics.bottom,
    ], {
        lineWidth: width[2],
        color: color[2],
        opacity: 1,
    });
    drawLine(ctx, [
        metrics.left,
        radius ? newTop : outerMetrics.top,
        metrics.left,
        radius ? newBottom : outerMetrics.bottom,
    ], {
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
    ctx.restore();
    return Promise.resolve();
};
const drawShadow = function (el, ctx, containerSize) {
    ctx.save();
    ctx.shadowColor = el.color;
    ctx.shadowBlur = el.blur;
    ctx.shadowOffsetX = el.offsetX;
    ctx.shadowOffsetY = el.offsetY;
    clipRect(ctx, { metrics: el.metrics, radius: el.radius }, true, containerSize);
    ctx.beginPath();
    createRectPath(ctx, el.metrics, el.radius);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
};
export const draw = (els, ctx, canvas, instance) => {
    let p = Promise.resolve();
    els.forEach(el => {
        p = p.then(() => {
            if (instance.isAborted) {
                instance.abortResolve();
                throw new Error('Aborted');
            }
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
                case "shadow":
                    return drawShadow(el, ctx, [
                        canvas.width,
                        canvas.height,
                    ]);
                case "text":
                    return drawText(el, ctx);
            }
        });
    });
    return p;
};
