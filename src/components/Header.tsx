import { Tooltip } from "@chakra-ui/react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Refresh } from "../icons";
import { Undo } from "../icons";
import { Redo } from "../icons";
import { Search } from "../icons";
import { Upload } from "../icons";
import { Save } from "../icons";

interface IHeaderItems {
  icon: React.ReactElement;
  name: string;
}

const Header: React.FC = () => {
  const items: IHeaderItems[] = [
    { icon: <Refresh />, name: "Refresh" },
    { icon: <Undo />, name: "Undo" },
    { icon: <Redo />, name: "Redo" },
    { icon: <Search />, name: "Upload an image from Unsplash" },
    { icon: <Upload />, name: "Upload an image" },
    { icon: <Save />, name: "Save" },
  ];
  return (
    <header className="header">
      <div className="header__items">
        {items.map((item, index) => (
          <Tooltip key={index} label={item.name}>
            <div className="header__item">{item.icon}</div>
            {index === 2 && <div className="separator"></div>}
          </Tooltip>
        ))}
        <ColorModeSwitcher justifySelf="flex-end" />
      </div>
    </header>
  );
};

export default Header;
