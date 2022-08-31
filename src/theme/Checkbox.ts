import { checkboxAnatomy } from "@chakra-ui/anatomy"
import { PartsStyleFunction } from "@chakra-ui/theme-tools"

const baseStyle: PartsStyleFunction<typeof checkboxAnatomy> = () => {
  return {
    control: {
      _checked: {
        borderColor: "brand.500",
        _active: {
          borderColor: "brand.500",
        },
        backgroundColor: "brand.500",
        _hover: {
          backgroundColor: "brand.500",
          borderColor: "brand.500",
        },
      },
    },
    icon: {
      color: "white",
    },
  }
}

export const Checkbox = {
  baseStyle,
}
