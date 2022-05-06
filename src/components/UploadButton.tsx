import { useRef, ChangeEvent } from "react";
import { Button, Tooltip } from "@chakra-ui/react";

import { Upload } from "../icons";
import { useUploadImageHandler } from "../handlers/useUploadImageHandler";
import { useCropHandler } from "../handlers/useCropHandler";
import { useCanvasContext } from "../hooks/useCanvasContext";

const UploadButton = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const { setZoomRatio } = useCanvasContext();
  const { open } = useCropHandler();
  const upload = useUploadImageHandler();

  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      upload(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const clickHandler = () => {
    if (inputFileRef && inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  return (
    <>
      <Tooltip label="Upload an image" placement="bottom">
        <Upload onClick={clickHandler} />
      </Tooltip>
      <Button onClick={onOpen}>Crop</Button>
      <input
        ref={inputFileRef}
        type="file"
        className="header__upload-image-input"
        onChange={uploadImage}
        accept="image/jpeg"
        hidden
      />
    </>
  );

  function onOpen() {
    setZoomRatio(1);
    open();
  }
};

export default UploadButton;
