type InstanceContext =
  | WechatMiniprogram.Page.Instance<any, any>
  | WechatMiniprogram.Component.Instance<any, any, any>;

type BorderRadius = [number, number, number, number];
type Color = string;
type Size = number;
type Metrics = {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

enum IMAGE_MODE {
  SCALE_TO_FILL = 'scaleToFill',
  ASPECT_FILL = 'aspectFill',
  ASPECT_FIT = 'aspectFit',
  WIDTH_FIX = 'widthFix',
  HEIGHT_FIX = 'heightFix',
  TOP = 'top',
  BOTTOM = 'bottom',
  CENTER = 'center',
  LEFT = 'left',
  RIGHT = 'right',
  TOP_LEFT = 'top left',
  TOP_RIGHT = 'top right',
  BOTTOM_LEFT = 'bottom left',
  BOTTOM_RIGHT = 'bottom right',
}

const enum ELEMENT_TYPE {
  COLOR = 'color',
  IMAGE = 'image',
  TEXT = 'text',
  BORDER = 'border',
}

interface IElement {
  type: ELEMENT_TYPE;
  metrics: Metrics;
}

interface Style {
  backgroundColor?: string;
  color?: string;
  borderWidth?: string;
  borderColor?: string;
  borderRadius?: string;
  backgroundPosition?: string;
  backgroundSize?: 'cover' | 'contain';
  backgroundImage?: string;
  font?: string;
}

type StyleName = keyof Style;

interface IElementColor extends IElement {
  type: ELEMENT_TYPE.COLOR;
  color: string | WechatMiniprogram.CanvasGradient;
  radius: number;
}

interface IElementImage extends IElement {
  type: ELEMENT_TYPE.IMAGE;
  src: string;
  radius: BorderRadius;
  mode: IMAGE_MODE;
}

interface IElementText extends IElement {
  type: ELEMENT_TYPE.TEXT;
  font: string;
  text: string;
  maxLines: number;
  endian?: string;
  lineHeight: number;
  color: string;
}

interface IElementBorder extends IElement {
  type: ELEMENT_TYPE.BORDER;
  color: string;
  width: number;
  radius: BorderRadius;
}
