import { fabric } from "fabric";
import { useCallback } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";

export function useUploadImageHandler() {
  const {
    containerElement,
    setOriginalUrl,
    setUrl,
    setWidth,
    setHeight,
    setBaseScale,
    setZoomRatio,
  } = useCanvasContext();

  return useCallback(
    (imageUrl: string) => {
      if (!containerElement) return;

      const imageElement = new Image();
      imageElement.setAttribute("crossorigin", "anonymous");
      imageElement.src = imageUrl;

      fabric.Image.fromURL(imageUrl, (originalImage) => {
        const { width: originalWidth, height: originalHeight } =
          originalImage.getBoundingRect();
        const containerHeight = containerElement.clientHeight;
        const containerWidth = containerElement.clientWidth;
        const ratio = originalWidth / originalHeight;

        let height = containerHeight;
        let width = ratio * height;
        if (width > containerWidth) {
          width = containerWidth;
          height = width / ratio;
        }
        const baseScale = getBaseScale(containerElement, height);
        setWidth(width);
        setHeight(height);
        setOriginalUrl(imageUrl);
        setUrl(imageUrl);

        setBaseScale(baseScale);
        setZoomRatio(baseScale);
      });
    },
    [
      containerElement,
      setBaseScale,
      setHeight,
      setOriginalUrl,
      setUrl,
      setWidth,
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
