import { Tooltip } from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Refresh } from "../icons";
import { Undo } from "../icons";
import { Redo } from "../icons";

import UploadButton from "./UploadButton";
import SaveButton from "./SaveButton";

const buttons = [
  <Tooltip label="Refresh" placement="bottom">
    <Refresh />
  </Tooltip>,
  <Tooltip label="Undo" placement="bottom">
    <Undo />
  </Tooltip>,
  <Tooltip label="Redo" placement="bottom">
    <Redo />
  </Tooltip>,
  <UploadButton />,
  <SaveButton />,
];

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__items">
        {buttons.map((button, index) => (
          <React.Fragment key={index}>
            <div className="header__item">{button}</div>
            {index === 2 && <div className="separator"></div>}
          </React.Fragment>
        ))}
        <ColorModeSwitcher justifySelf="flex-end" />
      </div>
    </header>
  );
};

export default Header;
