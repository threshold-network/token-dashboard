import { Box, Heading, HStack, Text, useColorModeValue } from "@chakra-ui/react"
import Hero from "../../components/Hero"

const Page = () => {
  return (
    <Box>
      <Hero>
        <>
          <HStack maxW="256px">
            <Text fontSize="lg">INTRODUCING</Text>
            <Box bg={useColorModeValue("gray.800", "white")} h="2px" w="100%" />
          </HStack>
          <Heading fontSize="72px">Threshold</Heading>
          <Heading fontSize="72px">Network</Heading>
        </>
      </Hero>
      <Heading>OVERVIEW PAGE</Heading>
    </Box>
  )
}

export default Page
