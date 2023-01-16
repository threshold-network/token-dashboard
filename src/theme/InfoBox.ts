import { mode } from "@chakra-ui/theme-tools"

export const InfoBox = {
  defaultProps: {
    variant: "base",
  },
  baseStyle: {
    mt: 4,
    p: 4,
    borderRadius: "md",
    mb: 2,
  },
  variants: {
    modal: (props: any) => ({
      background: mode("gray.50", "gray.800")(props),
      padding: 4,
      marginTop: 0,
    }),
    base: (props: any) => ({
      background: mode("gray.50", "gray.700")(props),
    }),
  },
}
