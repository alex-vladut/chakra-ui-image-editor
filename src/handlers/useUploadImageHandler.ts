import { fabric } from "fabric";
import { useCallback } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";

export function useUploadImageHandler() {
  const {
    containerElement,
    imageElement,
    zoomRatio,
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

      setOriginalUrl(imageUrl);
      setUrl(imageUrl);
      imageElement.src = imageUrl;
      fabric.Image.fromURL(imageUrl, () => {
        // set rotationAngle once supported
        const { width, height } = getSize(
          zoomRatio,
          0,
          containerElement,
          imageElement
        );
        setWidth(width);
        setHeight(height);
        const baseScale = getBaseScale(containerElement, height);
        setBaseScale(baseScale);
        setZoomRatio(baseScale);
      });
    },
    [
      containerElement,
      imageElement,
      setBaseScale,
      setHeight,
      setOriginalUrl,
      setUrl,
      setWidth,
      setZoomRatio,
      zoomRatio,
    ]
  );
}

function getSize(
  scale: number,
  rotationAngle: number,
  containerElement: HTMLDivElement,
  imageElement: HTMLImageElement
) {
  const { width: originalWidth, height: originalHeight } = getOriginalSize(
    imageElement,
    rotationAngle
  );

  const containerHeight = containerElement.clientHeight * scale;
  const ratio = originalWidth / originalHeight;
  const height = Math.min(containerHeight / ratio, containerHeight);
  const width = ratio * height;
  return { width, height };
}

function getOriginalSize(
  imageElement: HTMLImageElement,
  rotationAngle: number
) {
  const originalImage = new fabric.Image(imageElement);
  // originalImage.rotate(canvas.angle).setCoords();
  originalImage.rotate(rotationAngle).setCoords();
  const { width, height } = originalImage.getBoundingRect();
  return { width, height };
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
