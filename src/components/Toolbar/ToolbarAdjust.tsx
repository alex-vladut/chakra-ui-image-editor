import React from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Text,
  VStack,
} from "@chakra-ui/react";

import { Left, Right, FlipX, FlipY } from "../../icons";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { ToolbarOption } from "./ToolbarOption";

export const ToolbarAdjust: React.FC = () => {
  const {
    angle,
    flipX,
    flipY,
    toggleFlipX,
    toggleFlipY,
    rotate,
    rotateLeft,
    rotateRight,
  } = useCanvasContext();

  return (
    <Box p={4}>
      <VStack my={8} spacing={4}>
        <ToolbarOption isActive={flipX} onClick={toggleFlipX}>
          <FlipX /> <Text ml={2}>Flip X</Text>
        </ToolbarOption>
        <ToolbarOption isActive={flipY} onClick={toggleFlipY}>
          <FlipY /> <Text ml={2}>Flip Y</Text>
        </ToolbarOption>

        <ToolbarOption onClick={rotateLeft}>
          <Left /> <Text ml={2}>Rotate Left</Text>
        </ToolbarOption>
        <ToolbarOption onClick={rotateRight}>
          <Right /> <Text ml={2}>Rotate Right</Text>
        </ToolbarOption>
      </VStack>

      <FormControl>
        <FormLabel
          display="flex"
          justifyContent="space-between"
          htmlFor="angle"
        >
          Angle
          <span>{angle}</span>
        </FormLabel>
        <Slider
          value={angle}
          min={-360}
          max={360}
          defaultValue={0}
          onChange={rotate}
        >
          <SliderMark value={-360} mt="1" ml="-2.5" fontSize="sm">
            -360
          </SliderMark>
          <SliderMark value={-180} mt="1" ml="-2.5" fontSize="sm">
            -180
          </SliderMark>
          <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
            0
          </SliderMark>
          <SliderMark value={180} mt="1" ml="-2.5" fontSize="sm">
            180
          </SliderMark>
          <SliderMark value={360} mt="1" ml="-2.5" fontSize="sm">
            360
          </SliderMark>
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </FormControl>
    </Box>
  );
};
