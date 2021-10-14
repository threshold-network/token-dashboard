import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { MoonIcon, SunIcon } from "@chakra-ui/icons"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      variant="ghost"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={
        <Icon
          as={colorMode === "light" ? MoonIcon : SunIcon}
          color={{ base: "white", md: useColorModeValue("gray.700", "white") }}
        />
      }
      _hover={{
        bg: {
          base: "gray.700",
          md: useColorModeValue("gray.100", "transparent"),
        },
      }}
    />
  )
}

export default DarkModeSwitcher
