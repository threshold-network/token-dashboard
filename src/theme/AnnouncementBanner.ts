import { anatomy, mode, PartsStyleFunction } from "@chakra-ui/theme-tools"

const parts = anatomy("AnnouncementBanner").parts(
  "container",
  "closeButton",
  "image",
  "subContainer",
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

const variants = {
  secondary: (props: any) => ({
    container: {
      background: mode("brand.50", "gray.800")(props),
    },
  }),
}

export const AnnouncementBanner = {
  parts: [
    "container",
    "closeButton",
    "image",
    "subContainer",
    "title",
    "ctaButton",
  ],
  baseStyle,
  variants,
}
