import { mode } from "@chakra-ui/theme-tools"

export const DetailedLinkListItem = {
  parts: ["container", "image", "title", "subTitle", "link"],
  baseStyle: (props: any) => {
    return {
      container: {
        backgroundColor: mode("gray.50", "gray.800")(props),
        padding: 4,
        borderRadius: "6px",
        border: mode("none", "1px solid")(props),
        borderColor: "gray.700",
        justifyContent: "space-between",
      },
      image: {
        w: "48px",
        h: "48px",
        borderRadius: "6px",
        mr: 4,
      },
      title: {
        color: mode("gray.700", "white")(props),
      },
      subTitle: {
        color: mode("gray.500", "white")(props),
      },
      link: {
        color: mode("gray.700", "white")(props),
      },
      imageFallback: {
        size: "48px",
        bg: "brand.500",
        color: "white",
        borderRadius: "6px",
        mr: 4,
      },
    }
  },
}
