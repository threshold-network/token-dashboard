import { Icon, useColorModeValue } from "@chakra-ui/react"
import { BiChevronLeft, BiChevronRight } from "react-icons/all"
import { useSidebar } from "../../hooks/useSidebar"

const ExpanderIcon = () => {
  const { isOpen, openSidebar, closeSidebar } = useSidebar()
  return (
    <Icon
      as={isOpen ? BiChevronLeft : BiChevronRight}
      aria-label="toggle-sidebar"
      position="absolute"
      right="-12px"
      top="30px"
      borderRadius="50%"
      bg={useColorModeValue("white", "gray.800")}
      color={useColorModeValue("gray.700", "gray.500")}
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      h={6}
      w={6}
      onClick={isOpen ? closeSidebar : openSidebar}
      cursor="pointer"
    />
  )
}

export default ExpanderIcon
