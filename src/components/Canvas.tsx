import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import CanvasAPI from "../helpers/CanvasAPI";
import { useImageEditorContext } from "../hooks/useImageEditorContext";

const Canvas = () => {
  const { imageUrl, scale, setCanvasElement } = useImageEditorContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEl = canvasRef.current;

  useEffect(() => {
    if (!canvasEl) return;

    let fabricCanvas = new fabric.Canvas(canvasEl);
    const canvas = new CanvasAPI(fabricCanvas);
    setCanvasElement(canvasEl);
    if (imageUrl) {
      canvas.renderImage(imageUrl, scale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEl, imageUrl, scale]);

  return (
    <section className="canvas">
      <canvas ref={canvasRef}></canvas>
    </section>
  );
};

export default Canvas;
