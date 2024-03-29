import React from "react";
import {
  Box,
  CloseButton,
  Divider,
  Heading,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

import { ToolbarAdjust } from "./ToolbarAdjust";
import { ToolbarCrop } from "./ToolbarCrop";
import { ToolbarFilters } from "./ToolbarFilters";
import { ToolbarDrawing } from "./ToolbarDrawing";

import { useCanvasContext } from "../../hooks/useCanvasContext";

const contentMap: { [name: string]: JSX.Element } = {
  // search: <ToolbarSearch />,
  crop: <ToolbarCrop />,
  adjust: <ToolbarAdjust />,
  drawing: <ToolbarDrawing />,
  // text: <ToolbarText />,
  filters: <ToolbarFilters />,
};

const Toolbar: React.FC = () => {
  const { mode, stopSession } = useCanvasContext();
  const bgColor = useColorModeValue("gray.400", "gray.900");

  return mode ? (
    <Box as="section" w="2xs" h="100vh" bgColor={bgColor}>
      <HStack align="center" justify="space-between" p={4}>
        <Heading size="sm" textTransform="uppercase">
          {mode}
        </Heading>
        <CloseButton onClick={stopSession} />
      </HStack>
      <Divider />
      {contentMap[mode]}
    </Box>
  ) : null;
};

export default Toolbar;
