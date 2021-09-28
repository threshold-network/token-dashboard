import { FC, useMemo } from "react"
import { Box, VStack, useColorModeValue } from "@chakra-ui/react"
import { useLocation } from "react-router"
import { AiFillHome, BiDollarCircle, IoIosSwap } from "react-icons/all"
import NavItem from "./NavItem"
import TBrand from "./TBrand"

const SideNav: FC = () => {
  const { pathname } = useLocation()

  const navItems = useMemo(
    () => [
      {
        to: "/overview",
        text: "Overview",
        icon: <AiFillHome />,
        isActive: pathname === "/overview",
        key: "overview",
      },
      {
        to: "/upgrade",
        text: "Upgrade",
        icon: <IoIosSwap />,
        isActive: pathname === "/upgrade",
        key: "upgrade",
      },
      {
        to: "/balances",
        text: "Balances",
        icon: <BiDollarCircle />,
        isActive: pathname === "/balances",
        key: "balances",
      },
    ],
    [pathname]
  )

  return (
    <Box
      position="fixed"
      left={0}
      w="200px"
      top={0}
      h="100%"
      bg={useColorModeValue("gray.800", "gray.700")}
    >
      <VStack>
        <TBrand />
        {navItems.map((p) => (
          <NavItem {...p} />
        ))}
      </VStack>
    </Box>
  )
}

export default SideNav
