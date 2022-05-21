import { useEffect, useRef } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

export function useContainerHandler() {
  const canvasRef = useRef<fabric.Canvas>();
  const { setCanvas, containerElRef } = useCanvasContext();

  useEffect(() => {
    if (canvasRef.current) return;

    // prevent canvas from being instantiated twice due to React 18 useEffect behaviour
    canvasRef.current = new fabric.Canvas("canvas", {
      selection: false,
      preserveObjectStacking: true,
    });
    setCanvas(canvasRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerElRef;
}
