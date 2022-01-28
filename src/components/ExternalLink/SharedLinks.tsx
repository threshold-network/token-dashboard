import ExternalLink from "./index"
import { ExternalHref } from "../../enums"
import { Body3 } from "../Typography"
import { HStack, useColorModeValue } from "@chakra-ui/react"

export const StakingContractLearnMore = () => {
  return (
    <HStack justify="center" mt={4}>
      <ExternalLink
        href={ExternalHref.stakingContractLeanMore}
        text="Read More"
      />
      <Body3 color={useColorModeValue("gray.500", "gray.300")}>
        about the Staking Contract
      </Body3>
    </HStack>
  )
}
