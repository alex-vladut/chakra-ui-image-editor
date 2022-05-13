import { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  InputGroup,
  InputRightElement,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import { ToolbarOption } from "./ToolbarOption";
import { useCropHandler } from "../../handlers/useCropHandler";
import { useCanvasContext } from "../../hooks/useCanvasContext";

const aspectRatioList = [
  { name: "custom", value: null },
  { name: "1:1", value: { width: 1, height: 1 } },
  { name: "3:2", value: { width: 3, height: 2 } },
  { name: "4:3", value: { width: 4, height: 3 } },
  { name: "5:4", value: { width: 5, height: 4 } },
  { name: "7:5", value: { width: 7, height: 5 } },
  { name: "16:9", value: { width: 16, height: 9 } },
];

export const ToolbarCrop: React.FC = () => {
  const [activeInput, setActiveInput] = useState<"height" | "width" | null>(
    null
  );
  const { setZoomRatio } = useCanvasContext();
  const {
    cropInfo,
    open,
    crop,
    close,
    updateWidth,
    updateHeight,
    updateRatio,
  } = useCropHandler();
  const [ratioName, setRatioName] = useState("custom");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const onChangeWidth = (_: string, value: number) => {
    if (!value || isNaN(value)) return;

    setWidth(value);
    updateWidth(value);
  };

  const onChangeHeight = (_: string, value: number) => {
    if (!value || isNaN(value)) return;
    setHeight(value);
    updateHeight(value);
  };

  useEffect(() => {
    setZoomRatio(1);
    open();

    return () => {
      close();
    };
  }, [close, open, setZoomRatio]);

  useEffect(() => {
    if (!cropInfo) return;

    if (!activeInput) {
      setWidth(cropInfo.width);
      setHeight(cropInfo.height);
    } else if (activeInput === "width") {
      setHeight(cropInfo.height);
    } else if (activeInput === "height") {
      setWidth(cropInfo.width);
    }
  }, [activeInput, cropInfo]);

  return (
    <VStack p={4} spacing={4}>
      <HStack w="full" mb={4}>
        <InputGroup>
          <InputRightElement pointerEvents="none" children="w" />
          <NumberInput
            variant="flushed"
            value={Math.floor(width)}
            min={0}
            onChange={onChangeWidth}
            onFocus={() => {
              setActiveInput("width");
            }}
            onBlur={() => {
              if (!cropInfo) return;
              setActiveInput(null);
              // updating input field to reflect the ratio
              setWidth(cropInfo.width);
            }}
          >
            <NumberInputField />
          </NumberInput>
        </InputGroup>

        <Text>x</Text>

        <InputGroup>
          <InputRightElement pointerEvents="none" children="h" />
          <NumberInput
            variant="flushed"
            value={Math.floor(height)}
            min={0}
            onChange={onChangeHeight}
            onFocus={() => {
              setActiveInput("height");
            }}
            onBlur={() => {
              if (!cropInfo) return;
              setActiveInput(null);
              setHeight(cropInfo.height);
            }}
          >
            <NumberInputField />
          </NumberInput>
        </InputGroup>
      </HStack>

      <FormControl>
        <FormLabel htmlFor="apect-ratio" mb={4}>
          Aspect ratio
        </FormLabel>
        <SimpleGrid id="aspect-ratio" columns={2} gap={2}>
          {aspectRatioList.map((aspectRatio, index) => (
            <ToolbarOption
              key={index}
              isActive={ratioName === aspectRatio.name}
              onClick={() => {
                setRatioName(aspectRatio.name);
                updateRatio(aspectRatio.value);
              }}
            >
              {aspectRatio.name}
            </ToolbarOption>
          ))}
        </SimpleGrid>
      </FormControl>

      <Button w="full" onClick={crop}>
        Apply
      </Button>
    </VStack>
  );
};
