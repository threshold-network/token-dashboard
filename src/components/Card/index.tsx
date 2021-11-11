import { Box, BoxProps, useStyleConfig } from "@chakra-ui/react"
import { FC } from "react"

const Card: FC<BoxProps> = (props) => {
  const styles = useStyleConfig("Card")
  return <Box __css={styles} {...props} />
}

export default Card
