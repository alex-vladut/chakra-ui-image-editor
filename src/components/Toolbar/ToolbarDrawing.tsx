import {
  Box,
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  VStack,
} from "@chakra-ui/react";

import { ColorPicker } from "../ColorPicker";
import { useCanvasContext } from "../../hooks/useCanvasContext";

export const ToolbarDrawing = () => {
  const {
    lineColor,
    setLineColor,
    lineWidth,
    setLineWidth,
    lineOpacity,
    setLineOpacity,
    isLineStraight,
    setIsLineStraight,
  } = useCanvasContext();

  return (
    <Box p={4}>
      <VStack my={8} spacing={4}>
        <ColorPicker
          title="Color"
          currentColorCode={lineColor}
          callback={setLineColor}
        />

        <FormControl>
          <FormLabel
            display="flex"
            justifyContent="space-between"
            htmlFor="width"
          >
            Width
            <span>{lineWidth}</span>
          </FormLabel>
          <Slider
            id="width"
            min={1}
            max={150}
            value={lineWidth}
            onChange={setLineWidth}
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
            htmlFor="opacity"
          >
            Opacity
            <span>{Math.round(lineOpacity * 100)}</span>
          </FormLabel>
          <Slider
            id="opacity"
            value={Math.round(lineOpacity * 100)}
            min={0}
            max={100}
            onChange={(value) => setLineOpacity(value / 100)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <FormLabel htmlFor="straight" mb={0}>
            Straight
          </FormLabel>
          <Switch
            id="straight"
            isChecked={isLineStraight}
            onChange={() => setIsLineStraight(!isLineStraight)}
          />
        </FormControl>
      </VStack>
    </Box>
  );
};
