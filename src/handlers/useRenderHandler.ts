import { useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

const IMAGE_OBJECT_NAME = "image";

export function useRenderHandler() {
  const { canvas, url, width, height, zoomRatio } = useCanvasContext();

  useEffect(() => {
    if (!canvas) return;

    if (url) {
      canvas.clear();
      canvas.setWidth(width ).setHeight(height);
      const imageElement = new Image();
      imageElement.setAttribute("crossorigin", "anonymous");
      imageElement.src = url;

      const image = new fabric.Image(imageElement, {
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
      image.center();
      canvas.add(image);
      canvas.zoomToPoint(
        new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2),
        zoomRatio
      );
    }
  }, [canvas, height, url, width, zoomRatio]);
}
