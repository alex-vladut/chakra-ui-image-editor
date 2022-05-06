import { useContainerHandler } from "../handlers/useContainerHandler";
import { useZoomHandler } from "../handlers/useZoomHandler";
import { useEventHandlers } from "../handlers/useEventHandlers";

const Canvas = () => {
  const containerRef = useContainerHandler();

  useEventHandlers();
  useZoomHandler();

  return (
    <section ref={containerRef} className="canvas">
      <canvas id="canvas" />
    </section>
  );
};

export default Canvas;
