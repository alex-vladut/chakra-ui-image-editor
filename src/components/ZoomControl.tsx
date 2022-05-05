import { Tooltip } from "@chakra-ui/react";
import React from "react";

import { useImageEditorContext } from "../hooks/useImageEditorContext";

import { Minus, Plus } from "../icons";

const ZoomControl: React.FC = () => {
  const { imageUrl, scale, mode, zoomIn, zoomOut } = useImageEditorContext();

  return imageUrl && !mode ? (
    <div className="zoom">
      <button className="zoom-in" onClick={zoomIn}>
        <Tooltip label="Zoom In" placement="top">
          <Plus />
        </Tooltip>
      </button>
      <p>{`${Math.floor(scale * 100)}%`}</p>
      <button className="zoom-out" onClick={zoomOut}>
        <Tooltip label="Zoom Out" placement="top">
          <Minus />
        </Tooltip>
      </button>
    </div>
  ) : null;
};

export default ZoomControl;
