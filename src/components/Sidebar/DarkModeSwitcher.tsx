import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"
import { useSidebar } from "../../hooks/useSidebar"

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
          as={colorMode === "light" ? MoonIcon : SunIcon}
        />
      }
    />
  )
}

export default DarkModeSwitcher
