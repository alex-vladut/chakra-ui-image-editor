import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
} from "@chakra-ui/react";
import { hexToRgb } from "../helpers/colorConverter";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { ColorPicker } from "./ColorPicker";

export const ToolbarFilters = () => {
  const { filters, setFilterProperty, resetFilters } = useCanvasContext();
  return (
    <div className="toolbar__content">
      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Sharpen</p>
          <span className="slider__input">
            <Switch
              isChecked={filters.sharpen}
              onChange={() => {
                setFilterProperty("sharpen", !filters.sharpen);
              }}
            />
          </span>
        </div>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Brightness</p>
          <span className="slider__input">
            {Math.round(filters.brightness * 250)}
          </span>
        </div>
        <Slider
          title="Brightness"
          value={Math.round(filters.brightness * 250)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("brightness", value / 250);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Contrast</p>
          <span className="slider__input">
            {Math.round(filters.contrast * 250)}
          </span>
        </div>
        <Slider
          title="Contrast"
          value={Math.round(filters.contrast * 250)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("contrast", value / 250);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Saturation</p>
          <span className="slider__input">
            {Math.round(filters.saturation * 100)}
          </span>
        </div>
        <Slider
          title="Saturation"
          value={Math.round(filters.saturation * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("saturation", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Hue</p>
          <span className="slider__input">{Math.round(filters.hue * 100)}</span>
        </div>
        <Slider
          title="Hue"
          value={Math.round(filters.hue * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setFilterProperty("hue", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Pixelate</p>
          <span className="slider__input">{filters.pixelate}</span>
        </div>
        <Slider
          title="Pixelate"
          value={filters.pixelate}
          min={1}
          max={100}
          onChange={(value) => {
            setFilterProperty("pixelate", value);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Noise</p>
          <span className="slider__input">{filters.noise}</span>
        </div>
        <Slider
          title="Noise"
          value={filters.noise}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("noise", value);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Invert</p>
          <span className="slider__input">
            {Math.round(filters.invert * 100)}
          </span>
        </div>
        <Slider
          title="Invert"
          value={Math.round(filters.invert * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("invert", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Blur</p>
          <span className="slider__input">
            {Math.round(filters.blur * 100)}
          </span>
        </div>
        <Slider
          title="Blur"
          value={Math.round(filters.blur * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("blur", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Tint</p>
          <span className="slider__input">
            {Math.round(filters.tintOpacity * 100)}
          </span>
        </div>
        <Slider
          title="Tint"
          value={Math.round(filters.tintOpacity * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setFilterProperty("tintOpacity", value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <ColorPicker
        currentColorCode={hexToRgb(filters.tintColor)}
        callback={(hex) => {
          setFilterProperty("tintColor", hex);
          setFilterProperty("tintOpacity", 1);
        }}
        output="hex"
      />
      <button className="toolbar__action-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
};
