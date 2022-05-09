import {
  FC,
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { fabric } from "fabric";

const SCALE_STEP: number = 0.1;
const SCALE_MAX_VALUE: number = 2;
const SCALE_MIN_VALUE: number = 0.5;
const SCALE_DEFAULT_VALUE: number = 1;

interface CanvasContext {
  baseScale: number;
  setBaseScale: (baseScale: number) => void;
  zoomRatio: number;
  setZoomRatio: (value: number) => void;
  originalUrl: string | null;
  setOriginalUrl: (originalUrl: string) => void;
  url: string | null;
  setUrl: (url: string) => void;
  imageElement: HTMLImageElement;
  image: fabric.Image | null;
  setImage: (image: fabric.Image) => void;
  width: number;
  setWidth: (width: number) => void;
  height: number;
  setHeight: (height: number) => void;
  containerElement: HTMLDivElement | null;
  setContainerElement: (containerElement: HTMLDivElement) => void;
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (object: fabric.Object | null) => void;
  zoomIn(): void;
  zoomOut(): void;
}

export const Context = createContext<CanvasContext | null>(null);

const imageElement = createImageElement();

export const CanvasContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [image, setImage] = useState<fabric.Image | null>(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  const [baseScale, setBaseScale] = useState(SCALE_DEFAULT_VALUE);
  const [zoomRatio, setZoomRatio] = useState(SCALE_DEFAULT_VALUE);

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

  const context = {
    originalUrl,
    setOriginalUrl,
    url,
    setUrl,
    imageElement,
    image,
    setImage,
    width,
    setWidth,
    height,
    setHeight,
    // TODO: maybe it is not necessary to store a reference to the canvas
    canvas,
    setCanvas,
    containerElement,
    setContainerElement,
    activeObject,
    setActiveObject,
    baseScale,
    setBaseScale,
    zoomRatio,
    setZoomRatio: changeZoomRatio,
    zoomIn,
    zoomOut,
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

function createImageElement() {
  const image = new Image();
  image.setAttribute("crossorigin", "anonymous");
  return image;
}
