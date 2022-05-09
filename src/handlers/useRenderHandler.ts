import { useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

const IMAGE_OBJECT_NAME = "image";

export function useRenderHandler() {
  const { canvas, containerElement, url, zoomRatio } = useCanvasContext();

  useEffect(() => {
    if (!canvas || !containerElement || !url) return;

    canvas.clear();

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

    canvas.setWidth(width).setHeight(height);
    image.scaleToWidth(width);
    image.scaleToHeight(height);
    image.center();
    canvas.add(image);
    if (originalHeight * zoomRatio > containerHeight) {
      canvas.zoomToPoint(
        new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2),
        (originalHeight * zoomRatio) / containerHeight
      );
    }
  }, [canvas, containerElement, url, zoomRatio]);
}
