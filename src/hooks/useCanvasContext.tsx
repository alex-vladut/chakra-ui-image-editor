import {
  FC,
  createContext,
  useState,
  ReactNode,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { fabric } from "fabric";

type ActionType = "crop" | "flip-x" | "flip-y" | "rotate" | "filters";

type Action<T extends ActionType, D> = {
  type: T;
  data: D;
};

export type Filters = {
  brightness: number;
  contrast: number;
  saturation: number;
  tintColor: string;
  tintOpacity: number;
  invert: number;
  hue: number;
  noise: number;
  blur: number;
  pixelate: number;
  sharpen: boolean;
};

type HistoryAction =
  | Action<"crop", string>
  | Action<"flip-x", boolean>
  | Action<"flip-y", boolean>
  | Action<"rotate", number>
  | Action<"filters", Filters>;

export type Mode =
  | "search"
  | "crop"
  | "adjust"
  | "drawing"
  | "shapes"
  | "text"
  | "filters";

const SCALE_STEP: number = 0.1;
const SCALE_MAX_VALUE: number = 3;
const SCALE_MIN_VALUE: number = 0.5;
const SCALE_DEFAULT_VALUE: number = 1;
const ANGLE_STEP: number = 90;

const INITIAL_STATE = {
  baseScale: SCALE_DEFAULT_VALUE,
  zoomRatio: SCALE_DEFAULT_VALUE,
  angle: 0,
  flipX: false,
  flipY: false,
  filters: {
    brightness: 0,
    contrast: 0,
    saturation: 0,
    tintColor: "#000000",
    tintOpacity: 0,
    invert: 0,
    hue: 0,
    noise: 0,
    blur: 0,
    pixelate: 1,
    sharpen: false,
  },
};

interface CanvasContext {
  mode: Mode | null;
  baseScale: number;
  setBaseScale: (baseScale: number) => void;
  actualZoomRatio: number;
  zoomRatio: number;
  setZoomRatio: (value: number) => void;
  originalUrl: string | null;
  setOriginalUrl: (originalUrl: string) => void;
  url: string | null;
  setUrl: (url: string) => void;
  width: number;
  height: number;
  containerElement: HTMLDivElement | null;
  setContainerElement: (containerElement: HTMLDivElement) => void;
  canvas: fabric.Canvas | null;
  setCanvas: (canvas: fabric.Canvas) => void;
  activeObject: fabric.Object | null;
  setActiveObject: (object: fabric.Object | null) => void;
  zoomIn(): void;
  zoomOut(): void;

  angle: number;
  setAngle: (angle: number) => void;
  rotate: (angle: number) => void;
  rotateLeft: () => void;
  rotateRight: () => void;
  flipX: boolean;
  toggleFlipX: () => void;
  flipY: boolean;
  toggleFlipY: () => void;

  filters: Filters;
  setFilterProperty<K extends keyof Filters, V extends Filters[K]>(
    key: K,
    value: V
  ): void;
  resetFilters: () => void;

  hasUndo: boolean;
  hasRedo: boolean;
  undo: () => void;
  redo: () => void;
  pushToHistory: (action: HistoryAction) => void;
  startSession: (mode: Mode) => void;
  stopSession: () => void;

  reset: () => void;
}

export const Context = createContext<CanvasContext | null>(null);

export const CanvasContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<Mode | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [containerElement, setContainerElement] =
    useState<HTMLDivElement | null>(null);
  const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

  const [baseScale, setBaseScale] = useState(SCALE_DEFAULT_VALUE);
  const [zoomRatio, setZoomRatio] = useState(SCALE_DEFAULT_VALUE);

  const [angle, setAngle] = useState(0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);

  const [filters, setFilters] = useState<Filters>(INITIAL_STATE.filters);

  const [history, setHistory] = useState<HistoryAction[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const hasUndo = useMemo(
    () => history.length > 0 && historyIndex > -1,
    [history, historyIndex]
  );

  const hasRedo = useMemo(
    () => history.length > 0 && historyIndex < history.length - 1,
    [history, historyIndex]
  );

  const undo = useCallback(() => {
    const newIndex = historyIndex - 1;
    const state = compileState(history, newIndex, originalUrl);
    setUrl(state.imageUrl);
    setFlipX(state.flipX);
    setFlipY(state.flipY);
    setAngle(state.angle);
    setFilters(state.filters);

    setHistoryIndex(newIndex);
  }, [history, historyIndex, originalUrl]);

  const redo = useCallback(() => {
    const newIndex = historyIndex + 1;
    const state = compileState(history, newIndex, originalUrl);
    setUrl(state.imageUrl);
    setFlipX(state.flipX);
    setFlipY(state.flipY);
    setAngle(state.angle);
    setFilters(state.filters);

    setHistoryIndex(newIndex);
  }, [history, historyIndex, originalUrl]);

  const pushToHistory = useCallback(
    (action: HistoryAction) => {
      if (historyIndex === -1) {
        setHistory([action]);
      } else {
        setHistory([...history.slice(0, historyIndex + 1), action]);
      }
      setHistoryIndex((previous) => previous + 1);
    },
    [history, historyIndex]
  );

  const stopSession = useCallback(() => {
    setMode(null);
  }, []);

  const startSession = useCallback(
    (newMode: Mode) => {
      if (mode) {
        // stop previous session
        stopSession();

        if (newMode === mode) return;
      }

      setMode(newMode);
    },
    [mode, stopSession]
  );

  const changeZoomRatio = useCallback((value: number) => {
    const roundedToStep =
      Math.round(value * SCALE_STEP * 100) / (SCALE_STEP * 100);
    setZoomRatio(
      Math.min(Math.max(roundedToStep, SCALE_MIN_VALUE), SCALE_MAX_VALUE)
    );
  }, []);

  const zoomIn = useCallback(() => {
    if (zoomRatio >= SCALE_MAX_VALUE) return;
    changeZoomRatio(zoomRatio + SCALE_STEP);
  }, [changeZoomRatio, zoomRatio]);

  const zoomOut = useCallback(() => {
    if (zoomRatio <= SCALE_MIN_VALUE) return;
    changeZoomRatio(zoomRatio - SCALE_STEP);
  }, [changeZoomRatio, zoomRatio]);

  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
    actualZoomRatio: 1,
  });

  useEffect(() => {
    if (!url || !containerElement) {
      setDimensions({ width: 0, height: 0, actualZoomRatio: 1 });
      return;
    }

    fabric.Image.fromURL(url, (image) => {
      image.rotate(angle).setCoords();
      const { width: originalWidth, height: originalHeight } =
        image.getBoundingRect();

      const containerWidth = 0.98 * containerElement.clientWidth;
      const containerHeight = 0.98 * containerElement.clientHeight;
      const ratio = originalWidth / originalHeight;
      let height = originalHeight * zoomRatio;
      let width = originalWidth * zoomRatio;
      if (height > containerHeight) {
        height = containerHeight;
        width = height * ratio;
      }
      if (width > containerWidth) {
        width = containerWidth;
        height = width / ratio;
      }

      setDimensions({
        width,
        height,
        actualZoomRatio:
          !angle && originalHeight * zoomRatio > containerHeight
            ? (originalHeight * zoomRatio) / containerHeight
            : 1,
      });
    });
  }, [angle, containerElement, url, zoomRatio]);

  const rotate = useCallback((value: number) => {
    setAngle(value);
  }, []);

  const rotateRight = useCallback(() => {
    let result = angle + ANGLE_STEP;
    if (result > 360) {
      result -= 360;
    }
    pushToHistory({
      type: "rotate",
      data: result,
    });

    rotate(result);
  }, [angle, pushToHistory, rotate]);

  const rotateLeft = useCallback(() => {
    let result = angle - ANGLE_STEP;
    if (result < -360) {
      result += 360;
    }

    pushToHistory({
      type: "rotate",
      data: result,
    });

    rotate(result);
  }, [angle, pushToHistory, rotate]);

  const toggleFlipX = useCallback(() => {
    setFlipX(!flipX);
    pushToHistory({
      type: "flip-x",
      data: !flipX,
    });
  }, [flipX, pushToHistory]);

  const toggleFlipY = useCallback(() => {
    setFlipY(!flipY);
    pushToHistory({
      type: "flip-y",
      data: !flipY,
    });
  }, [flipY, pushToHistory]);

  const resetFilters = useCallback(() => {
    setFilters(INITIAL_STATE.filters);
  }, []);

  const reset = useCallback(() => {
    setBaseScale(SCALE_DEFAULT_VALUE);
    setZoomRatio(SCALE_DEFAULT_VALUE);
    setAngle(0);
    setFlipX(false);
    setFlipY(false);
    resetFilters();
  }, [resetFilters]);

  const context = {
    mode,
    originalUrl,
    setOriginalUrl,
    url,
    setUrl,
    width: dimensions.width,
    height: dimensions.height,
    // TODO: maybe it is not necessary to store a reference to the canvas
    canvas,
    setCanvas,
    containerElement,
    setContainerElement,
    activeObject,
    setActiveObject,
    baseScale,
    setBaseScale,
    actualZoomRatio: dimensions.actualZoomRatio,
    zoomRatio,
    setZoomRatio: changeZoomRatio,
    zoomIn,
    zoomOut,
    angle,
    setAngle,
    rotate,
    rotateLeft,
    rotateRight,
    flipX,
    toggleFlipX,
    flipY,
    toggleFlipY,

    filters,
    setFilterProperty,
    resetFilters,

    hasUndo,
    hasRedo,
    undo,
    redo,
    pushToHistory,

    startSession,
    stopSession,

    reset,
  };

  function setFilterProperty<K extends keyof Filters, V extends Filters[K]>(
    key: K,
    value: V
  ) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export function useCanvasContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Cannot access useCanvasContext() outside of <CanvasProvider />"
    );
  }
  return context;
}

type State = {
  imageUrl: string | null;
  angle: number;
  flipX: boolean;
  flipY: boolean;
  filters: Filters;
};

function compileState(
  history: HistoryAction[],
  index: number,
  originalImageUrl: string | null
) {
  let state = { ...INITIAL_STATE, imageUrl: originalImageUrl };
  if (index === -1) return state;

  return history.slice(0, index + 1).reduce(historyReducer, state);
}

function historyReducer(state: State, action: HistoryAction): State {
  switch (action.type) {
    case "crop":
      return { ...INITIAL_STATE, imageUrl: action.data };
    case "flip-x":
      return { ...state, flipX: action.data };
    case "flip-y":
      return { ...state, flipY: action.data };
    case "rotate":
      return { ...state, angle: action.data };
    case "filters":
      return { ...state, filters: action.data };
    default:
      return state;
  }
}
