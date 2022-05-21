import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Mode, useCanvasContext } from "../hooks/useCanvasContext";

const SELECTABLE_OBJECTS: Mode[] = ["drawing"];

export function useDrawingHandler() {
  const {
    mode,
    lineColor,
    lineOpacity,
    lineWidth,
    isLineStraight,
    canvas,
    isRendering,
    pushToHistory,
  } = useCanvasContext();
  const [selected, setSelected] = useState<fabric.Object | null>(null);
  const line = useRef<fabric.Line | null>(null);

  const onMouseMove = useCallback(
    (event: fabric.IEvent) => {
      if (!line.current || !canvas) {
        return;
      }
      const pointer = canvas.getPointer(event.e);
      line.current.set({
        x2: pointer.x,
        y2: pointer.y,
      });

      line.current.setCoords();
      canvas.renderAll();
    },
    [canvas, line]
  );

  const onMouseUp = useCallback(() => {
    if (!canvas) return;
    line.current = null;

    canvas.off("mouse:move", onMouseMove);
    canvas.off("mouse:up", onMouseUp);
  }, [canvas, onMouseMove]);

  const onMouseDown = useCallback(
    (event: fabric.IEvent) => {
      if (!canvas) return;
      const pointer = canvas.getPointer(event.e);

      line.current = new fabric.Line(
        [pointer.x, pointer.y, pointer.x, pointer.y],
        {
          stroke: `rgba(${lineColor}, ${lineOpacity})`,
          strokeWidth: lineWidth,
          evented: false,
        }
      );
      canvas.add(line.current);
      canvas.on("mouse:move", onMouseMove);
      canvas.on("mouse:up", onMouseUp);
    },
    [canvas, lineColor, lineOpacity, lineWidth, onMouseMove, onMouseUp]
  );

  const onObjectAdded = useCallback(
    (event: fabric.IEvent) => {
      if (
        !event.target ||
        !mode ||
        !SELECTABLE_OBJECTS.includes(mode) ||
        // TODO: this is a very bad hack, find a different way to prevent the object being added to the history while rendering
        isRendering.current
      )
        return;

      const obj = event.target;
      obj.set({
        cornerStyle: "circle",
        cornerColor: "white",
        borderColor: "white",
        cornerStrokeColor: "white",
        transparentCorners: false,
      });

      // TODO: I don't like this approach, maybe you can think of a better way to specify which objects are selectable
      obj.set({
        name: mode,
      });

      pushToHistory({
        type: "add-object",
        data: obj,
      });
    },
    [isRendering, mode, pushToHistory]
  );

  const onMouseDownSelectObject = useCallback(
    (event: fabric.IEvent) => {
      if (
        !event.target?.name ||
        !SELECTABLE_OBJECTS.includes(event.target.name as Mode)
      ) {
        return;
      }

      if (selected) {
        setSelected(null);
      } else if (event.target) {
        setSelected(event.target);
      }
    },
    [selected]
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!selected) return;

      if (event.key === "Delete") {
        pushToHistory({
          type: "remove-object",
          data: selected,
        });
        setSelected(null);
      }
    },
    [pushToHistory, selected]
  );

  useEffect(() => {
    if (!canvas || !isValidMode(mode)) return;

    if (isLineStraight) {
      canvas.defaultCursor = "crosshair";
      canvas.forEachObject((obj) => {
        obj.set({
          evented: false,
        });
      });
      canvas.on("mouse:down", onMouseDown);
    } else {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = `rgba(${lineColor}, ${lineOpacity})`;
      canvas.freeDrawingBrush.width = lineWidth;
    }

    return () => {
      canvas.isDrawingMode = false;
      line.current = null;
      canvas.defaultCursor = "default";
      canvas.forEachObject((obj) => {
        obj.set({
          evented: true,
        });
      });
      canvas.off("mouse:down", onMouseDown);
    };
  }, [
    canvas,
    isLineStraight,
    lineColor,
    lineOpacity,
    lineWidth,
    mode,
    onMouseDown,
  ]);

  useEffect(() => {
    if (!canvas) return;
    canvas.on("object:added", onObjectAdded);
    canvas.on("mouse:down", onMouseDownSelectObject);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      canvas.off("object:added", onObjectAdded);
      canvas.off("mouse:down", onMouseDownSelectObject);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [canvas, onKeyDown, onMouseDownSelectObject, onObjectAdded]);
}

function isValidMode(mode: Mode | null) {
  return !!mode && ["drawing"].includes(mode);
}
