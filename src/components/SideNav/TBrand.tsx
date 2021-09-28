import { FC } from "react"
import {
  Box,
  Button,
  Text,
  useColorMode,
  Square,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react"
import { AiFillHome } from "react-icons/all"

const Tbrand: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  return (
    <Box pl={8} pt={8} pb={8} w="100%">
      {/* Placeholder T Square? */}
      <Square
        onClick={toggleColorMode}
        size="56px"
        bg={useColorModeValue("gray.700", "gray.700")}
        color="white"
      >
        T
      </Square>
    </Box>
  )
}

export default Tbrand
