import { createRef, useEffect, useRef } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

export function useContainerHandler() {
  const containerRef = createRef<HTMLDivElement>();
  const canvasRef = useRef<fabric.Canvas>();
  const { setCanvas, setContainerElement } = useCanvasContext();

  useEffect(() => {
    if (!containerRef.current || canvasRef.current) return;

    // prevent canvas from being instantiated twice due to React 18 useEffect behaviour
    canvasRef.current = new fabric.Canvas("canvas", {
      selection: false,
      preserveObjectStacking: true,
    });
    setCanvas(canvasRef.current);
    setContainerElement(containerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return containerRef;
}
