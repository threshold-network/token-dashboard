import { anatomy, mode, PartsStyleFunction } from "@chakra-ui/theme-tools"

const parts = anatomy("AnnouncementBanner").parts(
  "container",
  "closeButton",
  "image",
  "subContainer",
  "preTitle",
  "title",
  "ctaButton"
)

const baseStyle: PartsStyleFunction<typeof parts> = (props) => {
  return {
    container: {
      w: "100%",
      display: props.isOpen ? "block" : "none",
      position: "relative",
      px: "16",
      mb: 4,
      // TODO: update to gradient.4 when components PR is merged
      // https://github.com/threshold-network/components/pull/25
      bg: mode(
        "linear-gradient(to bottom right, #F0E1FF, #D7C9FF)",

        // TODO: Figure out if this is a new color in the DS (gray.1000 ?)
        "#13171B"
      )(props),
    },
    closeButton: {
      position: "absolute",
      right: "14px",
      top: "12px",
    },
    subContainer: {
      alignItems: "center",
      bg: "inherit",
    },
    image: {
      maxW: props.size == "sm" ? "146px" : "280px",
    },
    preTitle: {
      color: mode(undefined, "brand.300")(props),
      background: mode("gradient.3", undefined)(props),
      backgroundClip: mode("text", undefined)(props),
      textFillColor: mode("transparent", undefined)(props),
    },
    title: {
      textAlign: { base: "center", xl: "unset" },
      maxW: "460px",
      color: mode("gray.700", "white")(props),
    },
    ctaButton: {
      w: { base: "100%", xl: "auto" },
      mt: { base: 12, xl: "auto" },
      marginInlineStart: { base: "8", xl: "auto !important" },
      px: { base: 4, md: 12 },
    },
  }
}

export const AnnouncementBanner = {
  parts: parts.keys,
  baseStyle,
}
