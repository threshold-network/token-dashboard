import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { ColorMode } from "../../enums/project"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      w="100%"
      variant="side-bar"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={<Icon as={colorMode === ColorMode.LIGHT ? MoonIcon : SunIcon} />}
    />
  )
}

export default DarkModeSwitcher
