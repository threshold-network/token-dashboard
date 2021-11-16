import {
  Box,
  BoxProps,
  useColorModeValue,
  useStyleConfig,
} from "@chakra-ui/react"
import { FC } from "react"

const Card: FC<BoxProps> = (props) => {
  const styles = useStyleConfig("Card")
  return (
    <Box
      __css={styles}
      {...props}
      bg={useColorModeValue("white", "gray.800")}
      borderColor={useColorModeValue("gray.100", "gray.700")}
    />
  )
}

export default Card
