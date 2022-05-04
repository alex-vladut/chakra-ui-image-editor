import { ChakraProvider, theme } from "@chakra-ui/react";
import Menu from "./components/Menu";
import Header from "./components/Header";

export const App = () => (
  <ChakraProvider theme={theme}>
    <div className="app">
      <Header />
      <Menu />
    </div>
  </ChakraProvider>
);
