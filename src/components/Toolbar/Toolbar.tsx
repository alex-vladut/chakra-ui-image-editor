import React from "react";
import { Box, CloseButton, Divider, Heading, HStack } from "@chakra-ui/react";

import { ToolbarAdjust } from "./ToolbarAdjust";
import { ToolbarCrop } from "./ToolbarCrop";
import { ToolbarFilters } from "./ToolbarFilters";
import { useCanvasContext } from "../../hooks/useCanvasContext";

const contentMap: { [name: string]: JSX.Element } = {
  // search: <ToolbarSearch />,
  crop: <ToolbarCrop />,
  adjust: <ToolbarAdjust />,
  // drawing: <ToolbarDrawing />,
  // text: <ToolbarText />,
  filters: <ToolbarFilters />,
};

const Toolbar: React.FC = () => {
  const { mode, stopSession } = useCanvasContext();

  return mode ? (
    <Box as="section" w="xs" h="100vh">
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
