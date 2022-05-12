import { useContainerHandler } from "../handlers/useContainerHandler";
import { useEventHandlers } from "../handlers/useEventHandlers";
import { useRenderHandler } from "../handlers/useRenderHandler";
import { useCanvasContext } from "../hooks/useCanvasContext";

const Canvas = () => {
  const containerRef = useContainerHandler();
  const { mode } = useCanvasContext();

  useEventHandlers();
  useRenderHandler();

  return (
    <section
      ref={containerRef}
      className={`canvas custom-scrollbar ${mode ? "canvas_toolbar-open" : ""}`}
    >
      <canvas id="canvas" />
    </section>
  );
};

export default Canvas;
