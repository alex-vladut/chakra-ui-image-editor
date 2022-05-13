import { Tooltip } from "@chakra-ui/react";

import { Undo } from "../../icons";
import { useCanvasContext } from "../../hooks/useCanvasContext";

export const UndoButton = () => {
  const { hasUndo, undo } = useCanvasContext();

  return (
    <Tooltip label="Undo" placement="bottom" isDisabled={!hasUndo}>
      <Undo onClick={undo} />
    </Tooltip>
  );
};
