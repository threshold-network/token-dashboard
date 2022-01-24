import { mode } from "@chakra-ui/theme-tools"

export const InfoBox = {
  defaultProps: {
    varaint: "base",
  },
  baseStyle: {
    mt: 4,
    px: 6,
    py: 2,
    borderRadius: "md",
    mb: 2,
  },
  variants: {
    modal: (props: any) => ({
      background: mode("gray.50", "gray.800")(props),
      padding: props.padding || 4,
    }),
    base: (props: any) => ({
      background: mode("gray.50", "gray.700")(props),
    }),
  },
}
