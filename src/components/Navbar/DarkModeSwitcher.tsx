import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
} from "@chakra-ui/react"
import { ColorMode } from "../../enums/project"
import { IoMoonSharp, IoSunnySharp } from "react-icons/all"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      variant="ghost"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={
        <Icon as={colorMode === ColorMode.LIGHT ? IoMoonSharp : IoSunnySharp} />
      }
    />
  )
}

export default DarkModeSwitcher
