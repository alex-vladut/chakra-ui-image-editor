import { createContext, ReactNode, useContext, useState } from "react";

export type Ratio = {
  width: number;
  height: number;
} | null;

type Props = {
  shouldCrop: boolean;
  cropZoneWidth: number;
  cropZoneHeight: number;
  widthIndicator: number;
  heightIndicator: number;
  ratio?: Ratio;
  ratioName: string;
  setRatio(ratio: { name: string; value: Ratio }): void;
  setCropZoneWidth(value: number): void;
  setCropZoneHeight(value: number): void;
  setWidthIndicator(value: number): void;
  setHeightIndicator(value: number): void;
  crop(value: boolean): void;
};

const Context = createContext<Props | null>(null);

export function useCropperContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error(
      "Cannot access useCropperContext() outside <CropperContextProvider/>"
    );
  }

  return context;
}

export function CropperContextProvider({ children }: { children: ReactNode }) {
  const [shouldCrop, setShouldCrop] = useState(false);
  const [cropZoneWidth, setCropZoneWidth] = useState(0);
  const [cropZoneHeight, setCropZoneHeight] = useState(0);
  const [widthIndicator, setWidthIndicator] = useState(0);
  const [heightIndicator, setHeightIndicator] = useState(0);
  const [ratio, setRatio] = useState<Ratio>();
  const [ratioName, setRatioName] = useState("custom");

  return (
    <Context.Provider
      value={{
        shouldCrop,
        cropZoneWidth,
        setCropZoneWidth,
        cropZoneHeight,
        setCropZoneHeight,
        ratio,
        ratioName,
        setRatio: setRatioAndName,
        widthIndicator,
        setWidthIndicator,
        heightIndicator,
        setHeightIndicator,
        crop: setShouldCrop,
      }}
    >
      {children}
    </Context.Provider>
  );

  function setRatioAndName(ratio: { name: string; value: Ratio }) {
    setRatioName(ratio.name);
    setRatio(ratio.value);
  }
}
