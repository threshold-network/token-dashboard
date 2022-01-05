import { FC, useEffect, useMemo, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  HStack,
  Link,
  Modal,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import CardTemplate from "./CardTemplate"
import { Body2, Body3, H3 } from "../../../components/Typography"
import { useReduxToken } from "../../../hooks/useReduxToken"
import Icon from "../../../components/Icon"
import { formatNumeral } from "../../../utils/formatAmount"
import { useTStakingContract } from "../../../web3/hooks/useTStakingContract"
import { useT } from "../../../web3/hooks/useT"
import { useApproveTStaking } from "../../../web3/hooks/useApproveTStaking"
import { ModalType, TransactionStatus } from "../../../enums"
import { openModal } from "../../../store/modal"

const StakingOverview: FC = () => {
  const { account } = useWeb3React()
  const { keep, nu, t } = useReduxToken()

  const stakingContract = useTStakingContract()
  console.log("stakingContract", stakingContract)
  const [stakes, setStakes] = useState()
  useEffect(() => {
    const fetchStakes = async () => {
      const stakes = await stakingContract?.stakes(
        "0x9f51DB53F34cA9621cEcEDe5487a4D52287d4acC"
      )
      console.log("yi yi", stakes)
      setStakes(stakes)
    }
    if (account && stakingContract) {
      fetchStakes()
    }
  }, [stakingContract, account])

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
        >
          Read More
        </Link>{" "}
        <Body3 color="gray.500">about Staking Contract</Body3>
      </HStack>
    </CardTemplate>
  )
}

export default StakingOverview
