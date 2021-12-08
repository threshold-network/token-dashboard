import { FC } from "react"
import { Box, Stack, StackDivider, useColorModeValue } from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import ExpanderIcon from "./ExpanderIcon"
import SidebarFooter from "./SidebarFooter"
import BrandIcon from "./BrandIcon"
import NavItem, { NavItemDetail } from "./NavItem"

const DesktopSidebar: FC<{ navItems: NavItemDetail[] }> = ({ navItems }) => {
  const { isOpen } = useSidebar()

  return (
    <Box
      h="100vh"
      display={{ base: "none", sm: "flex" }}
      flexDirection="column"
      width={isOpen ? "285px" : "90px"}
      transition="width 0.3s"
      position="relative"
      borderRight="1px solid"
      borderColor={useColorModeValue("gray.100", "gray.700")}
      bg={useColorModeValue("white", "gray.800")}
    >
      <ExpanderIcon />
      <BrandIcon />
      <Stack
        mt={isOpen ? 10 : 6}
        divider={
          <StackDivider
            marginX={isOpen ? "18px !important" : "14px !important"}
          />
        }
        h="100%"
      >
        {navItems.map((props) => (
          <NavItem key={props.text} {...props} />
        ))}
      </Stack>
      <SidebarFooter />
    </Box>
  )
}

export default DesktopSidebar
