import {
  SliderInnerTrackProps,
  useSliderContext,
  chakra,
  useStyles,
  forwardRef,
} from "@chakra-ui/react";
import { cx, valueToPercent } from "@chakra-ui/utils";

// https://codesandbox.io/s/chakra-ui--slider-from-center-n78sxr?file=/src/index.tsx:176-402
export const CenterSliderFilledTrack = forwardRef<SliderInnerTrackProps, "div">(
  (props, ref) => {
    const { getThumbProps, getInnerTrackProps } = useSliderContext();
    const styles = useStyles();
    const trackProps = getInnerTrackProps(undefined, ref);

    const markerProps = getThumbProps();
    const value = markerProps["aria-valuenow"] as number;
    const min = markerProps["aria-valuemin"] as number;
    const max = markerProps["aria-valuemax"] as number;
    const percent = valueToPercent(value, min, max);
    const width = percent - 50;
    const styleOverride =
      width < 0
        ? {
            left: "auto",
            right: "50%",
            width: `${-width}%`,
          }
        : {
            left: "50%",
            width: `${width}%`,
          };

    return (
      <chakra.div
        {...trackProps}
        // optional, color the track differently for positive and negative values
        bg={value < 0 ? "red.500" : "green.500"}
        style={{
          ...trackProps.style,
          ...styleOverride,
        }}
        className={cx("chakra-slider__filled-track", props.className)}
        __css={styles.filledTrack}
      />
    );
  }
);
