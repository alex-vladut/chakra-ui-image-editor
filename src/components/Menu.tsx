import { Tooltip } from "@chakra-ui/react";
import { Crop } from "../icons";
import { Flip } from "../icons";
import { Pencil } from "../icons";
import { Shapes } from "../icons";
import { Text } from "../icons";
import { Filter } from "../icons";

interface IMenuItems {
  icon: React.ReactElement;
  name: string;
}

const Menu: React.FC = () => {
  const items: IMenuItems[] = [
    { icon: <Crop />, name: "Crop" },
    { icon: <Flip />, name: "Flip" },
    { icon: <Pencil />, name: "Draw" },
    { icon: <Shapes />, name: "Shapes" },
    { icon: <Text />, name: "Text" },
    { icon: <Filter />, name: "Filter" },
  ];
  return (
    <section className="menu">
      {items.map((item, index) => (
        <Tooltip key={index} label={item.name}>
          <div className="menu__item">{item.icon}</div>
        </Tooltip>
      ))}
    </section>
  );
};

export default Menu;
