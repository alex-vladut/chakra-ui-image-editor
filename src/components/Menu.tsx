import { Tooltip } from "@chakra-ui/react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Crop } from "../icons";
import { Flip } from "../icons";
import { Pencil } from "../icons";
import { Shapes } from "../icons";
import { Text } from "../icons";
import { Filter } from "../icons";

const Menu: React.FC = () => {
  const { startSession } = useCanvasContext();
  const { type, toggle } = useToolbarContext();
  const items = [
    {
      icon: <Crop />,
      name: "Crop",
      handler: () => {
        toggle("Crop");
        startSession("crop");
      },
    },
    {
      icon: <Flip />,
      name: "Rotate",
      handler: () => {
        toggle("Rotate");
        startSession("adjust");
      },
    },
    { icon: <Pencil />, name: "Draw", handler: () => {} },
    { icon: <Shapes />, name: "Shapes", handler: () => {} },
    { icon: <Text />, name: "Text", handler: () => {} },
    {
      icon: <Filter />,
      name: "Filter",
      handler: () => {
        toggle("Effects");
        startSession("effects");
      },
    },
  ];
  return (
    <section className="menu">
      <div className="menu__wrapper">
        {items.map((item, index) => (
          <Tooltip key={index} label={item.name} placement="right">
            <div
              className={`menu__item ${
                type === item.name ? "menu__item_active" : ""
              }`}
              onClick={item.handler}
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
