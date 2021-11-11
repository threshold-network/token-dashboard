import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      variant="ghost"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={<Icon as={colorMode === "light" ? MoonIcon : SunIcon} />}
    />
  )
}

export default DarkModeSwitcher
