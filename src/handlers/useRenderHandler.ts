import { useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

const IMAGE_OBJECT_NAME = "image";

export function useRenderHandler() {
  const { canvas, imageElement, width, height, zoomRatio } = useCanvasContext();

  useEffect(() => {
    if (!canvas) return;

    if (imageElement) {
      canvas.clear();
      canvas.setWidth(width).setHeight(height);
      const image = new fabric.Image(imageElement);
      image.set({
        selectable: false,
        hoverCursor: "default",
        crossOrigin: "anonymous",
        // TODO: ste it once flip functionality is supported
        // flipX: this.canvas.flipX,
        // flipY: this.canvas.flipY,
        name: IMAGE_OBJECT_NAME,
      });
      image.scaleToWidth(width);
      image.scaleToHeight(height);
      canvas.add(image);
      //   canvas.setZoom(zoomRatio);
      canvas.zoomToPoint(
        new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2),
        zoomRatio
      );
    }
  }, [canvas, height, imageElement, width, zoomRatio]);
}
