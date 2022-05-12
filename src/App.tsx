import { ChakraProvider, theme } from "@chakra-ui/react";

import Menu from "./components/Menu";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

import { CanvasContextProvider } from "./hooks/useCanvasContext";
import { CropperContextProvider } from "./hooks/useCropperContext";

export const Content = () => {
  return (
    <div className="app">
      <Header />
      <Menu />
      <Toolbar />
      <Canvas />
    </div>
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
