import React from "react";
import { Tooltip } from "@chakra-ui/react";

import { Save } from "../icons";
import { useCanvasContext } from "../hooks/useCanvasContext";

const SaveButton: React.FC = () => {
  const { canvas } = useCanvasContext();

  const saveImage = () => {
    if (!canvas) return;

    const randomNum = Math.floor(Math.random() * 1000);
    const fileName = `image-${randomNum}.jpg`;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvas.toDataURL({ format: "image/jpeg" });
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    link.remove();
  };

  return (
    <Tooltip label="Save" placement="bottom">
      <Save onClick={saveImage} />
    </Tooltip>
  );
};

export default SaveButton;
