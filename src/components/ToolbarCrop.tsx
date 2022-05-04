import { IconButton } from "@chakra-ui/react";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Close } from "../icons";

export const ToolbarCrop: React.FC = () => {
  const { type, close } = useToolbarContext();

  return (
    <>
      <div className="toolbar__header">
        <h3 className="toolbar__title">{type}</h3>
        <IconButton aria-label="Close" icon={<Close />} onClick={close} />
      </div>
      <div className="toolbar__content">
        <div className="toolbar__form">
          <p className="toolbar__label">Width</p>
          <input type="number" className="toolbar__input" />
          <p className="toolbar__label">Height</p>
          <input type="number" className="toolbar__input" />
        </div>
      </div>
    </>
  );
};
