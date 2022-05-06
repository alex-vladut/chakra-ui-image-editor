import {
  FC,
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { fabric } from "fabric";

interface CanvasContext {
  zoomRatio: number;
  setZoomRatio: (value: number) => void;
  containerElement?: HTMLDivElement;
  setContainerElement: (containerElement: HTMLDivElement) => void;
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (object: fabric.Object | null) => void;
  zoomIn(): void;
  zoomOut(): void;
}

export const Context = createContext<CanvasContext | null>(null);

export const CanvasContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement>();
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);
  const [zoomRatio, setZoomRatio] = useState(1);

  const changeZoomRatio = useCallback((value: number) => {
    const roundedToStep = Math.round(value * 10) / 10;
    setZoomRatio(Math.min(Math.max(roundedToStep, 0.5), 2));
  }, []);

  const zoomIn = useCallback(() => {
    if (zoomRatio >= 2) return;
    changeZoomRatio(zoomRatio + 0.1);
  }, [changeZoomRatio, zoomRatio]);

  const zoomOut = useCallback(() => {
    if (zoomRatio <= 0.5) return;
    changeZoomRatio(zoomRatio - 0.1);
  }, [changeZoomRatio, zoomRatio]);

  const context = {
    canvas,
    setCanvas,
    containerElement,
    setContainerElement,
    activeObject,
    setActiveObject,
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
