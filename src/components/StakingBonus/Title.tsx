import { Box, useColorModeValue } from "@chakra-ui/react"
import { H5 } from "../Typography"
import { ReactComponent as BonusSwoosh } from "../../static/images/BonusSwoosh.svg"

export const BonusTitle = () => {
  // TODO: Update dark mode colors.
  const titleBg = useColorModeValue("white", "gray.500")

  return (
    <Box position="relative" textAlign="center">
      <BonusSwoosh />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        bg={titleBg}
        whiteSpace="nowrap"
        borderRadius="16px 0px"
      >
        <H5
          bgGradient="linear-gradient(130.52deg, #7D00FF 0%, #7F00AC 100%)"
          bgClip="text"
          px="8"
          py="2"
        >
          Staking Bonus
        </H5>
      </Box>
    </Box>
  )
}
