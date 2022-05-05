import { Tooltip } from "@chakra-ui/react";
import { useImageEditorContext } from "../hooks/useImageEditorContext";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Crop } from "../icons";
import { Flip } from "../icons";
import { Pencil } from "../icons";
import { Shapes } from "../icons";
import { Text } from "../icons";
import { Filter } from "../icons";

const Menu: React.FC = () => {
  const { setMode } = useImageEditorContext();
  const { type, toggle } = useToolbarContext();
  const items = [
    {
      icon: <Crop />,
      name: "Crop",
      handler: () => {
        toggle("Crop");
        setMode("crop");
      },
    },
    {
      icon: <Flip />,
      name: "Rotate",
      handler: () => toggle("Rotate"),
    },
    { icon: <Pencil />, name: "Draw", handler: () => {} },
    { icon: <Shapes />, name: "Shapes", handler: () => {} },
    { icon: <Text />, name: "Text", handler: () => {} },
    { icon: <Filter />, name: "Filter", handler: () => {} },
  ];
  return (
    <section className="menu">
      {items.map((item, index) => (
        <Tooltip key={index} label={item.name}>
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
    </section>
  );
};

export default Menu;
