import React from "react";
import { HStack, Text } from "@chakra-ui/react";

import { Minus, Plus } from "../../icons";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { ActionButton } from "../ActionButton";

export const ZoomControl: React.FC = () => {
  const { mode, zoomRatio, zoomIn, zoomOut } = useCanvasContext();

  return (
    <HStack flex={1} align="center" justify="center">
      {mode ? null : (
        <>
          <ActionButton
            aria-label="Zoom out"
            icon={<Minus />}
            variant="ghost"
            size="sm"
            rounded="full"
            onClick={zoomOut}
          />
          <Text>{`${Math.floor(zoomRatio * 100)}%`}</Text>
          <ActionButton
            aria-label="Zoom in"
            icon={<Plus />}
            variant="ghost"
            size="sm"
            rounded="full"
            onClick={zoomIn}
          />
        </>
      )}
    </HStack>
  );
};
