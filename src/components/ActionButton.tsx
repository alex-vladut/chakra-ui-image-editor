import {
  forwardRef,
  IconButton,
  IconButtonProps,
  Tooltip,
  TooltipProps,
} from "@chakra-ui/react";

export const ActionButton = forwardRef<
  IconButtonProps & Pick<TooltipProps, "placement">,
  "button"
>((props, ref) => {
  const { placement = "bottom", "aria-label": label } = props;

  return (
    <Tooltip label={label} aria-label={label} placement={placement}>
      <IconButton ref={ref} size="sm" {...props} />
    </Tooltip>
  );
});
