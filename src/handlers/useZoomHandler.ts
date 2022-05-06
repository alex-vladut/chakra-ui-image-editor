import { fabric } from "fabric";
import { useEffect } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";

export function useZoomHandler() {
  const { canvas, zoomRatio } = useCanvasContext();

  useEffect(() => {
    if (!canvas) return;

    canvas.zoomToPoint(
      new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2),
      zoomRatio
    );
  }, [canvas, zoomRatio]);
}
