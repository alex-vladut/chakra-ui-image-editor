import { Tooltip } from "@chakra-ui/react";

import { Redo } from "../icons";
import { useCanvasContext } from "../hooks/useCanvasContext";

export const RedoButton = () => {
  const { hasRedo, redo } = useCanvasContext();

  return (
    <Tooltip label="Redo" placement="bottom" isDisabled={!hasRedo}>
      <Redo onClick={redo} />
    </Tooltip>
  );
};
