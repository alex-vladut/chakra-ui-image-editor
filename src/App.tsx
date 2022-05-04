import { ChakraProvider, theme } from "@chakra-ui/react";

import Menu from "./components/Menu";
import Header from "./components/Header";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import ZoomControl from "./components/ZoomControl";
import { ImageEditorContextProvider } from "./hooks/useImageEditorContext";
import {
  ToolbarContextProvider,
  useToolbarContext,
} from "./hooks/useToolbarContext";

export const Content = () => {
  const { isOpen } = useToolbarContext();
  return (
    <div className={`app ${isOpen ? "toolbar_open" : ""}`}>
      <Header />
      <Menu />
      {isOpen && <Toolbar />}
      <Canvas />
      <ZoomControl />
    </div>
  );
};

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <ImageEditorContextProvider>
        <ToolbarContextProvider>
          <Content />
        </ToolbarContextProvider>
      </ImageEditorContextProvider>
    </ChakraProvider>
  );
}
