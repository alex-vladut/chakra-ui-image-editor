import React from "react";
import { Tooltip } from "@chakra-ui/react";

import { Save } from "../icons";
import { useImageEditorContext } from "../hooks/useImageEditorContext";

const SaveButton: React.FC = () => {
  const { canvasRef } = useImageEditorContext();

  const saveImage = () => {
    if (!canvasRef.current) return;

    const randomNum = Math.floor(Math.random() * 1000);
    const fileName = `image-${randomNum}.png`;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = canvasRef.current.toDataURL("image/png");
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
