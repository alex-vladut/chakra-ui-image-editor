import { useEffect, useRef } from "react";
import { useImageEditorContext } from "../hooks/useImageEditorContext";

const Canvas = () => {
  const { imageUrl, canvasElement, setCanvasElement } = useImageEditorContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEl = canvasRef.current;

  useEffect(() => {
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (imageUrl) {
      drawImage(imageUrl, ctx, canvasEl);
    }
    if (!canvasElement) {
      setCanvasElement(canvasEl);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageUrl]);

  return (
    <section className="canvas">
      <canvas
        ref={canvasRef}
        width={`${0.4 * window.innerWidth || 500}`}
        height={`${0.9 * window.innerHeight || 500}`}
      ></canvas>
    </section>
  );
};

function drawImage(
  imageUrl: string,
  ctx: CanvasRenderingContext2D | null,
  canvasEl: HTMLCanvasElement
) {
  const img = new Image();
  img.setAttribute("crossorigin", "anonymous");
  if (imageUrl && ctx) {
    const canvasWidth = canvasEl.offsetWidth;
    const canvasHeight = canvasEl.offsetHeight;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    img.addEventListener(
      "load",
      () => {
        const { width, height } = getImageSize(img, canvasHeight);
        ctx.drawImage(
          img,
          canvasWidth / 2 - width / 2,
          canvasHeight / 2 - height / 2,
          width,
          height
        );
      },
      false
    );
  }
  img.src = imageUrl;
}

function getImageSize(img: HTMLImageElement, containerHeight: number) {
  const ratio = img.width / img.height;
  const height = Math.min(containerHeight / ratio, containerHeight);
  const width = ratio * height;
  return { width, height };
}

export default Canvas;
