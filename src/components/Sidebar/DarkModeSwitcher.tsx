import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { useSidebar } from "../../hooks/useSidebar"
import { ColorMode } from "../../enums/project"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { isOpen } = useSidebar()

  return (
    <IconButton
      variant="side-bar"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={
        <Icon
          boxSize={isOpen ? "16px" : "24px"}
          as={colorMode === ColorMode.LIGHT ? MoonIcon : SunIcon}
        />
      }
    />
  )
}

export default DarkModeSwitcher
