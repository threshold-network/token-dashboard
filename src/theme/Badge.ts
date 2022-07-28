import { SystemStyleFunction } from "@chakra-ui/theme-tools"
import { defaultTheme } from "@threshold-network/components"

// TODO: probably we should add a new color schema: `magic` and use
// `colorSchema` prop instead of `variant` becasue `magic` can be `solid` and
// `otuline`. See:
// https://www.figma.com/file/zZi2fYDUjWEMPQJWAt8VWv/Threshold-DS?node-id=2356%3A20781
const variantMagic: SystemStyleFunction = (props) => {
  return {
    background: "linear-gradient(120.19deg, #BD30FF 3.32%, #7D00FF 95.02%)",
    color: "white",
  }
}

const variants = {
  ...defaultTheme.components.Badge.variants,
  magic: variantMagic,
}

export const Badge = {
  ...defaultTheme.components.Badge,
  variants,
}
