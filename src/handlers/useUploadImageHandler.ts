import { fabric } from "fabric";
import { useCallback } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";

export function useUploadImageHandler() {
  const { canvas, containerElement, setZoomRatio } = useCanvasContext();

  return useCallback(
    (imageUrl: string) => {
      if (!canvas) return;

      const imageElement = new Image();
      imageElement.src = imageUrl;
      fabric.Image.fromURL(imageUrl, () => {
        if (!containerElement) return;

        canvas.clear();
        const imgInstance = new fabric.Image(imageElement, {
          selectable: false,
          hoverCursor: "default",
          crossOrigin: "Anonymous",
        });

        canvas.add(imgInstance);
        imgInstance.center();

        setZoomRatio(containerElement.clientHeight / imageElement.height);
      });
    },
    [canvas, containerElement, setZoomRatio]
  );
}
