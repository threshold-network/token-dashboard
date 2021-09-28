import { FC } from "react"
import { ChakraProvider, Heading, Box, ColorModeScript } from "@chakra-ui/react"
import theme from "./theme"
import SideNav from "./components/SideNav"

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SideNav />
      <Box position="absolute" left="200px">
        <Heading>Threshold Token Dashboard</Heading>
      </Box>
    </ChakraProvider>
  )
}

export default App
