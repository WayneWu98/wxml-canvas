type ImageMetrics = {
  sw: number;
  sh: number;
  tw: number;
  th: number;
};

export const scaleToFill = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const aspectFit = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const aspectFill = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const widthFix = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const heightFix = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const top = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const bottom = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const center = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const left = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const right = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const topLeft = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const topRight = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const bottomLeft = function ({ sw, sh, tw, th }: ImageMetrics) {
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

export const bottomRight = function ({ sw, sh, tw, th }: ImageMetrics) {
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
  [IMAGE_MODE.SCALE_TO_FILL]: scaleToFill,
  [IMAGE_MODE.ASPECT_FIT]: aspectFit,
  [IMAGE_MODE.ASPECT_FILL]: aspectFill,
  [IMAGE_MODE.WIDTH_FIX]: widthFix,
  [IMAGE_MODE.HEIGHT_FIX]: heightFix,
  [IMAGE_MODE.TOP]: top,
  [IMAGE_MODE.BOTTOM]: bottom,
  [IMAGE_MODE.CENTER]: center,
  [IMAGE_MODE.LEFT]: left,
  [IMAGE_MODE.RIGHT]: right,
  [IMAGE_MODE.TOP_LEFT]: topLeft,
  [IMAGE_MODE.TOP_RIGHT]: topRight,
  [IMAGE_MODE.BOTTOM_LEFT]: bottomLeft,
  [IMAGE_MODE.BOTTOM_RIGHT]: bottomRight,
};
