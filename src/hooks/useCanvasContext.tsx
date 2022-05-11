import {
  FC,
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { fabric } from "fabric";

export type Mode =
  | "search"
  | "crop"
  | "adjust"
  | "drawing"
  | "text"
  | "effects";

const SCALE_STEP: number = 0.1;
const SCALE_MAX_VALUE: number = 3;
const SCALE_MIN_VALUE: number = 0.5;
const SCALE_DEFAULT_VALUE: number = 1;
const ANGLE_STEP: number = 90;

interface CanvasContext {
  mode: Mode | null;
  setMode: (mode: Mode | null) => void;
  baseScale: number;
  setBaseScale: (baseScale: number) => void;
  actualZoomRatio: number;
  zoomRatio: number;
  setZoomRatio: (value: number) => void;
  originalUrl: string | null;
  setOriginalUrl: (originalUrl: string) => void;
  url: string | null;
  setUrl: (url: string) => void;
  width: number;
  height: number;
  containerElement: HTMLDivElement | null;
  setContainerElement: (containerElement: HTMLDivElement) => void;
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (object: fabric.Object | null) => void;
  zoomIn(): void;
  zoomOut(): void;

  angle: number;
  setAngle: (angle: number) => void;
  rotate: (angle: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  flipX: boolean;
  toggleFlipX: () => void;
  flipY: boolean;
  toggleFlipY: () => void;

  brightness: number;
  setBrightness: (brightness: number) => void;
  contrast: number;
  setContrast: (contrast: number) => void;
  saturation: number;
  setSaturation: (saturation: number) => void;
  tintColor: string;
  setTintColor: (tintColor: string) => void;
  tintOpacity: number;
  setTintOpacity: (tintOpacity: number) => void;
  invert: number;
  setInvert: (invert: number) => void;
  hue: number;
  setHue: (hue: number) => void;
  noise: number;
  setNoise: (noise: number) => void;
  blur: number;
  setBlur: (blur: number) => void;
  pixelate: number;
  setPixelate: (pixelate: number) => void;
  resetFilters: () => void;

  reset: () => void;
}

export const Context = createContext<CanvasContext | null>(null);

export const CanvasContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  const [baseScale, setBaseScale] = useState(SCALE_DEFAULT_VALUE);
  const [zoomRatio, setZoomRatio] = useState(SCALE_DEFAULT_VALUE);

  const [angle, setAngle] = useState(0);
  const [angleDifference, setAngleDifference] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(0);
  const [tintColor, setTintColor] = useState("#000000");
  const [tintOpacity, setTintOpacity] = useState(0);
  const [invert, setInvert] = useState(0);
  const [hue, setHue] = useState(0);
  const [noise, setNoise] = useState(0);
  const [blur, setBlur] = useState(0);
  const [pixelate, setPixelate] = useState(1);

  const changeZoomRatio = useCallback((value: number) => {
    const roundedToStep =
      Math.round(value * SCALE_STEP * 100) / (SCALE_STEP * 100);
    setZoomRatio(
      Math.min(Math.max(roundedToStep, SCALE_MIN_VALUE), SCALE_MAX_VALUE)
    );
  }, []);

  const zoomIn = useCallback(() => {
    if (zoomRatio >= SCALE_MAX_VALUE) return;
    changeZoomRatio(zoomRatio + SCALE_STEP);
  }, [changeZoomRatio, zoomRatio]);

  const zoomOut = useCallback(() => {
    if (zoomRatio <= SCALE_MIN_VALUE) return;
    changeZoomRatio(zoomRatio - SCALE_STEP);
  }, [changeZoomRatio, zoomRatio]);

  const { width, height, actualZoomRatio } = useMemo(() => {
    if (!url || !containerElement) {
      return { width: 0, height: 0, actualZoomRatio: 1 };
    }

    const imageElement = new Image();
    imageElement.setAttribute("crossorigin", "anonymous");
    imageElement.src = url;
    const image = new fabric.Image(imageElement, {
      selectable: false,
      hoverCursor: "default",
      crossOrigin: "anonymous",
    });
    image.rotate(angle).setCoords();
    const { width: originalWidth, height: originalHeight } =
      image.getBoundingRect();

    const containerHeight = containerElement.clientHeight;
    const ratio = originalWidth / originalHeight;
    let height = originalHeight * zoomRatio;
    let width = originalWidth * zoomRatio;
    if (height > containerHeight) {
      height = containerHeight;
      width = height * ratio;
    }

    return {
      width,
      height,
      actualZoomRatio:
        !angle && originalHeight * zoomRatio > containerHeight
          ? (originalHeight * zoomRatio) / containerHeight
          : 1,
    };
  }, [angle, containerElement, url, zoomRatio]);

  const rotate = useCallback(
    (value: number) => {
      setAngleDifference(value - angle);
      setAngle(value);
    },
    [angle]
  );

  const rotateRight = useCallback(() => {
    let result = angle + ANGLE_STEP;
    if (result > 360) {
      result -= 360;
    }
    rotate(result);
  }, [angle, rotate]);

  const rotateLeft = useCallback(() => {
    let result = angle - ANGLE_STEP;
    if (result < -360) {
      result += 360;
    }
    rotate(result);
  }, [angle, rotate]);

  const toggleFlipX = useCallback(() => {
    setFlipX(!flipX);
  }, [flipX]);

  const toggleFlipY = useCallback(() => {
    setFlipY(!flipY);
  }, [flipY]);

  const resetFilters = useCallback(() => {
    setBrightness(0);
    setContrast(0);
    setSaturation(0);
    setTintColor("#000000");
    setTintOpacity(0);
    setInvert(0);
    setHue(0);
    setNoise(0);
    setBlur(0);
    setPixelate(1);
  }, []);

  const reset = useCallback(() => {
    setBaseScale(SCALE_DEFAULT_VALUE);
    setZoomRatio(SCALE_DEFAULT_VALUE);
    setAngle(0);
    setFlipX(false);
    setFlipY(false);
    resetFilters();
  }, [resetFilters]);

  const context = {
    mode,
    setMode,
    originalUrl,
    setOriginalUrl,
    url,
    setUrl,
    width,
    height,
    // TODO: maybe it is not necessary to store a reference to the canvas
    canvas,
    setCanvas,
    containerElement,
    setContainerElement,
    activeObject,
    setActiveObject,
    baseScale,
    setBaseScale,
    actualZoomRatio,
    zoomRatio,
    setZoomRatio: changeZoomRatio,
    zoomIn,
    zoomOut,
    angle,
    setAngle,
    rotate,
    rotateLeft,
    rotateRight,
    flipX,
    toggleFlipX,
    flipY,
    toggleFlipY,

    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    tintColor,
    setTintColor,
    tintOpacity,
    setTintOpacity,
    invert,
    setInvert,
    hue,
    setHue,
    noise,
    setNoise,
    blur,
    setBlur,
    pixelate,
    setPixelate,
    resetFilters,

    reset,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export function useCanvasContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Cannot access useCanvasContext() outside of <CanvasProvider />"
    );
  }
  return context;
}
