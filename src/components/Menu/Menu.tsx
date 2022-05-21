import { ReactElement } from "react";
import { useColorModeValue, VStack } from "@chakra-ui/react";

import { ActionButton } from "../ActionButton";
import { Crop, Flip, Filter, Pencil } from "../../icons";
import { Mode, useCanvasContext } from "../../hooks/useCanvasContext";

const items: { icon: ReactElement; name: Mode }[] = [
  {
    icon: <Crop />,
    name: "crop",
  },
  {
    icon: <Flip />,
    name: "adjust",
  },
  { icon: <Pencil />, name: "drawing" },
  // { icon: <Shapes />, name: "shapes" },
  // { icon: <Text />, name: "text" },
  {
    icon: <Filter />,
    name: "filters",
  },
];

const Menu: React.FC = () => {
  const { mode, startSession } = useCanvasContext();
  const bgColor = useColorModeValue("gray.50", "gray.700");

  return (
    <VStack
      as="section"
      h="full"
      align="center"
      justify="center"
      p={2}
      bgColor={bgColor}
    >
      {items.map((item, index) => (
        <ActionButton
          key={index}
          aria-label={item.name}
          icon={item.icon}
          size="lg"
          variant="ghost"
          placement="right"
          isActive={mode === item.name}
          onClick={() => startSession(item.name)}
        />
      ))}
    </VStack>
  );
};

export default Menu;
