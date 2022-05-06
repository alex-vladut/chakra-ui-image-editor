import { useRef, ChangeEvent } from "react";
import { Tooltip } from "@chakra-ui/react";

import { Upload } from "../icons";
import { useUploadImageHandler } from "../handlers/useUploadImageHandler";

const UploadButton = () => {
  const inputFileRef = useRef<HTMLInputElement>(null);

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
};

export default UploadButton;
