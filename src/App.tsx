import { ChakraProvider, theme } from "@chakra-ui/react";

import Menu from "./components/Menu";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";

import { ImageEditorContextProvider } from "./hooks/useImageEditorContext";
import { CanvasContextProvider } from "./hooks/useCanvasContext";
import { ToolbarContextProvider } from "./hooks/useToolbarContext";
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
        <ImageEditorContextProvider>
          <ToolbarContextProvider>
            <CropperContextProvider>
              <Content />
            </CropperContextProvider>
          </ToolbarContextProvider>
        </ImageEditorContextProvider>
      </CanvasContextProvider>
    </ChakraProvider>
  );
}
