import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  imageUrl?: string;
  setImageUrl(imageUrl?: string): void;
  canvasElement?: HTMLCanvasElement;
  setCanvasElement(canvasElement?: HTMLCanvasElement): void;
  scale: number;
  setScale(scale: number): void;
  zoomIn(): void;
  zoomOut(): void;
  mode?: string;
  setMode(mode?: string): void;
};

const Context = createContext<Props | null>(null);

export function useImageEditorContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Cannot access useImageEditorContext() outside <ImageEditorContextProvider/>"
    );
  }

  return context;
}

export function ImageEditorContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [imageUrl, setImageUrl] = useState<string>();
  const [canvasElement, setCanvasElement] = useState<HTMLCanvasElement>();
  const [scale, setScale] = useState<number>(1);
  const [mode, setMode] = useState<string>();

  const zoomIn = () => {
    if (scale >= 2) return;
    setScale(scale + 0.1);
  };

  const zoomOut = () => {
    if (scale <= 0.5) return;
    setScale(scale - 0.1);
  };

  return (
    <Context.Provider
      value={{
        imageUrl,
        setImageUrl: changeImageUrl,
        canvasElement,
        setCanvasElement,
        scale,
        setScale: changeScale,
        zoomIn,
        zoomOut,
        mode,
        setMode: changeMode,
      }}
    >
      {children}
    </Context.Provider>
  );

  function changeImageUrl(url: string) {
    setImageUrl(url);
    setScale(1);
  }

  function changeScale(value: number) {
    setScale(Number(value.toFixed(1)));
  }

  function changeMode(currentMode: string) {
    setScale(1);
    if (currentMode === mode) {
      setMode(undefined);
    } else {
      setMode(currentMode);
    }
  }
}
