import { createRef, useEffect, useRef } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";
import { useDimensions } from "@chakra-ui/react";

export function useContainerHandler() {
  const containerRef = createRef<HTMLDivElement>();
  const canvasRef = useRef<fabric.Canvas>();
  const { setCanvas, setContainerElement } = useCanvasContext();
  const dimensions = useDimensions(containerRef, true);

  useEffect(() => {
    if (!containerRef.current || canvasRef.current) return;

    const initialHeigh = containerRef.current.clientHeight;
    const initialWidth = containerRef.current.clientWidth;

    // prevent canvas from being instantiated twice due to React 18 useEffect behaviour
    canvasRef.current = new fabric.Canvas("canvas", {
      height: initialHeigh,
      width: initialWidth,
    });
    setCanvas(canvasRef.current);
    setContainerElement(containerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!dimensions || !canvasRef.current) return;

    canvasRef.current
      .setWidth(dimensions.contentBox.width)
      .setHeight(dimensions.contentBox.height)
      .renderAll();
  }, [dimensions]);

  return containerRef;
}
