import { mode } from "@chakra-ui/theme-tools"

export const Card = {
  baseStyle: (props: any) => ({
    background: mode("white", "gray.800")(props),
    alignItems: "center",
    gap: 6,
    border: "1px solid",
    borderColor: mode("gray.100", "gray.700")(props),
    boxShadow: mode("md", "none")(props),
    borderRadius: "lg",
    padding: 6,
    width: "100%",
  }),
}
