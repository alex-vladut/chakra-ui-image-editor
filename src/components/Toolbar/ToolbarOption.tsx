import { Box, BoxProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type Props = {
  isActive?: boolean;
};

export function ToolbarOption(props: PropsWithChildren<Props & BoxProps>) {
  const { isActive = false, ...rest } = props;
  return (
    <Box
      w="full"
      cursor="pointer"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={4}
      fontWeight="semibold"
      borderColor={isActive ? "#3f3f3f" : "#eaeaea"}
      rounded="lg"
      borderWidth="4px"
      _hover={{
        opacity: "0.8",
      }}
      {...rest}
    />
  );
}
