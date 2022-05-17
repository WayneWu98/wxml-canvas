export const parseColor = function (color, ctx, metrics) {
    if (/^#[0-9a-f]+/.test(color)) {
        return color;
    }
    return '';
};
export const parseSize = function (size, refSize) {
    if (/%$/.test(size)) {
        return (parseFloat(size) / 100) * (refSize !== null && refSize !== void 0 ? refSize : 1);
    }
    return parseFloat(size);
};
