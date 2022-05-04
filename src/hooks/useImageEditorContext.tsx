import { createContext, ReactNode, useContext, useState } from "react";

type Props = {
  imageUrl?: string;
  setImageUrl(imageUrl?: string): void;
  canvasElement?: HTMLCanvasElement;
  setCanvasElement(canvasElement?: HTMLCanvasElement): void;
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

  return (
    <Context.Provider
      value={{ imageUrl, setImageUrl, canvasElement, setCanvasElement }}
    >
      {children}
    </Context.Provider>
  );
}
