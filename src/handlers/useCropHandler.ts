import { fabric } from "fabric";
import { useCallback, useEffect, useRef, useState } from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { useUploadImageHandler } from "./useUploadImageHandler";

const CROP_OBJECT_NAME = "crop-zone";
const FRAME_WIDTH: number = 3;
const FRAME_CORNERS_SIZE: number = 20;
const FRAME_COLOR: string = "rgba(0, 0, 0, 0.3)";
const OVERLAY_COLOR: string = "rgba(0, 0, 0, 0.5)";
const GRID_LINES_COLOR: string = "rgba(255, 255, 255, 0.6)";
const GRID_LINES_WIDTH: number = 2;

interface IEventTransform {
  corner: string;
  original: fabric.Object;
  originX: string;
  originY: string;
  width: number;
  ex: number;
  ey: number;
  target: {
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

type CropInfo = {
  top: number;
  left: number;
  width: number;
  height: number;
};

export type Ratio = {
  width: number;
  height: number;
} | null;

export function useCropHandler() {
  const innerRectRef = useRef<fabric.Group | null>(null);
  const outerRectRef = useRef<fabric.Path | null>(null);
  const { close: closeToolbar } = useToolbarContext();
  const { canvas, width, height, pushToHistory } = useCanvasContext();
  // TODO: this could probably be turned into a single number instead of holding both width and height
  const [ratio, setRatio] = useState<Ratio | null>(null);
  const [cropInfo, setCropInfo] = useState<CropInfo | null>(null);
  const [isFocused, setFocused] = useState(false);

  const upload = useUploadImageHandler();

  const open = useCallback(() => {
    if (!canvas) return;

    setCropInfo({
      top: 0,
      left: 0,
      width,
      height,
    });
    setRatio({ width, height });
  }, [canvas, height, width]);

  const close = useCallback(() => {
    if (!canvas) return;

    if (innerRectRef.current) {
      canvas.remove(innerRectRef.current);
    }
    if (outerRectRef.current) {
      canvas.remove(outerRectRef.current);
    }
    setCropInfo(null);
    setRatio(null);
  }, [canvas]);

  const crop = useCallback(() => {
    if (!cropInfo || !canvas) return;

    close();

    const croppedImageUrl = canvas.toDataURL({
      left: cropInfo.left,
      top: cropInfo.top,
      width: cropInfo.width,
      height: cropInfo.height,
    });

    upload(croppedImageUrl);
    pushToHistory({
      type: "crop",
      data: croppedImageUrl,
    });
    closeToolbar();
  }, [cropInfo, canvas, close, upload, pushToHistory, closeToolbar]);

  const move = useCallback(
    (left: number, top: number) => {
      if (!cropInfo || !canvas || !canvas.width || !canvas.height) return;

      left = Math.max(left, 0);
      if (left + cropInfo.width > canvas.width) {
        left = canvas.width - cropInfo.width;
      }

      top = Math.max(top, 0);
      if (top + cropInfo.height > canvas.height) {
        top = canvas.height - cropInfo.height;
      }
      setCropInfo((previous) => (previous ? { ...previous, top, left } : null));
    },
    [canvas, cropInfo]
  );

  const resize = useCallback(
    (cropZoneInfo: CropInfo, corner: string) => {
      if (!cropInfo || !canvas) return;

      const adjustedCropZone = adjustCropZoneWithAspectRatio(
        cropZoneInfo,
        cropInfo,
        corner,
        canvas,
        ratio
      );
      const { left, top, width, height } = adjustCropZoneWithMinValues(
        adjustedCropZone,
        cropInfo,
        corner,
        ratio
      );

      setCropInfo((previous) =>
        previous ? { ...previous, width, height, left, top } : null
      );
    },
    [canvas, cropInfo, ratio]
  );

  const updateWidth = useCallback(
    (cropZoneWidth: number) => {
      if (!cropInfo || !canvas) return;

      if (cropZoneWidth && cropInfo.width !== cropZoneWidth) {
        const { minWidth } = getMinSize(ratio, cropInfo);
        const maxSize = getMaxSize("br", canvas, cropInfo, ratio);
        if (!maxSize) return;
        const { maxWidth } = maxSize;

        let width = Math.max(cropZoneWidth, minWidth);
        width = Math.min(width, maxWidth);

        setCropInfo((previous) => (previous ? { ...previous, width } : null));
        if (ratio) {
          const height = getProportionalHeightValue(width, ratio);
          setCropInfo((previous) =>
            previous ? { ...previous, height } : null
          );
        }
      }
    },
    [canvas, cropInfo, ratio]
  );

  const updateHeight = useCallback(
    (cropZoneHeight: number) => {
      if (!cropInfo || !canvas) return;

      if (cropZoneHeight && cropInfo.height !== cropZoneHeight) {
        const { minHeight } = getMinSize(ratio, cropInfo);
        const maxSize = getMaxSize("br", canvas, cropInfo, ratio);
        if (!maxSize) return;
        const { maxHeight } = maxSize;

        let height = Math.max(cropZoneHeight, minHeight);
        height = Math.min(height, maxHeight);

        setCropInfo((previous) => (previous ? { ...previous, height } : null));
        if (ratio) {
          const width = getProportionalWidthValue(height, ratio);
          setCropInfo((previous) => (previous ? { ...previous, width } : null));
        }
      }
    },
    [canvas, cropInfo, ratio]
  );

  const updateRatio = useCallback(
    (ratio: Ratio) => {
      if (!canvas || !canvas.width || !canvas.height || !cropInfo) return;

      const { width, height } = getInitialSize(canvas, ratio);
      if (!width || !height) return;

      setCropInfo({
        width,
        height,
        left: canvas.width / 2 - cropInfo.width / 2,
        top: canvas.height / 2 - cropInfo.height / 2,
      });
      setFocused(true);
      setRatio(ratio);
    },
    [canvas, cropInfo]
  );

  useEffect(() => {
    if (!cropInfo || !canvas) return;

    if (outerRectRef.current) {
      canvas.remove(outerRectRef.current);
    }
    outerRectRef.current = renderOuterRect(canvas, cropInfo);
    canvas.add(outerRectRef.current);

    if (innerRectRef.current) {
      canvas.remove(innerRectRef.current);
    }
    innerRectRef.current = renderInnerRect(cropInfo, isFocused);
    canvas.add(innerRectRef.current);
    canvas.setActiveObject(innerRectRef.current);
  }, [canvas, cropInfo, isFocused]);

  const onMouseDown = useCallback((e: fabric.IEvent) => {
    if (e?.target?.name !== CROP_OBJECT_NAME) return;

    setFocused(true);
  }, []);

  const onMouseUp = useCallback((e: fabric.IEvent) => {
    setFocused(false);
  }, []);

  const onObjectMoving = useCallback(
    (e: fabric.IEvent) => {
      if (e?.target?.name !== CROP_OBJECT_NAME) return;

      const { startX, startY, endX, endY, startLeft, startTop } =
        getMovingEventData(e);

      const diffX = startX - endX;
      const diffY = startY - endY;

      const endLeft = startLeft - diffX;
      const endTop = startTop - diffY;

      move(endLeft, endTop);
    },
    [move]
  );

  const onObjectScaling = useCallback(
    (e: fabric.IEvent) => {
      if (!canvas) return;

      const {
        startLeft,
        startTop,
        endLeft,
        endTop,
        endX,
        endY,
        width,
        height,
        corner,
      } = getScalingEventData(canvas, e);

      const resizeData: { [key: string]: CropInfo } = {
        tl: {
          width: width - (endX - startLeft),
          height: height - (endY - startTop),
          left: endX,
          top: endY,
        },
        mt: {
          width: width,
          height: height - (endY - startTop),
          left: endLeft,
          top: endY,
        },
        tr: {
          width: width + (endX - (startLeft + width)),
          height: height - (endY - startTop),
          left: endLeft,
          top: endY,
        },

        mr: {
          width: width + (endX - (startLeft + width)),
          height: height,
          left: endLeft,
          top: endTop,
        },
        br: {
          width: width + (endX - (startLeft + width)),
          height: height + (endY - (startTop + height)),
          left: endLeft,
          top: endTop,
        },

        mb: {
          width: width,
          height: height + (endY - (startTop + height)),
          left: endLeft,
          top: endTop,
        },

        bl: {
          width: width - (endX - startLeft),
          height: height + (endY - (startTop + height)),
          left: endX,
          top: endTop,
        },
        ml: {
          width: width - (endX - startLeft),
          height: height,
          left: endX,
          top: endTop,
        },
      };
      resize(resizeData[corner], corner);
    },
    [canvas, resize]
  );

  useEffect(() => {
    if (!canvas) return;

    canvas.on("mouse:down", onMouseDown);
    canvas.on("mouse:up", onMouseUp);
    canvas.on("object:moving", onObjectMoving);
    canvas.on("object:scaling", onObjectScaling);

    return () => {
      canvas.off("mouse:down", onMouseDown);
      canvas.off("mouse:up", onMouseUp);
      canvas.off("object:moving", onObjectMoving);
      canvas.off("object:scaling", onObjectScaling);
    };
  }, [canvas, onMouseDown, onMouseUp, onObjectMoving, onObjectScaling]);

  return {
    cropInfo,
    open,
    close,
    crop,
    updateWidth,
    updateHeight,
    updateRatio,
  };
}

function getInitialSize(canvas: fabric.Canvas, ratio: Ratio | null) {
  let width = canvas.width;
  let height = canvas.height;
  if (ratio && width && height) {
    const size = convertAspectRatioToActualSize(width, height, ratio);
    if (size) {
      width = size.width;
      height = size.height;
    }
  }
  return { width, height };
}

function renderInnerRect(cropInfo: CropInfo, isFocused: boolean): fabric.Group {
  const grid = renderGrid(cropInfo);
  const frame = renderFrame(cropInfo);
  const group = isFocused ? [grid, frame] : [frame];

  return new fabric.Group(group, {
    name: CROP_OBJECT_NAME,
    cornerColor: "transparent",
    selectable: true,
    hasControls: true,
    hasBorders: false,
    hasRotatingPoint: false,
  });
}

function renderGrid(cropInfo: CropInfo): fabric.Group {
  const lineOptions = {
    stroke: GRID_LINES_COLOR,
    strokeWidth: GRID_LINES_WIDTH,
    selectable: false,
  };
  const horizontalLines = renderHorizontalLines(lineOptions, cropInfo);
  const verticalLines = renderVerticalLines(lineOptions, cropInfo);
  return new fabric.Group([...horizontalLines, ...verticalLines]);
}

function renderHorizontalLines(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const lines = [];
  let { top, left, width, height } = cropInfo;
  const step = height / 3;

  for (let i = 0; i < 2; i++) {
    top += step;
    const line = new fabric.Line([left, top, left + width, top], options);
    lines.push(line);
  }
  return lines;
}

function renderVerticalLines(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const lines = [];
  let { top, left, height, width } = cropInfo;
  const step = width / 3;

  for (let i = 0; i < 2; i++) {
    left += step;
    const line = new fabric.Line([left, top, left, top + height], options);
    lines.push(line);
  }
  return lines;
}

function renderFrame(cropInfo: CropInfo): fabric.Group {
  const { left, top, width, height } = cropInfo;
  const frame = new fabric.Rect({
    width: width - FRAME_WIDTH,
    height: height - FRAME_WIDTH,
    strokeWidth: FRAME_WIDTH,
    stroke: FRAME_COLOR,
    selectable: false,
    fill: "transparent",
    left,
    top,
  });
  const corners = drawFrameCorners(cropInfo);

  return new fabric.Group([frame, ...corners]);
}

function drawFrameCorners(cropInfo: CropInfo): fabric.Object[] {
  const lineOptions = {
    stroke: "white",
    strokeWidth: FRAME_WIDTH,
    selectable: false,
  };

  const tlCorner = drawTopLeftCorner(lineOptions, cropInfo);
  const trCorner = drawTopRightCorner(lineOptions, cropInfo);
  const brCorner = drawBottomRightCorner(lineOptions, cropInfo);
  const blCorner = drawBottomLeftCorner(lineOptions, cropInfo);
  return [...tlCorner, ...trCorner, ...brCorner, ...blCorner];
}

function drawTopLeftCorner(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const { left, top } = cropInfo;
  const size = FRAME_CORNERS_SIZE;
  return [
    new fabric.Line([left, top, left + size, top], options),
    new fabric.Line([left, top, left, top + size], options),
  ];
}

function drawTopRightCorner(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const { top, left, width } = cropInfo;
  const size = FRAME_CORNERS_SIZE;
  const right = left + width - FRAME_WIDTH;
  return [
    new fabric.Line([right - size, top, right, top], options),
    new fabric.Line([right, top, right, top + size], options),
  ];
}

function drawBottomRightCorner(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const { top, left, width, height } = cropInfo;
  const right = left + width - FRAME_WIDTH;
  const bottom = top + height;
  return [
    new fabric.Line(
      [right, bottom - FRAME_CORNERS_SIZE, right, bottom],
      options
    ),
    new fabric.Line(
      [
        right - FRAME_CORNERS_SIZE,
        bottom - FRAME_WIDTH,
        right + FRAME_WIDTH,
        bottom - FRAME_WIDTH,
      ],
      options
    ),
  ];
}

function drawBottomLeftCorner(
  options: fabric.ILineOptions,
  cropInfo: CropInfo
): fabric.Object[] {
  const { top, left, height } = cropInfo;
  const size = FRAME_CORNERS_SIZE;
  const bottom = top + height;
  return [
    new fabric.Line(
      [left + size, bottom - FRAME_WIDTH, left, bottom - FRAME_WIDTH],
      options
    ),
    new fabric.Line([left, bottom - FRAME_WIDTH, left, bottom - size], options),
  ];
}

function renderOuterRect(canvas: fabric.Canvas, cropInfo: CropInfo) {
  const canvasSize = canvas;
  const { left, top, width, height } = cropInfo;
  const right = left + width;
  const bottom = top + height;

  const leftRect = `
      M 0 0
      L ${left} 0
      L ${left} ${canvasSize.height}
      L 0 ${canvasSize.height}
    `;

  const topRect = `
      M 0 0 
      L ${canvasSize.width} 0
      L ${canvasSize.width} ${top}
      L 0 ${top}
    `;

  const bottomRect = `
      M 0 ${canvasSize.height}
      L 0 ${bottom}
      L ${canvasSize.width} ${bottom}
      L ${canvasSize.width} ${canvasSize.height}
    `;

  const rightRect = `
      M ${right} ${top}
      L ${canvasSize.width} ${top}
      L ${canvasSize.width} ${bottom}
      L ${right} ${bottom}
    `;

  return new fabric.Path(
    `
      ${topRect} ${leftRect} ${bottomRect} ${rightRect}
    `,
    {
      fill: OVERLAY_COLOR,
      selectable: false,
      hoverCursor: "default",
      name: "overlay",
    }
  );
}

function getMovingEventData(event: fabric.IEvent) {
  const transform = event.transform as IEventTransform;
  const { ex: startX, ey: startY } = transform;
  const { x: endX, y: endY } = event.pointer as fabric.Point;
  const { left: startLeft, top: startTop } = transform.original as {
    left: number;
    top: number;
  };
  return { startX, startY, endX, endY, startLeft, startTop };
}

function getScalingEventData(canvas: fabric.Canvas, event: fabric.IEvent) {
  const transform = event.transform as IEventTransform;
  const { corner, target, original } = transform;
  const { x: endX, y: endY } = getScalingPointer(canvas, event.pointer);
  const { left: startLeft, top: startTop } = original as {
    left: number;
    top: number;
  };
  const { width, height, left: endLeft, top: endTop } = target;
  return {
    startLeft,
    startTop,
    endLeft,
    endTop,
    endX,
    endY,
    width,
    height,
    corner,
  };
}

function getScalingPointer(
  canvas: fabric.Canvas,
  pointer: fabric.Point | undefined
): { x: number; y: number } {
  if (!pointer || !canvas.width || !canvas.height) {
    return { x: 0, y: 0 };
  }
  let { x, y } = pointer as fabric.Point;
  if (x < 0) {
    x = 0;
  }
  if (x > canvas.width) {
    x = canvas.width;
  }
  if (y < 0) {
    y = 0;
  }
  if (y > canvas.height) {
    y = canvas.height;
  }
  return { x, y };
}

function adjustCropZoneWithMinValues(
  values: CropInfo,
  cropInfo: CropInfo,
  corner: string,
  ratio: Ratio
): CropInfo {
  const { minWidth, minHeight, minX, minY } = getMinSize(ratio, cropInfo);

  let left =
    corner === "mr" || corner === "tr" || corner === "br"
      ? Math.max(values.left, cropInfo.left)
      : Math.min(values.left, minX);

  let top =
    corner === "mb" || corner === "bl" || corner === "br"
      ? Math.max(values.top, cropInfo.top)
      : Math.min(values.top, minY);

  const width = Math.max(values.width, minWidth);
  const height = Math.max(values.height, minHeight);

  return { left, top, width, height };
}

function getMinSize(
  ratio: Ratio,
  cropInfo: CropInfo
): {
  minWidth: number;
  minHeight: number;
  minX: number;
  minY: number;
} {
  let minWidth = 40;
  let minHeight = 40;
  if (ratio) {
    const minSize = convertAspectRatioToActualSize(minWidth, minHeight, ratio);
    if (minSize) {
      minWidth = minSize.width;
      minHeight = minSize.height;
    }
  }
  return {
    minWidth,
    minHeight,
    minX: cropInfo.left + cropInfo.width - minWidth,
    minY: cropInfo.top + cropInfo.height - minHeight,
  };
}

function convertAspectRatioToActualSize(
  containerWidth: number,
  containerHeight: number,
  ratio: Ratio
): Ratio {
  if (!ratio) {
    return null;
  }
  const height = Math.min(
    (ratio.height * containerWidth) / ratio.width,
    containerHeight
  );
  const width = Math.min(
    (ratio.width / ratio.height) * containerHeight,
    containerWidth
  );
  return { width, height };
}

function adjustCropZoneWithAspectRatio(
  cropZoneInfo: CropInfo,
  cropInfo: CropInfo,
  corner: string,
  canvas: fabric.Canvas,
  ratio: Ratio
): CropInfo {
  if (!ratio) {
    return cropZoneInfo;
  }

  let { width, height, left, top } = cropZoneInfo;
  const maxSize = getMaxSize(corner, canvas, cropInfo, ratio);
  if (!maxSize) return cropZoneInfo;

  let { maxWidth, maxHeight, maxX, maxY } = maxSize;

  if (corner !== "mt" && corner !== "mb") {
    height = getProportionalHeightValue(width, ratio);
  }
  if (corner === "mt" || corner === "mb") {
    width = getProportionalWidthValue(height, ratio);
  }

  if (corner === "tl" || corner === "tr") {
    top = cropInfo.top + (cropInfo.height - height);
  }
  if (corner === "br" || corner === "bl") {
    top = cropInfo.top;
  }

  width = Math.min(width, maxWidth);
  height = Math.min(height, maxHeight);
  left = Math.max(left, maxX);
  top = Math.max(top, maxY);

  return { width, height, left, top };
}

function getMaxSize(
  corner: string = "br",
  canvas: fabric.Canvas,
  cropInfo: CropInfo,
  ratio: Ratio
) {
  if (!canvas.width || !canvas.height) return null;

  const maxDimensions: any = {
    tl: {
      width: cropInfo.left + cropInfo.width,
      height: cropInfo.top + cropInfo.height,
    },
    tr: {
      width: canvas.width - cropInfo.left,
      height: cropInfo.top + cropInfo.height,
    },
    br: {
      width: canvas.width - cropInfo.left,
      height: canvas.height - cropInfo.top,
    },
    bl: {
      width: cropInfo.left + cropInfo.width,
      height: canvas.height - cropInfo.top,
    },
  };
  maxDimensions.mt = maxDimensions.tr;
  maxDimensions.mr = maxDimensions.br;
  maxDimensions.mb = maxDimensions.br;
  maxDimensions.ml = maxDimensions.bl;

  let maxWidth = maxDimensions[corner].width;
  let maxHeight = maxDimensions[corner].height;

  if (ratio) {
    const maxSize = convertAspectRatioToActualSize(maxWidth, maxHeight, ratio);
    if (maxSize) {
      maxWidth = maxSize.width;
      maxHeight = maxSize.height;
    }
  }
  return {
    maxWidth,
    maxHeight,
    maxX: cropInfo.left + cropInfo.width - maxWidth,
    maxY: cropInfo.top + cropInfo.height - maxHeight,
  };
}

function getProportionalWidthValue(height: number, ratio: Ratio): number {
  if (!ratio) {
    return height;
  }
  return (ratio.width / ratio.height) * height;
}

function getProportionalHeightValue(width: number, ratio: Ratio): number {
  if (!ratio) {
    return width;
  }
  return width / (ratio.width / ratio.height);
}
