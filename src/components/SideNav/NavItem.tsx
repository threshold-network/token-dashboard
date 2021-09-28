import { FC, ReactElement } from "react"
import { Button, Link, useColorModeValue } from "@chakra-ui/react"
import { NavLink as RouterLink } from "react-router-dom"

interface NavItemProps {
  to: string
  text: string
  icon: ReactElement
  isActive: boolean
}

const NavItem: FC<NavItemProps> = ({ isActive, to, text, icon }) => {
  console.log(text, isActive)
  return (
    <Link
      as={RouterLink}
      activeClassName="is-active"
      to={to}
      bg={isActive ? useColorModeValue("gray.700", "gray.800") : undefined}
      _hover={{
        bg: useColorModeValue("gray.700", "gray.600"),
        cursor: "pointer",
      }}
      _focus={{ outline: "none" }}
      w="100%"
      px={6}
      py={4}
    >
      <Button
        variant="link"
        color="white"
        leftIcon={icon}
        _hover={{ textDecoration: "none" }}
        _focus={{ outline: "none" }}
      >
        {text}
      </Button>
    </Link>
  )
}

export default NavItem
