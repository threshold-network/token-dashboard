import { anatomy, mode, PartsStyleFunction } from "@chakra-ui/theme-tools"

const parts = anatomy("SecondaryAnnouncementBanner").parts(
  "container",
  "closeButton",
  "image",
  "subContainer",
  "title",
  "subTitle",
  "ctaButton"
)

const baseStyle: PartsStyleFunction<typeof parts> = (props) => {
  return {
    container: {
      w: "100%",
      display: props.isOpen ? "block" : "none",
      position: "relative",
      p: 4,
      pr: { base: 8, md: 4 },
      mb: 4,
      bg: mode("gray.50", "#2B3036")(props),
      borderColor: mode("gray.100", "gray.800")(props),
    },
    closeButton: {
      position: { base: "absolute", xl: "inherit" },
      right: 3.5,
      top: 3,
    },
    subContainer: {
      display: "flex",
      alignItems: "center",
      flexDirection: { base: "column", xl: "row" },
    },
    image: {
      maxW: "64px",
      mb: { base: 4, xl: 0 },
    },
    subTitle: {
      color: mode(undefined, "white")(props),
      textAlign: { base: "center", xl: "unset" },
    },
    title: {
      mb: { base: 4, xl: 0 },
      textAlign: { base: "center", xl: "unset" },
      color: mode(undefined, "white")(props),
    },
    ctaButton: {
      mr: 2,
      w: { base: "100%", xl: "auto" },
    },
  }
}

export const SecondaryAnnouncementBanner = {
  parts: parts.keys,
  baseStyle,
}
