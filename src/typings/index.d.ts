type InstanceContext =
  | WechatMiniprogram.Page.Instance<any, any>
  | WechatMiniprogram.Component.Instance<any, any, any>;

type Metrics = {
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
};

const enum IMAGE_MODE {
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
  backgroundColor: string;
  color: string;
  borderRadius: string;
  backgroundPosition: string;
  backgroundSize: string;
  backgroundImage: string;
  font: string;
  textAlign: string;
  lineHeight: string;
}

type StyleName = keyof Style;

interface IColorElement extends IElement {
  type: ELEMENT_TYPE.COLOR;
  color: string | WechatMiniprogram.CanvasGradient;
  radius: number;
}

interface IImageElement extends IElement {
  type: ELEMENT_TYPE.IMAGE;
  src: string;
  radius: number;
  mode: IMAGE_MODE;
}

interface ITextElement extends IElement {
  type: ELEMENT_TYPE.TEXT;
  font: string;
  text: string;
  maxLines: number;
  endian?: string;
  lineHeight: number;
  color: string;
}
