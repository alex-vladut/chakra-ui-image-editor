import { Tooltip } from "@chakra-ui/react";
import React from "react";

import { Minus, Plus } from "../icons";
import { useCanvasContext } from "../hooks/useCanvasContext";

const ZoomControl: React.FC = () => {
  const { zoomRatio, zoomIn, zoomOut } = useCanvasContext();

  return (
    <div className="zoom-control">
      <button className="zoom-control__zoom-in" onClick={zoomIn}>
        <Tooltip label="Zoom In" placement="top">
          <Plus />
        </Tooltip>
      </button>
      <p className="zoom-control__value">{`${Math.floor(zoomRatio * 100)}%`}</p>
      <button className="zoom-control__zoom-out" onClick={zoomOut}>
        <Tooltip label="Zoom Out" placement="top">
          <Minus />
        </Tooltip>
      </button>
    </div>
  );
};

export default ZoomControl;
