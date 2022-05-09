import { useContainerHandler } from "../handlers/useContainerHandler";
import { useEventHandlers } from "../handlers/useEventHandlers";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { useRenderHandler } from "../handlers/useRenderHandler";

const Canvas = () => {
  const { isOpen } = useToolbarContext();
  const containerRef = useContainerHandler();

  useEventHandlers();
  useRenderHandler();

  return (
    <section
      ref={containerRef}
      className={`canvas custom-scrollbar ${
        isOpen ? "canvas_toolbar-open" : ""
      }`}
    >
      <canvas id="canvas" />
    </section>
  );
};

export default Canvas;
