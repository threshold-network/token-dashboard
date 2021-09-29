import { Box, Heading, Text } from "@chakra-ui/react"
import Hero from "../../components/Hero"

const Page = () => {
  return (
    <Box>
      <Hero>
        <>
          <Text>INTRODUCING</Text>
          <Heading fontSize="72px">Threshold</Heading>
          <Heading fontSize="72px">Network</Heading>
        </>
      </Hero>
      <Heading>OVERVIEW PAGE</Heading>
    </Box>
  )
}

export default Page
