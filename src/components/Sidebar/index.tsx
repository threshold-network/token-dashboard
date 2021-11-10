import { Box, Stack, StackDivider, useColorModeValue } from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import ExpanderIcon from "./ExpanderIcon"
import SidebarFooter from "./SidebarFooter"
import BrandIcon from "./BrandIcon"
import NavItem, { NavItemDetail } from "./NavItem"
import {
  IoBarChart,
  IoBarChartOutline,
  IoHome,
  IoHomeOutline,
  IoSwapHorizontal,
} from "react-icons/all"
import { useLocation } from "react-router-dom"
import { useMemo } from "react"

const Sidebar = () => {
  const { isOpen } = useSidebar()
  const { pathname } = useLocation()

  const navItems: NavItemDetail[] = useMemo(
    () => [
      {
        text: "Overview",
        icon: pathname === "/" ? IoHome : IoHomeOutline,
        href: "/",
        isActive: pathname === "/",
      },
      {
        text: "Upgrade",
        icon: IoSwapHorizontal,
        href: "/upgrade",
        isActive: pathname === "/upgrade",
      },
      {
        text: "Portfolio",
        icon: pathname === "/portfolio" ? IoBarChart : IoBarChartOutline,
        href: "/portfolio",
        isActive: pathname === "/portfolio",
      },
    ],
    [pathname]
  )

  return (
    <Box
      h="100vh"
      display="flex"
      flexDirection="column"
      w={isOpen ? "200px" : "87px"}
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
          <StackDivider marginY="0 !important" marginX="14px !important" />
        }
        h="100%"
      >
        {navItems.map((props) => (
          <Box py={2}>
            <NavItem key={props.text} {...props} />
          </Box>
        ))}
      </Stack>

      <SidebarFooter />
    </Box>
  )
}

export default Sidebar
