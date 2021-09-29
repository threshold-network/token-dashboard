import { FC } from "react"
import {
  Box,
  useColorModeValue,
  Button,
  HStack,
  Container,
} from "@chakra-ui/react"

const Hero: FC = ({ children }) => {
  return (
    <Box bg={useColorModeValue("white", "gray.800")} w="100%" py={8}>
      <Container maxW="8xl">
        <HStack justify="flex-end">
          <Button variant="outline">Mainnet</Button>
          <Button>Connect Wallet</Button>
        </HStack>
        {children}
      </Container>
    </Box>
  )
}

export default Hero
