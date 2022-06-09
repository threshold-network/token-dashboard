import { FC } from "react"
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react"
import { H5 } from "@threshold-network/components"
import { ReactComponent as BonusSwoosh } from "../../static/images/BonusSwoosh.svg"

export const BonusTitle = () => {
  return (
    <Box position="relative" textAlign="center" bg="inherit">
      <BonusSwoosh />
      <TextWrapper top="24px" left="0">
        <Text>staking</Text>
      </TextWrapper>
      <TextWrapper bottom="22px" right="0">
        <Text>bonus</Text>
      </TextWrapper>
    </Box>
  )
}

const Text: FC = ({ children }) => {
  const textProps = useColorModeValue(
    {
      bgGradient: "linear-gradient(130.52deg, #7D00FF 0%, #7F00AC 100%)",
      bgClip: "text",
    },
    {
      color: "brand.300",
    }
  )

  return (
    <H5 {...textProps} px="3" py="1" textTransform="uppercase">
      {children}
    </H5>
  )
}

const TextWrapper: FC<BoxProps> = ({ children, ...restProps }) => {
  const titleBg = useColorModeValue("inherit", "gray.850")

  return (
    <Box
      {...restProps}
      position="absolute"
      bg={titleBg}
      whiteSpace="nowrap"
      borderRadius="0px 6px"
    >
      {children}
    </Box>
  )
}
