import { fabric } from "fabric";
import { useCallback } from "react";

import { useCanvasContext } from "../hooks/useCanvasContext";

export function useUploadImageHandler() {
  const {
    containerElRef,
    originalUrl,
    setOriginalUrl,
    setUrl,
    setBaseScale,
    setZoomRatio,
    reset,
  } = useCanvasContext();

  return useCallback(
    (imageUrl: string) => {
      fabric.Image.fromURL(imageUrl, (originalImage) => {
        const { height: originalHeight } = originalImage.getBoundingRect();

        const baseScale = getBaseScale(
          containerElRef.current?.clientHeight,
          originalHeight
        );

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
      containerElRef,
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
  containerHeight: number | null | undefined,
  height: number
): number {
  const scale = Math.floor(((containerHeight ?? height) * 100) / height);
  if (scale) {
    return (scale - (scale % 10)) / 100;
  }
  return 1;
}
