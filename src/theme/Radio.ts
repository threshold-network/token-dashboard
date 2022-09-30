import { radioAnatomy } from "@chakra-ui/anatomy"
import { PartsStyleFunction } from "@chakra-ui/theme-tools"

const baseStyle: PartsStyleFunction<typeof radioAnatomy> = () => {
  return {
    control: {
      _checked: {
        backgroundColor: "brand.500",
        _hover: {
          backgroundColor: "brand.500",
        },
      },
    },
    label: {
      width: "100%",
    },
  }
}

export const Radio = {
  baseStyle,
}
