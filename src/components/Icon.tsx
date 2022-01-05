import { FC } from "react"
import { As, Icon as ChakraIcon, IconProps } from "@chakra-ui/react"
import IconEnum from "../enums/icon"
import iconMap from "../static/icons/iconMap"

const Icon: FC<IconProps & { as: As | IconEnum }> = ({ as, ...props }) => {
  if (Object.values(IconEnum).includes(as as IconEnum)) {
    // @ts-ignore
    return <ChakraIcon {...props} as={iconMap[as as IconEnum]} />
  }

  // @ts-ignore
  return <ChakraIcon {...props} />
}

export default Icon
