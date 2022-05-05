import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import CanvasAPI from "../helpers/CanvasAPI";
import { useImageEditorContext } from "../hooks/useImageEditorContext";
import { useCropperContext } from "../hooks/useCropperContext";

const Canvas = () => {
  const { imageUrl, scale, mode, setCanvasElement, zoomIn, zoomOut } =
    useImageEditorContext();
  const { setWidthIndicator, setHeightIndicator } = useCropperContext();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasEl = canvasRef.current;

  const onWheel = (event: any) => {
    event.preventDefault();
    if (!imageUrl || mode) {
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

    const fabricCanvas = new fabric.Canvas(canvasEl);
    const canvasAPI = new CanvasAPI(
      fabricCanvas,
      setWidthIndicator,
      setHeightIndicator
    );
    const canvas = canvasEl?.parentElement?.querySelector(".upper-canvas");
    setCanvasElement(canvasEl);
    canvas && canvas.addEventListener("wheel", onWheel);
    if (imageUrl && mode) {
      canvasAPI.renderImage(imageUrl, scale, mode);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvasEl, imageUrl, scale, mode]);

  return (
    <section className="canvas">
      <canvas ref={canvasRef}></canvas>
    </section>
  );
};

export default Canvas;
