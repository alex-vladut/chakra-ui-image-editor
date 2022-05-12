import React from "react";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Close } from "../icons";
import { ToolbarAdjust } from "./ToolbarAdjust";

import { ToolbarCrop } from "./ToolbarCrop";
import { ToolbarFilters } from "./ToolbarFilters";

const contentMap: { [name: string]: JSX.Element } = {
  // search: <ToolbarSearch />,
  crop: <ToolbarCrop />,
  adjust: <ToolbarAdjust />,
  // drawing: <ToolbarDrawing />,
  // text: <ToolbarText />,
  effects: <ToolbarFilters />,
};

const Toolbar: React.FC = () => {
  const { mode, stopSession } = useCanvasContext();
  const { isOpen, close } = useToolbarContext();

  return isOpen && mode ? (
    <section className={`toolbar custom-scrollbar`}>
      <div className="toolbar__header">
        <h4 className="toolbar__title">{mode}</h4>
        <Close
          onClick={() => {
            stopSession();
            close();
          }}
        />
      </div>
      {contentMap[mode]}
    </section>
  ) : null;
};

export default Toolbar;
