import { FC } from "react"
import { Box, VStack, useColorModeValue } from "@chakra-ui/react"
import NavItem from "./NavItem"
import TBrand from "./TBrand"
import { AiFillHome, BiDollarCircle, IoIosSwap } from "react-icons/all"

const SideNav: FC = () => {
  const navItems = [
    {
      to: "/",
      text: "Overview",
      icon: <AiFillHome />,
      isActive: true,
    },
    {
      to: "/",
      text: "Upgrade",
      icon: <IoIosSwap />,
      isActive: false,
    },
    {
      to: "/",
      text: "Balances",
      icon: <BiDollarCircle />,
      isActive: false,
    },
  ]

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
