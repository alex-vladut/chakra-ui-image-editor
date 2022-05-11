import { useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

const IMAGE_OBJECT_NAME = "image";

export function useRenderHandler() {
  const {
    canvas,
    containerElement,
    width,
    height,
    url,
    actualZoomRatio,
    zoomRatio,
    angle,
    flipX,
    flipY,
  } = useCanvasContext();

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

    canvas.setWidth(width).setHeight(height);
    if (!angle) {
      image.scaleToWidth(width);
      image.scaleToHeight(height);
    }
    canvas.add(image);
    canvas.zoomToPoint(getCenter(canvas), actualZoomRatio);

    if (flipX) {
      canvas.forEachObject((obj) => {
        if (!canvas.width) return;
        let { width } = obj.getBoundingRect();
        obj
          .set({
            // @ts-ignore
            // angle: parseFloat((obj.angle || 0) * -1),
            flipX: !obj.flipX,
            left: canvas.width - width - (obj.left || 0),
          })
          .setCoords();
      });
    }
    if (flipY) {
      canvas.forEachObject((obj) => {
        if (!canvas.height) return;
        let { height } = obj.getBoundingRect();
        obj
          .set({
            // @ts-ignore
            // angle: parseFloat((obj.angle || 0) * -1),
            flipY: !obj.flipY,
            top: canvas.height - height - (obj.top || 0),
          })
          .setCoords();
      });
    }
    if (angle) {
      image.rotate(angle).setCoords();
    }
    image.center();
  }, [
    actualZoomRatio,
    angle,
    canvas,
    containerElement,
    flipX,
    flipY,
    height,
    url,
    width,
    zoomRatio,
  ]);
}

function getCenter(canvas: fabric.Canvas) {
  return new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
}
