import { Tooltip } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Mode, useCanvasContext } from "../hooks/useCanvasContext";
import { Crop } from "../icons";
import { Flip } from "../icons";
import { Pencil } from "../icons";
import { Shapes } from "../icons";
import { Text } from "../icons";
import { Filter } from "../icons";

const Menu: React.FC = () => {
  const { mode, startSession } = useCanvasContext();

  const items: { icon: ReactNode; name: Mode }[] = [
    {
      icon: <Crop />,
      name: "crop",
    },
    {
      icon: <Flip />,
      name: "adjust",
    },
    { icon: <Pencil />, name: "drawing" },
    { icon: <Shapes />, name: "shapes" },
    { icon: <Text />, name: "text" },
    {
      icon: <Filter />,
      name: "filters",
    },
  ];
  return (
    <section className="menu">
      <div className="menu__wrapper">
        {items.map((item, index) => (
          <Tooltip key={index} label={item.name} placement="right">
            <div
              className={`menu__item ${
                mode === item.name ? "menu__item_active" : ""
              }`}
              onClick={() => startSession(item.name)}
            >
              {item.icon}
            </div>
          </Tooltip>
        ))}
      </div>
    </section>
  );
};

export default Menu;
