import { ChangeEvent, useEffect, useState } from "react";
import { useCropperContext } from "../hooks/useCropperContext";
import { useImageEditorContext } from "../hooks/useImageEditorContext";
import { useToolbarContext } from "../hooks/useToolbarContext";
import { Close, Crop } from "../icons";

export const ToolbarCrop: React.FC = () => {
  const { setMode } = useImageEditorContext();
  const { close } = useToolbarContext();
  const {
    cropZoneWidth,
    cropZoneHeight,
    ratioName,
    widthIndicator,
    heightIndicator,
    setRatio,
    setCropZoneWidth,
    setCropZoneHeight,
    crop,
  } = useCropperContext();
  const [width, setWidth] = useState(cropZoneWidth);
  const [height, setHeight] = useState(cropZoneHeight);

  const onClose = () => {
    close();
    setMode();
  };

  const updateWidth = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || width;
    setWidth(value);
  };

  const updateHeight = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || height;
    setHeight(value);
  };

  useEffect(() => {
    setWidth(widthIndicator);
    setHeight(heightIndicator);
  }, [widthIndicator, heightIndicator]);

  const aspectRatioList = [
    { name: "custom", value: null },
    { name: "1:1", value: { width: 1, height: 1 } },
    { name: "3:2", value: { width: 3, height: 2 } },
    { name: "4:3", value: { width: 4, height: 3 } },
    { name: "5:4", value: { width: 5, height: 4 } },
    { name: "7:5", value: { width: 7, height: 5 } },
    { name: "16:9", value: { width: 16, height: 9 } },
  ];

  return (
    <>
      <div className="toolbar__header">
        <h3 className="toolbar__title">Crop</h3>
        <Close onClick={onClose} />
      </div>
      <div className="toolbar__content">
        <div className="toolbar__form">
          <p className="toolbar__label">Width</p>
          <input
            type="number"
            className="toolbar__input"
            value={Math.floor(width)}
            onChange={updateWidth}
            onBlur={() => setCropZoneWidth(width)}
            min={0}
          />
          <p className="toolbar__label">Height</p>
          <input
            type="number"
            className="toolbar__input"
            value={Math.floor(height)}
            onChange={updateHeight}
            onBlur={() => setCropZoneHeight(height)}
            min={0}
          />
        </div>

        <div className="toolbar__options">
          {aspectRatioList.map((aspectRatio: any, index: number) => {
            return (
              <div
                key={index}
                className={`toolbar__option ${
                  ratioName === aspectRatio.name ? "toolbar__option_active" : ""
                }`}
                onClick={() => setRatio(aspectRatio)}
              >
                <Crop />
                <p className="toolbar__option-title">{aspectRatio.name}</p>
              </div>
            );
          })}
        </div>

        <button className="toolbar__crop-btn" onClick={() => crop(true)}>
          Crop
        </button>
      </div>
    </>
  );
};
