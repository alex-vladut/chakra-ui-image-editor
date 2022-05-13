import React from "react";
import { Button, HStack } from "@chakra-ui/react";

import { ZoomControl } from "./ZoomControl";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import { ActionButton } from "../ActionButton";
import { FileInput } from "../FileInput";
import { Redo, Undo, Upload } from "../../icons";
import { useCanvasContext } from "../../hooks/useCanvasContext";
import { useUploadImageHandler } from "../../handlers/useUploadImageHandler";

const Header: React.FC = () => {
  const { canvas, hasUndo, undo, hasRedo, redo } = useCanvasContext();
  const upload = useUploadImageHandler();

  return (
    <HStack as="header" align="center" w="full" p={2}>
      <HStack>
        <ActionButton
          aria-label="Undo"
          icon={<Undo />}
          variant="ghost"
          size="lg"
          isDisabled={!hasUndo}
          onClick={undo}
        />
        <ActionButton
          aria-label="Redo"
          icon={<Redo />}
          variant="ghost"
          size="lg"
          isDisabled={!hasRedo}
          onClick={redo}
        />
      </HStack>

      <ZoomControl />

      <HStack>
        <FileInput onChange={onUpload} accept="image/*">
          <ActionButton
            aria-label="Upload"
            icon={<Upload />}
            variant="ghost"
            size="lg"
          />
        </FileInput>
        <Button variant="outline" rounded="2xl" onClick={onSave}>
          Save
        </Button>
        <ColorModeSwitcher />
      </HStack>
    </HStack>
  );

  function onSave() {
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
  }

  function onUpload(files: File[]) {
    const reader = new FileReader();
    reader.onloadend = () => {
      upload(String(reader.result));
    };
    reader.readAsDataURL(files[0]);
  }
};

export default Header;
