import {
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
} from "@chakra-ui/react";
import { hexToRgb } from "../helpers/colorConverter";
import { useCanvasContext } from "../hooks/useCanvasContext";
import { ColorPicker } from "./ColorPicker";

export const ToolbarFilters = () => {
  const {
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    hue,
    setHue,
    pixelate,
    setPixelate,
    noise,
    setNoise,
    invert,
    setInvert,
    blur,
    setBlur,
    tintOpacity,
    setTintOpacity,
    tintColor,
    setTintColor,
    resetFilters,
  } = useCanvasContext();
  return (
    <div className="toolbar__content">
      <div className="toolbar__block">
        <div className="slider__header">
          <p className="slider__title">Brightness</p>
          <span className="slider__input">{Math.round(brightness * 250)}</span>
        </div>
        <Slider
          title="Brightness"
          value={Math.round(brightness * 250)}
          min={-100}
          max={100}
          onChange={(value) => {
            setBrightness(value / 250);
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
          <span className="slider__input">{Math.round(contrast * 250)}</span>
        </div>
        <Slider
          title="Contrast"
          value={Math.round(contrast * 250)}
          min={-100}
          max={100}
          onChange={(value) => {
            setContrast(value / 250);
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
          <span className="slider__input">{Math.round(saturation * 100)}</span>
        </div>
        <Slider
          title="Saturation"
          value={Math.round(saturation * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setSaturation(value / 100);
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
          <span className="slider__input">{Math.round(hue * 100)}</span>
        </div>
        <Slider
          title="Hue"
          value={Math.round(hue * 100)}
          min={-100}
          max={100}
          onChange={(value) => {
            setHue(value / 100);
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
          <span className="slider__input">{pixelate}</span>
        </div>
        <Slider
          title="Pixelate"
          value={pixelate}
          min={1}
          max={100}
          onChange={setPixelate}
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
          <span className="slider__input">{noise}</span>
        </div>
        <Slider
          title="Noise"
          value={noise}
          min={0}
          max={100}
          onChange={setNoise}
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
          <span className="slider__input">{Math.round(invert * 100)}</span>
        </div>
        <Slider
          title="Invert"
          value={Math.round(invert * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setInvert(value / 100);
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
          <span className="slider__input">{Math.round(blur * 100)}</span>
        </div>
        <Slider
          title="Blur"
          value={Math.round(blur * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setBlur(value / 100);
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
          <span className="slider__input">{Math.round(tintOpacity * 100)}</span>
        </div>
        <Slider
          title="Tint"
          value={Math.round(tintOpacity * 100)}
          min={0}
          max={100}
          onChange={(value) => {
            setTintOpacity(value / 100);
          }}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb />
        </Slider>
      </div>

      <ColorPicker
        currentColorCode={hexToRgb(tintColor)}
        callback={(hex) => {
          setTintColor(hex);
          setTintOpacity(1);
        }}
        output="hex"
      />
      <button className="toolbar__action-btn" onClick={resetFilters}>
        Reset
      </button>
    </div>
  );
};
