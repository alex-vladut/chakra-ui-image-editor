import { Tooltip } from "@chakra-ui/react";
import React from "react";

import { Minus, Plus } from "../icons";
import { useCanvasContext } from "../hooks/useCanvasContext";

const ZoomControl: React.FC = () => {
  const { zoomRatio, zoomIn, zoomOut } = useCanvasContext();

  return (
    <div className="zoom">
      <button className="zoom-in" onClick={zoomIn}>
        <Tooltip label="Zoom In" placement="top">
          <Plus />
        </Tooltip>
      </button>
      <p>{`${Math.floor(zoomRatio * 100)}%`}</p>
      <button className="zoom-out" onClick={zoomOut}>
        <Tooltip label="Zoom Out" placement="top">
          <Minus />
        </Tooltip>
      </button>
    </div>
  );
};

export default ZoomControl;
