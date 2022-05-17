import { fabric } from "fabric";
import { useCallback } from "react";

import { useCanvasContext } from "../hooks/useCanvasContext";

export function useUploadImageHandler() {
  const {
    containerElement,
    originalUrl,
    setOriginalUrl,
    setUrl,
    setBaseScale,
    setZoomRatio,
    reset,
  } = useCanvasContext();

  return useCallback(
    (imageUrl: string) => {
      if (!containerElement) return;

      fabric.Image.fromURL(imageUrl, (originalImage) => {
        const { height: originalHeight } = originalImage.getBoundingRect();

        const baseScale = getBaseScale(containerElement, originalHeight);

        if (!originalUrl) {
          setOriginalUrl(imageUrl);
        }
        setUrl(imageUrl);
        reset();
        setBaseScale(baseScale);
        setZoomRatio(baseScale);
      });
    },
    [
      containerElement,
      originalUrl,
      reset,
      setBaseScale,
      setOriginalUrl,
      setUrl,
      setZoomRatio,
    ]
  );
}

function getBaseScale(
  containerElement: HTMLDivElement,
  height: number
): number {
  const containerHeight = containerElement.clientHeight ?? height;
  const scale = Math.floor((containerHeight * 100) / height);
  if (scale) {
    return (scale - (scale % 10)) / 100;
  }
  return 1;
}
