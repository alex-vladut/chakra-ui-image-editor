import {
  Button,
  FormControl,
  FormLabel,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  VStack,
} from "@chakra-ui/react";

import { hexToRgb } from "../../helpers/colorConverter";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { CenterSliderFilledTrack } from "../CenterSliderFilledTrack";
import { ColorPicker } from "../ColorPicker";
import { SliderFilterHistory } from "./SliderFilterHistory";

export const ToolbarFilters = () => {
  const { filters, setFilterProperty, resetFilters } = useCanvasContext();

  return (
    <VStack p={4} spacing={4}>
      <FormControl
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <FormLabel htmlFor="sharpness" mb={0}>
          Sharpness
        </FormLabel>
        <Switch
          id="sharpness"
          isChecked={filters.sharpen}
          onChange={() => {
            setFilterProperty("sharpen", !filters.sharpen);
          }}
        />
      </FormControl>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="brightness"
        >
          Brightness
          <span>{Math.round(filters.brightness * 250)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="brightness"
          property="brightness"
          multiplier={250}
          min={-100}
          max={100}
        >
          <SliderTrack>
            <CenterSliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="saturation"
        >
          Saturation
          <span>{Math.round(filters.saturation * 100)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="saturation"
          property="saturation"
          multiplier={100}
          min={-100}
          max={100}
        >
          <SliderTrack>
            <CenterSliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="hue">
          Hue
          <span>{Math.round(filters.hue * 100)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="hue"
          property="hue"
          multiplier={100}
          min={-100}
          max={100}
        >
          <SliderTrack>
          <CenterSliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="pixelate"
        >
          Pixelate
          <span>{filters.pixelate}</span>
        </FormLabel>
        <SliderFilterHistory
          id="pixelate"
          property="pixelate"
          min={1}
          max={100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="noise"
        >
          Noise
          <span>{filters.noise}</span>
        </FormLabel>
        <SliderFilterHistory id="noise" property="noise" min={0} max={100}>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="invert"
        >
          Invert
          <span>{Math.round(filters.invert * 100)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="invert"
          property="invert"
          multiplier={100}
          min={0}
          max={100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="blur">
          Blur
          <span>{Math.round(filters.blur * 100)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="blur"
          property="blur"
          multiplier={100}
          min={0}
          max={100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="tint">
          Tint
          <span>{Math.round(filters.tintOpacity * 100)}</span>
        </FormLabel>
        <SliderFilterHistory
          id="tint"
          property="tintOpacity"
          multiplier={100}
          min={0}
          max={100}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </SliderFilterHistory>
      </FormControl>

      <ColorPicker
        currentColorCode={hexToRgb(filters.tintColor)}
        callback={(hex) => {
          setFilterProperty("tintColor", hex);
          setFilterProperty("tintOpacity", 1);
        }}
        output="hex"
      />

      <Button w="full" onClick={resetFilters}>
        Reset
      </Button>
    </VStack>
  );
};
