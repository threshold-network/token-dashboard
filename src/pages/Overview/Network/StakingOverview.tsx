import { FC } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Button, HStack, Link, useColorModeValue } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { Body2, Body3, H3 } from "../../../components/Typography"
import { useTokenState } from "../../../hooks/useTokenState"
import Icon from "../../../components/Icon"
import { formatNumeral } from "../../../utils/formatAmount"
import { ExternalLink } from "../../../enums"

const StakingOverview: FC = () => {
  const { t } = useTokenState()

  return (
    <CardTemplate title="STAKING">
      <Body2 mb={2}>Staked Balance</Body2>
      <HStack
        bg={useColorModeValue("gray.50", "gray.700")}
        mt={4}
        px={6}
        py={2}
        borderRadius="md"
      >
        <Icon as={t.icon} boxSize="32px" />
        <H3>{formatNumeral(100)}</H3>
      </HStack>
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
