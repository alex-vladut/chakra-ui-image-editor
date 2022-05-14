import { useState } from "react";
import { Slider, SliderProps } from "@chakra-ui/react";

import { Filters, useCanvasContext } from "../../hooks/useCanvasContext";

type Props = {
  property: keyof Omit<Filters, "tintColor">;
  multiplier?: number;
};

export function SliderFilterHistory(props: Props & SliderProps) {
  const { property, multiplier = 1, ...rest } = props;
  const { filters, setFilterProperty, pushToHistory } = useCanvasContext();
  const [initialValue, setInitialValue] = useState<number | null>(null);

  return (
    <Slider
      value={Math.round(Number(filters[property]) * multiplier)}
      onChangeStart={setInitialValue}
      onChangeEnd={onEnd}
      onChange={onChange}
      {...rest}
    />
  );

  function onEnd(value: number) {
    if (value !== initialValue) {
      pushToHistory({
        type: "filters",
        data: { ...filters, [property]: value / multiplier },
      });
    }
  }

  function onChange(value: number) {
    setFilterProperty(property, value / multiplier);
  }
}
