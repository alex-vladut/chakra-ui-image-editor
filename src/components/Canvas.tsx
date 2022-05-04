import { Tooltip } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useImageEditorContext } from "../hooks/useImageEditorContext";
import { Minus, Plus } from "../icons";

const Canvas = () => {
  const { imageUrl, scale, zoomIn, zoomOut, setCanvasElement } =
    useImageEditorContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEl = canvasRef.current;

  const onWheelHandler = (event: WheelEvent) => {
    event.preventDefault();
    if (!imageUrl) {
      return;
    }
    if (event.deltaY > 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  useEffect(() => {
    if (!canvasEl) return;

    setCanvasElement(canvasEl);
    canvasEl.addEventListener("wheel", onWheelHandler);
    if (imageUrl) {
      drawImage(imageUrl, canvasEl, scale);
    }

    return () => {
      canvasEl.removeEventListener("wheel", onWheelHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEl, imageUrl, scale]);

  return (
    <section className="canvas custom-scrollbar">
      <canvas ref={canvasRef}></canvas>
      {imageUrl && (
        <div className="zoom">
          <button className="zoom-in" onClick={zoomIn}>
            <Tooltip label="Zoom In" placement="top">
              <Plus />
            </Tooltip>
          </button>
          <p>{`${Math.floor(scale * 100)}%`}</p>
          <button className="zoom-out" onClick={zoomOut}>
            <Tooltip label="Zoom Out" placement="top">
              <Minus />
            </Tooltip>
          </button>
        </div>
      )}
    </section>
  );
};

function drawImage(
  imageUrl: string,
  canvasEl: HTMLCanvasElement,
  scale: number
) {
  const img = new Image();
  img.setAttribute("crossorigin", "anonymous");
  const ctx = canvasEl.getContext("2d");
  if (imageUrl && ctx) {
    const parent = canvasEl.parentNode as HTMLElement;
    img.addEventListener(
      "load",
      () => {
        const { width, height } = getImageSize(img, scale);
        const isInCenter = isScrollbarInCenter(
          parent.scrollTop,
          canvasEl.offsetHeight
        );

        canvasEl.width = width;
        canvasEl.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        if (isInCenter) {
          const shift = canvasEl.offsetHeight / 2 - window.innerHeight / 2;
          parent.scrollTo(0, shift);
        }
      },
      false
    );
  }
  img.src = imageUrl;
}

function isScrollbarInCenter(scrollTop: number, containerHeight: number) {
  const currentPosition = Math.floor(scrollTop);
  const scrollbarCenterPosition = Math.floor(
    Math.max(containerHeight / 2 - window.innerHeight / 2, 0)
  );
  return scrollbarCenterPosition === currentPosition;
}

function getImageSize(img: HTMLImageElement, scale: number) {
  const containerHeight = 0.85 * window.innerHeight * scale;
  const ratio = img.width / img.height;
  const height = Math.min(containerHeight / ratio, containerHeight);
  const width = ratio * height;
  return { width, height };
}

export default Canvas;
