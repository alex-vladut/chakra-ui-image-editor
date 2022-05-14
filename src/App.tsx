import { Box, ChakraProvider, HStack, theme, VStack } from "@chakra-ui/react";

import Menu from "./components/Menu/Menu";
import Header from "./components/Header/Header";
import Canvas from "./components/Canvas/Canvas";
import Toolbar from "./components/Toolbar/Toolbar";

import { CanvasContextProvider } from "./hooks/useCanvasContext";
import { CropperContextProvider } from "./hooks/useCropperContext";

export const Content = () => {
  return (
    <Box h="100vh" w="full" display="flex">
      <HStack h="full" spacing={0}>
        <Menu />
        <Toolbar />
      </HStack>
      <VStack h="full" flex={1}>
        <Header />
        <Canvas />
      </VStack>
    </Box>
  );
};

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <CanvasContextProvider>
        <CropperContextProvider>
          <Content />
        </CropperContextProvider>
      </CanvasContextProvider>
    </ChakraProvider>
  );
}
