import { Tooltip } from "@chakra-ui/react";
import React from "react";
import { ColorModeSwitcher } from "../ColorModeSwitcher";
import { Undo } from "../icons";
import { Redo } from "../icons";

import UploadButton from "./UploadButton";
import SaveButton from "./SaveButton";
import { useToolbarContext } from "../hooks/useToolbarContext";
import ZoomControl from "./ZoomControl";

const Header: React.FC = () => {
  const { isOpen } = useToolbarContext();
  return (
    <header className={`header ${isOpen ? "header_toolbar-open" : ""}`}>
      <div className="header__items">
        <div className="header__items-group">
          <div className="header__item">
            <Tooltip label="Undo" placement="bottom">
              <Undo />
            </Tooltip>
          </div>
          <div className="header__item">
            <Tooltip label="Redo" placement="bottom">
              <Redo />
            </Tooltip>
          </div>
        </div>
        <div className="header__items-group">
          <div className="header__item">
            <ZoomControl />
          </div>
        </div>
        <div className="header__items-group">
          <div className="header__item">
            <UploadButton />
          </div>
          <div className="header__item">
            <SaveButton />
          </div>
          <div className="header__item">
            <ColorModeSwitcher justifySelf="flex-end" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
