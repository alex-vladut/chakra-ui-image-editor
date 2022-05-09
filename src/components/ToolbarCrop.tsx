import { ChangeEvent, useEffect, useState } from "react";
import { useCropHandler } from "../handlers/useCropHandler";
import { useCanvasContext } from "../hooks/useCanvasContext";

const aspectRatioList = [
  { name: "custom", value: null },
  { name: "1:1", value: { width: 1, height: 1 } },
  { name: "3:2", value: { width: 3, height: 2 } },
  { name: "4:3", value: { width: 4, height: 3 } },
  { name: "5:4", value: { width: 5, height: 4 } },
  { name: "7:5", value: { width: 7, height: 5 } },
  { name: "16:9", value: { width: 16, height: 9 } },
];

export const ToolbarCrop: React.FC = () => {
  const [activeInput, setActiveInput] = useState<"height" | "width" | null>(
    null
  );
  const { setZoomRatio } = useCanvasContext();
  const {
    cropInfo,
    open,
    crop,
    close,
    updateWidth,
    updateHeight,
    updateRatio,
  } = useCropHandler();
  const [ratioName, setRatioName] = useState("custom");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const onChangeWidth = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || width;
    setWidth(value);
    updateWidth(value);
  };

  const onChangeHeight = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || height;
    setHeight(value);
    updateHeight(value);
  };

  useEffect(() => {
    setZoomRatio(1);
    open();

    return () => {
      close();
    };
  }, [close, open, setZoomRatio]);

  useEffect(() => {
    if (!cropInfo) return;

    if (!activeInput) {
      setWidth(cropInfo.width);
      setHeight(cropInfo.height);
    } else if (activeInput === "width") {
      setHeight(cropInfo.height);
    } else if (activeInput === "height") {
      setWidth(cropInfo.width);
    }
  }, [activeInput, cropInfo]);

  return (
    <div className="toolbar__content">
      <div className="toolbar__form">
        <p className="toolbar__form-label">Width</p>
        <input
          type="number"
          className="toolbar__form-input"
          value={Math.floor(width)}
          min={0}
          onChange={onChangeWidth}
          onFocus={() => {
            setActiveInput("width");
          }}
          onBlur={() => {
            if (!cropInfo) return;
            setActiveInput(null);
            // updating input field to reflect the ratio
            setWidth(cropInfo.width);
          }}
        />
        <p className="toolbar__form-label">Height</p>
        <input
          type="number"
          className="toolbar__form-input"
          value={Math.floor(height)}
          min={0}
          onChange={onChangeHeight}
          onFocus={() => {
            setActiveInput("height");
          }}
          onBlur={() => {
            if (!cropInfo) return;
            setActiveInput(null);
            setHeight(cropInfo.height);
          }}
        />
      </div>

      <div className="toolbar__block">
        <div className="toolbar__divider"></div>
        <p className="toolbar__block-title">Aspect Ratio</p>
        <div className="toolbar__options">
          {aspectRatioList.map((aspectRatio, index) => {
            return (
              <div
                key={index}
                className={`toolbar__option ${
                  ratioName === aspectRatio.name ? "toolbar__option_active" : ""
                }`}
                onClick={() => {
                  setRatioName(aspectRatio.name);
                  updateRatio(aspectRatio.value);
                }}
              >
                {aspectRatio.name}
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="toolbar__action-btn"
        onClick={() => {
          crop();
          close();
        }}
      >
        Apply
      </button>
    </div>
  );
};
