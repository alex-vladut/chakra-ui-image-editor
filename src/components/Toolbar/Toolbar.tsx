import React from "react";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { Close } from "../../icons";
import { ToolbarAdjust } from "./ToolbarAdjust";

import { ToolbarCrop } from "./ToolbarCrop";
import { ToolbarFilters } from "./ToolbarFilters";

const contentMap: { [name: string]: JSX.Element } = {
  // search: <ToolbarSearch />,
  crop: <ToolbarCrop />,
  adjust: <ToolbarAdjust />,
  // drawing: <ToolbarDrawing />,
  // text: <ToolbarText />,
  filters: <ToolbarFilters />,
};

const Toolbar: React.FC = () => {
  const { mode, stopSession } = useCanvasContext();

  return mode ? (
    <section className={`toolbar custom-scrollbar`}>
      <div className="toolbar__header">
        <h4 className="toolbar__title">{mode}</h4>
        <Close onClick={stopSession} />
      </div>
      {contentMap[mode]}
    </section>
  ) : null;
};

export default Toolbar;
