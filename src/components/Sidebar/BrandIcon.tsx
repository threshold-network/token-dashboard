import { Box, Icon, Image, useColorModeValue } from "@chakra-ui/react"
import { useSidebar } from "../../hooks/useSidebar"
import ThresholdPurple from "../../static/icons/ThresholdPurple"
import ThresholdWhite from "../../static/icons/ThresholdWhite"
import ThresholdBrandFull from "../../static/images/ThresholdBrandFull.png"
import ThresholdBrandFullWhite from "../../static/images/ThresholdBrandFullWhite.png"

const BrandIcon = () => {
  const { isOpen } = useSidebar()
  if (isOpen) {
    return (
      <Image
        src={useColorModeValue(ThresholdBrandFull, ThresholdBrandFullWhite)}
        height="14px"
        mx="auto"
        marginTop="35px"
        paddingRight="12px"
      />
    )
  }

  return (
    <Box display="flex" justifyContent="center" paddingTop={8}>
      <Icon
        boxSize={8}
        as={useColorModeValue(ThresholdPurple, ThresholdWhite)}
      />
    </Box>
  )
}

export default BrandIcon
