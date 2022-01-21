import { Box, Icon, Image, useColorModeValue } from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { useSidebar } from "../../hooks/useSidebar"
import ThresholdPurple from "../../static/icons/ThresholdPurple"
import ThresholdWhite from "../../static/icons/ThresholdWhite"
import ThresholdBrandFull from "../../static/images/ThresholdBrandFull.svg"
import ThresholdBrandFullWhite from "../../static/images/ThresholdBrandFullWhite.svg"

const BrandIcon = () => {
  const { isOpen } = useSidebar()
  if (isOpen) {
    return (
      <RouterLink to="/">
        <Image
          src={useColorModeValue(ThresholdBrandFull, ThresholdBrandFullWhite)}
          mx="auto"
          marginTop="36px"
          w="150px"
          px="16px"
        />
      </RouterLink>
    )
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      paddingTop={8}
      as={RouterLink}
      to="/"
    >
      <Icon
        boxSize={8}
        as={useColorModeValue(ThresholdPurple, ThresholdWhite)}
      />
    </Box>
  )
}

export default BrandIcon
