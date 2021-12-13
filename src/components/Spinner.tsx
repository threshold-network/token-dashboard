import { Flex, Icon, Spinner as ChakraSpinner } from "@chakra-ui/react"
import Threshold from "../static/icons/Ttoken"

// Maybe we should build this component in Chakra way and make it more
// reusable.
const Spinner = () => {
  return (
    <Flex position="relative" alignItems="center" justifyContent="center">
      <ChakraSpinner
        thickness="8px"
        speed="1.3s"
        emptyColor="gray.200"
        color="brand.500"
        height="120px"
        width="120px"
      />
      <Icon position="absolute" height="60px" w="60px" as={Threshold} />
    </Flex>
  )
}

export default Spinner
