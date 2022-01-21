import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button, HStack, Link, useColorModeValue } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { Body2, Body3 } from "../../../components/Typography"
import { useTokenState } from "../../../hooks/useTokenState"
import Icon from "../../../components/Icon"
import { ExternalLink } from "../../../enums"
import InfoBox from "../../../components/InfoBox"
import TokenBalance from "../../../components/TokenBalance"

const StakingOverview: FC = () => {
  const { t } = useTokenState()

  return (
    <CardTemplate title="STAKING">
      <Body2 mb={2}>Staked Balance</Body2>
      <InfoBox mt={4} direction="row">
        <Icon as={t.icon} boxSize="32px" />
        <TokenBalance tokenAmount={t.balance} />
      </InfoBox>
      <Button
        size="lg"
        isFullWidth
        mt={8}
        as={RouterLink}
        to="/staking"
        _hover={{ textDecoration: "none" }}
      >
        Go to Staking
      </Button>
      <HStack justify="center" mt={4}>
        <Link
          color={useColorModeValue("brand.500", "white")}
          textDecoration="underline"
          target="_blank"
          href={ExternalLink.stakingContractLeanMore}
        >
          Read More
        </Link>{" "}
        <Body3 color="gray.500">about Staking Contract</Body3>
      </HStack>
    </CardTemplate>
  )
}

export default StakingOverview
