import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button, HStack, useColorModeValue } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { Body2, Body3 } from "../../../components/Typography"
import { useTokenState } from "../../../hooks/useTokenState"
import { ExternalHref } from "../../../enums"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"
import ExternalLink from "../../../components/ExternalLink"
import { useStakingState } from "../../../hooks/useStakingState"

const StakingOverview: FC = () => {
  const { t } = useTokenState()
  const { stakedBalance } = useStakingState()

  console.log("got the staked balance ", stakedBalance)

  return (
    <CardTemplate title="STAKING" height="fit-content">
      <Body2 mb={2}>Staked Balance</Body2>
      <InfoBox mt={4}>
        <TokenBalance
          icon={t.icon}
          tokenAmount={stakedBalance.toString()}
          isLarge
        />
      </InfoBox>
      <Button size="lg" isFullWidth mt={4} as={RouterLink} to="/staking">
        Go to Staking
      </Button>
      <HStack justify="center" mt={4}>
        <ExternalLink
          href={ExternalHref.stakingContractLeanMore}
          text="Read More"
        />
        <Body3 color={useColorModeValue("gray.500", "gray.300")}>
          about Staking Contract
        </Body3>
      </HStack>
    </CardTemplate>
  )
}

export default StakingOverview
