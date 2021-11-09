import {
  Box,
  Button,
  Icon,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import { BiChevronRight, BiChevronLeft } from "react-icons/all"

const Sidebar = () => {
  const { isOpen, openSidebar, closeSidebar } = useSidebar()

  return (
    <Box
      h="100vh"
      display="flex"
      w={isOpen ? "200px" : "80px"}
      transition="width 1s"
      position="relative"
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      bg={useColorModeValue("white", "gray.800")}
    >
      <Icon
        as={isOpen ? BiChevronLeft : BiChevronRight}
        aria-label="toggle-sidebar"
        position="absolute"
        right="-12px"
        top="10px"
        borderRadius="50%"
        bg={useColorModeValue("white", "gray.800")}
        color="gray.700"
        border="1px solid"
        borderColor={useColorModeValue("gray.100", "gray.700")}
        h={6}
        w={6}
        onClick={isOpen ? closeSidebar : openSidebar}
        cursor="pointer"
      />
    </Box>
  )
}

export default Sidebar
