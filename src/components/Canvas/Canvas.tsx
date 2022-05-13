import { Center } from "@chakra-ui/react";
import { useContainerHandler } from "../../handlers/useContainerHandler";
import { useEventHandlers } from "../../handlers/useEventHandlers";
import { useRenderHandler } from "../../handlers/useRenderHandler";

const Canvas = () => {
  const containerRef = useContainerHandler();

  useEventHandlers();
  useRenderHandler();

  return (
    <Center ref={containerRef} as="section" flex={1} w="full">
      <canvas id="canvas" />
    </Center>
  );
};

export default Canvas;
