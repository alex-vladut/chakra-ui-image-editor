import { useContainerHandler } from "../handlers/useContainerHandler";
import { useZoomHandler } from "../handlers/useZoomHandler";

const Canvas = () => {
  const containerRef = useContainerHandler();

  useZoomHandler();

  return (
    <section ref={containerRef} className="canvas">
      <canvas id="canvas" />
    </section>
  );
};

export default Canvas;
