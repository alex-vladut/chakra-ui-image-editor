import React from "react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";

import UploadButton from "./UploadButton";
import SaveButton from "./SaveButton";
import ZoomControl from "./ZoomControl";
import { UndoButton } from "./UndoButton";
import { RedoButton } from "./RedoButton";
import { useCanvasContext } from "../../hooks/useCanvasContext";

const Header: React.FC = () => {
  const { mode } = useCanvasContext();
  return (
    <header className={`header ${mode ? "header_toolbar-open" : ""}`}>
      <div className="header__items">
        <div className="header__items-group">
          <div className="header__item">
            <UndoButton />
          </div>
          <div className="header__item">
            <RedoButton />
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
            <ColorModeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
