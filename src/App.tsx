import { FC } from "react"
import {
  Badge,
  Button,
  ChakraProvider,
  Container,
  Heading,
  HStack,
  VStack,
} from "@chakra-ui/react"
import { Provider as ReduxProvider } from "react-redux"
import theme from "./theme"
import reduxStore from "./store"
import ModalRoot from "./components/Modal"
import { ModalType, useModal } from "./store/modal"

const ModalButton = () => {
  const { openModal } = useModal()
  return (
    <Button onClick={() => openModal(ModalType.example, { name: "Vitalik" })}>
      Open Modal
    </Button>
  )
}

const App: FC = () => {
  return (
    <ReduxProvider store={reduxStore}>
      <ChakraProvider theme={theme}>
        <ModalRoot />
        <Container>
          <Heading>Threshold Token Dashboard?</Heading>
          <ModalButton />
          <VStack spacing={12} mt={6}>
            <VStack>
              <HStack spacing={4}>
                <Badge size="sm">Badge</Badge>
                <Badge size="sm" colorScheme="green">
                  Badge
                </Badge>
                <Badge size="sm" colorScheme="yellow">
                  Badge
                </Badge>
                <Badge size="sm" colorScheme="red">
                  Badge
                </Badge>
              </HStack>
              <HStack spacing={4}>
                <Badge>Badge</Badge>
                <Badge colorScheme="green">Badge</Badge>
                <Badge colorScheme="yellow">Badge</Badge>
                <Badge colorScheme="red">Badge</Badge>
              </HStack>
            </VStack>
            <VStack>
              <HStack spacing={4}>
                <Badge size="sm" variant="outline">
                  Badge
                </Badge>
                <Badge size="sm" variant="outline" colorScheme="green">
                  Badge
                </Badge>
                <Badge size="sm" variant="outline" colorScheme="yellow">
                  Badge
                </Badge>
                <Badge size="sm" variant="outline" colorScheme="red">
                  Badge
                </Badge>
              </HStack>
              <HStack spacing={4}>
                <Badge variant="outline">Badge</Badge>
                <Badge variant="outline" colorScheme="green">
                  Badge
                </Badge>
                <Badge variant="outline" colorScheme="yellow">
                  Badge
                </Badge>
                <Badge variant="outline" colorScheme="red">
                  Badge
                </Badge>
              </HStack>
            </VStack>
            <VStack>
              <HStack spacing={4}>
                <Badge size="sm" variant="subtle">
                  Badge
                </Badge>
                <Badge size="sm" variant="subtle" colorScheme="green">
                  Badge
                </Badge>
                <Badge size="sm" variant="subtle" colorScheme="yellow">
                  Badge
                </Badge>
                <Badge size="sm" variant="subtle" colorScheme="red">
                  Badge
                </Badge>
              </HStack>
              <HStack spacing={4}>
                <Badge variant="subtle">Badge</Badge>
                <Badge variant="subtle" colorScheme="green">
                  Badge
                </Badge>
                <Badge variant="subtle" colorScheme="yellow">
                  Badge
                </Badge>
                <Badge variant="subtle" colorScheme="red">
                  Badge
                </Badge>
              </HStack>
            </VStack>
          </VStack>
        </Container>
      </ChakraProvider>
    </ReduxProvider>
  )
}

export default App
