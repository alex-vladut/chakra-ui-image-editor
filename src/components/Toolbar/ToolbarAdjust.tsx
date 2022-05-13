import {
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import React from "react";
import { useCanvasContext } from "../../hooks/useCanvasContext";

import { Left } from "../../icons";
import { Right } from "../../icons";
import { FlipX } from "../../icons";
import { FlipY } from "../../icons";

export const ToolbarAdjust: React.FC = () => {
  const {
    angle,
    flipX,
    flipY,
    toggleFlipX,
    toggleFlipY,
    rotate,
    rotateLeft,
    rotateRight,
  } = useCanvasContext();

  return (
    <>
      <div className="toolbar__content">
        <div className="toolbar__options toolbar__options_one-col">
          <div
            className={`toolbar__option ${
              flipX ? "toolbar__option_active" : ""
            }`}
            onClick={toggleFlipX}
          >
            <FlipX /> <p> Flip X</p>
          </div>

          <div
            className={`toolbar__option ${
              flipY ? "toolbar__option_active" : ""
            }`}
            onClick={toggleFlipY}
          >
            <FlipY /> <p> Flip Y</p>
          </div>

          <div className="toolbar__option" onClick={rotateLeft}>
            <Left /> <p> Rotate Left</p>
          </div>

          <div className="toolbar__option" onClick={rotateRight}>
            <Right /> <p> Rotate Right</p>
          </div>
        </div>

        <div className="toolbar__block">
          <div className="slider__header">
            <p className="slider__title">Angle</p>
            <span className="slider__input">{angle}</span>
          </div>

          <Slider
            value={angle}
            min={-360}
            max={360}
            defaultValue={0}
            onChange={rotate}
          >
            <SliderMark value={-360} mt="1" ml="-2.5" fontSize="sm">
              -360
            </SliderMark>
            <SliderMark value={-180} mt="1" ml="-2.5" fontSize="sm">
              -180
            </SliderMark>
            <SliderMark value={0} mt="1" ml="-2.5" fontSize="sm">
              0
            </SliderMark>
            <SliderMark value={180} mt="1" ml="-2.5" fontSize="sm">
              180
            </SliderMark>
            <SliderMark value={360} mt="1" ml="-2.5" fontSize="sm">
              360
            </SliderMark>
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </div>
      </div>
    </>
  );
};
