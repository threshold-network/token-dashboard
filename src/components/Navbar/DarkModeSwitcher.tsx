import { FC } from "react"
import {
  Icon,
  IconButton,
  IconButtonProps,
  useColorMode,
  useColorModeValue,
} from "@threshold-network/components"
import { IoMoonSharp, IoSunnySharp } from "react-icons/all"

const DarkModeSwitcher: FC<Omit<IconButtonProps, "aria-label">> = () => {
  const { toggleColorMode } = useColorMode()
  const icon = useColorModeValue(IoMoonSharp, IoSunnySharp)

  return (
    <IconButton
      variant="ghost"
      aria-label="color mode"
      onClick={toggleColorMode}
      icon={<Icon as={icon} />}
    />
  )
}

export default DarkModeSwitcher
