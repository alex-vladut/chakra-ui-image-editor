import React from "react";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Close } from "../icons";

import { ToolbarCrop } from "./ToolbarCrop";

const Toolbar: React.FC = () => {
  const { isOpen, close } = useToolbarContext();

  return isOpen ? (
    <section className={`toolbar custom-scrollbar`}>
      <div className="toolbar__header">
        <h4 className="toolbar__title">Crop</h4>
        <Close
          onClick={() => {
            close();
          }}
        />
      </div>
      <ToolbarCrop />
    </section>
  ) : null;
};

export default Toolbar;
