import { FC } from "react"
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Stack,
} from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import SidebarFooter from "./SidebarFooter"
import BrandIcon from "./BrandIcon"
import NavItem, { NavItemDetail } from "./NavItem"
import useChakraBreakpoint from "../../hooks/useChakraBreakpoint"

const MobileSidebar: FC<{ navItems: NavItemDetail[] }> = ({ navItems }) => {
  const { isOpen, closeSidebar } = useSidebar()
  const breakpoint = useChakraBreakpoint("sm")

  return (
    <Drawer
      placement="left"
      onClose={closeSidebar}
      isOpen={isOpen && breakpoint}
    >
      <DrawerOverlay />
      <DrawerContent>
        <Stack h="100%">
          <BrandIcon />
          <Box mt="48px !important">
            {navItems.map((props) => (
              <NavItem key={props.text} {...props} />
            ))}
          </Box>
        </Stack>
        <SidebarFooter />
      </DrawerContent>
    </Drawer>
  )
}

export default MobileSidebar
