import { createRef, useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

export function useContainerHandler() {
  const containerRef = createRef<HTMLDivElement>();
  const { canvas, setCanvas, setContainerElement } = useCanvasContext();

  useEffect(() => {
    if (!containerRef?.current) return;

    const initialHeigh = containerRef.current.clientHeight;
    const initialWidth = containerRef.current.clientWidth;

    const canvas = new fabric.Canvas("canvas", {
      height: initialHeigh,
      width: initialWidth,
    });

    setCanvas(canvas);
    setContainerElement(containerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!containerRef?.current || !canvas) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    canvas.setHeight(height).setWidth(width);
    canvas.renderAll();
  }, [canvas]); // eslint-disable-line react-hooks/exhaustive-deps

  return containerRef;
}
