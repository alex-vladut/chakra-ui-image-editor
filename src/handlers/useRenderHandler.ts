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
    brightness,
    contrast,
    saturation,
    tintColor,
    tintOpacity,
    invert,
    hue,
    noise,
    blur,
    pixelate,
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
      // TODO: not sure how to best handle it, maybe best to return the image width and height from the context
      image.scaleToWidth(width);
      image.scaleToHeight(height);
    }

    image.filters?.push(
      new fabric.Image.filters.Brightness({ brightness: brightness }),
      new fabric.Image.filters.Contrast({ contrast }),
      new fabric.Image.filters.Saturation({ saturation }),
      new fabric.Image.filters.BlendColor({
        color: tintColor,
        mode: "tint",
        alpha: tintOpacity * 0.22,
      }),
      new fabric.Image.filters.BlendColor({
        color: "#fff",
        mode: "exclusion",
        alpha: invert,
      }),
      new (fabric.Image.filters as any).HueRotation({ rotation: hue }),
      new fabric.Image.filters.Noise({ noise }),
      new (fabric.Image.filters as any).Blur({ blur }),
      new fabric.Image.filters.Pixelate({ blocksize: pixelate })
    );
    image.applyFilters();

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
    brightness,
    contrast,
    saturation,
    tintColor,
    tintOpacity,
    invert,
    hue,
    noise,
    blur,
    pixelate,
  ]);
}

function getCenter(canvas: fabric.Canvas) {
  return new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
}
