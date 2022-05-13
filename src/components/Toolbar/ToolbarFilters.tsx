import {
  Button,
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  VStack,
} from "@chakra-ui/react";
import { hexToRgb } from "../../helpers/colorConverter";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { ColorPicker } from "../ColorPicker";

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
        <Slider
          id="brightness"
          value={Math.round(filters.brightness * 250)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("brightness", value / 250);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
        <Slider
          id="saturation"
          value={Math.round(filters.saturation * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("saturation", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="hue">
          Hue
          <span>{Math.round(filters.hue * 100)}</span>
        </FormLabel>
        <Slider
          id="hue"
          value={Math.round(filters.hue * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("hue", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
        <Slider
          id="pixelate"
          value={filters.pixelate}
          min={1}
          max={100}
          onChange={(value) => {
            setFilterProperty("pixelate", value);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
        <Slider
          id="noise"
          value={filters.noise}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("noise", value);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
        <Slider
          id="invert"
          value={Math.round(filters.invert * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("invert", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="blur">
          Blur
          <span>{Math.round(filters.blur * 100)}</span>
        </FormLabel>
        <Slider
          id="blur"
          value={Math.round(filters.blur * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("blur", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>

      <FormControl>
        <FormLabel display="flex" justifyContent="space-between" htmlFor="tint">
          Tint
          <span>{Math.round(filters.tintOpacity * 100)}</span>
        </FormLabel>
        <Slider
          id="tint"
          value={Math.round(filters.tintOpacity * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("tintOpacity", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
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
