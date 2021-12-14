import { FC } from "react"
import { Icon, IconButton, IconButtonProps } from "@chakra-ui/react"
import { HamburgerIcon } from "@chakra-ui/icons"
import { useSidebar } from "../../hooks/useSidebar"

const HamburgerButton: FC<Omit<IconButtonProps, "aria-label">> = (props) => {
  const { openSidebar, closeSidebar } = useSidebar()
  return (
    <IconButton
      onClick={openSidebar}
      variant="ghost"
      aria-label="open navigation"
      icon={<Icon as={HamburgerIcon} />}
      {...props}
    />
  )
}

export default HamburgerButton
