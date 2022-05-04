import { ChakraProvider, theme } from "@chakra-ui/react";
import Menu from "./components/Menu";
import Header from "./components/Header";
import { ImageEditorContextProvider } from "./hooks/useImageEditorContext";
import Canvas from "./components/Canvas";

export const App = () => (
  <ChakraProvider theme={theme}>
    <ImageEditorContextProvider>
      <div className="app">
        <Header />
        <Menu />
        <Canvas />
      </div>
    </ImageEditorContextProvider>
  </ChakraProvider>
);
