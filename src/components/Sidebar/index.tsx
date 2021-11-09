import { Box, useColorModeValue } from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import ExpanderIcon from "./ExpanderIcon"
import SidebarFooter from "./SidebarFooter"
import BrandIcon from "./BrandIcon"

const Sidebar = () => {
  const { isOpen } = useSidebar()

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      w={isOpen ? "200px" : "85px"}
      transition="width 0.3s"
      position="relative"
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      bg={useColorModeValue("white", "gray.800")}
    >
      <ExpanderIcon />
      <Box h="100%">
        <BrandIcon />
      </Box>
      <SidebarFooter />
    </Box>
  )
}

export default Sidebar
