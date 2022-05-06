import { useCallback, useEffect } from "react";
import { isArrow, isCtrlShiftZ, isCtrlZ } from "../utils/keyboard";
import { useCanvasContext } from "../hooks/useCanvasContext";

export function useEventHandlers() {
  const { canvas, setActiveObject, activeObject, zoomIn, zoomOut } =
    useCanvasContext();

  /**
   * Canvas Mouse wheel handler
   */

  const onMouseWheel = useCallback(
    (event: fabric.IEvent) => {
      if (canvas) {
        const delta = (event.e as any).deltaY;
        if (delta > 0) {
          zoomOut();
        } else {
          zoomIn();
        }
      }
      event.e.preventDefault();
      event.e.stopPropagation();
    },
    [canvas, zoomIn, zoomOut]
  );

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:wheel", onMouseWheel);
    }
    return () => {
      if (canvas) {
        canvas.off("mouse:wheel", onMouseWheel as (e: fabric.IEvent) => void);
      }
    };
  }, [canvas, onMouseWheel]);

  /**
   * Canvas selection handlers
   */

  const onSelect = useCallback(
    ({ target }: fabric.IEvent) => {
      if (target) {
        if (canvas) {
          setActiveObject(canvas.getActiveObject());
        }
      } else {
        setActiveObject(null);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvas]
  );

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", onSelect);
      canvas.on("selection:cleared", onSelect);
      canvas.on("selection:updated", onSelect);
    }
    return () => {
      if (canvas) {
        canvas.off("selection:cleared", onSelect);
        canvas.off("selection:created", onSelect);
        canvas.off("selection:updated", onSelect);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  /**
   * Keyboard Events Handler
   */

  const undo = useCallback(() => {
    // @ts-ignore
    canvas?.undo();
  }, [canvas]);

  const redo = useCallback(() => {
    // @ts-ignore
    canvas?.redo();
  }, [canvas]);

  const moveUp = useCallback(() => {
    if (activeObject && canvas) {
      activeObject.top = (activeObject.top as number) - 2;
      activeObject.setCoords();
      canvas.requestRenderAll();
    }
  }, [activeObject, canvas]);

  const moveDown = useCallback(() => {
    if (activeObject && canvas) {
      activeObject.top = (activeObject.top as number) + 2;
      activeObject.setCoords();
      canvas.requestRenderAll();
    }
  }, [activeObject, canvas]);

  const moveRight = useCallback(() => {
    if (activeObject && canvas) {
      activeObject.left = (activeObject.left as number) + 2;
      activeObject.setCoords();
      canvas.requestRenderAll();
    }
  }, [activeObject, canvas]);

  const moveLeft = useCallback(() => {
    if (activeObject && canvas) {
      activeObject.left = (activeObject.left as number) - 2;
      activeObject.setCoords();
      canvas.requestRenderAll();
    }
  }, [activeObject, canvas]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      isCtrlZ(e) && undo();
      isCtrlShiftZ(e) && redo();
      if (isArrow(e)) {
        e.code === "ArrowLeft" && moveLeft();
        e.code === "ArrowRight" && moveRight();
        e.code === "ArrowDown" && moveDown();
        e.code === "ArrowUp" && moveUp();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [canvas, activeObject]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas, activeObject]);
}
