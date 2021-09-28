import { FC, ReactElement } from "react"
import { Box, Button, useColorModeValue } from "@chakra-ui/react"

interface NavItemProps {
  to: string
  text: string
  icon: ReactElement
  isActive: boolean
}

const NavItem: FC<NavItemProps> = ({ isActive, to, text, icon }) => {
  return (
    <Box
      bg={isActive ? useColorModeValue("gray.800", "gray.600") : undefined}
      _hover={{
        bg: useColorModeValue("gray.700", "gray.600"),
        cursor: "pointer",
      }}
      w="100%"
      p={4}
    >
      <Button
        variant="link"
        color="white"
        leftIcon={icon}
        _hover={{ textDecoration: "none" }}
      >
        {text}
      </Button>
    </Box>
  )
}

export default NavItem
