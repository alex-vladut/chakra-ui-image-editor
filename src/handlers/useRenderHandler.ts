import { useEffect } from "react";
import { fabric } from "fabric";

import { useCanvasContext } from "../hooks/useCanvasContext";

const IMAGE_OBJECT_NAME = "image";

export function useRenderHandler() {
  const {
    canvas,
    width,
    height,
    url,
    actualZoomRatio,
    zoomRatio,
    angle,
    flipX,
    flipY,
    filters,
    objects,
    isRendering,
  } = useCanvasContext();

  useEffect(() => {
    if (!canvas || !url) return;

    // TODO: setting it to ignore adding the objects to history while rendering de to the event being triggered
    // but there should be a better solutio as this is really hacky
    isRendering.current = true;

    canvas.clear();

    const imageElement = new Image();
    imageElement.setAttribute("crossorigin", "anonymous");
    imageElement.src = url;

    const image = new fabric.Image(imageElement, {
      selectable: false,
      hoverCursor: "default",
      crossOrigin: "anonymous",
      flipX,
      flipY,
      name: IMAGE_OBJECT_NAME,
    });

    canvas.setWidth(width).setHeight(height);
    if (!angle) {
      // TODO: not sure how to best handle it, maybe best to return the image width and height from the context
      image.scaleToWidth(width);
      image.scaleToHeight(height);
    }

    const {
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
      sharpen,
    } = filters;

    image.filters?.push(
      new fabric.Image.filters.Brightness({ brightness }),
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
    if (sharpen) {
      image.filters?.push(
        new fabric.Image.filters.Convolute({
          matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
        })
      );
    }
    image.applyFilters();

    canvas.add(image);
    canvas.add(...objects);
    canvas.zoomToPoint(getCenter(canvas), actualZoomRatio);

    if (flipX) {
      canvas.forEachObject((obj) => {
        if (!canvas.width || obj.name === IMAGE_OBJECT_NAME) return;
        let { width } = obj.getBoundingRect();
        obj
          .set({
            // @ts-ignore
            // angle: parseFloat((obj.angle || 0) * -1),
            flipX,
            left: canvas.width - width - (obj.left || 0),
          })
          .setCoords();
      });
    }
    if (flipY) {
      canvas.forEachObject((obj) => {
        if (!canvas.height || obj.name === IMAGE_OBJECT_NAME) return;
        let { height } = obj.getBoundingRect();
        obj
          .set({
            // @ts-ignore
            // angle: parseFloat((obj.angle || 0) * -1),
            flipY,
            top: canvas.height - height - (obj.top || 0),
          })
          .setCoords();
      });
    }
    if (angle) {
      image.rotate(angle).setCoords();
    }
    image.center();

    isRendering.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    actualZoomRatio,
    angle,
    canvas,
    flipX,
    flipY,
    height,
    url,
    width,
    zoomRatio,
    filters,
    objects,
  ]);

  useEffect(() => {}, []);
}

function getCenter(canvas: fabric.Canvas) {
  return new fabric.Point(canvas.getWidth() / 2, canvas.getHeight() / 2);
}
