import { BodySm } from "@threshold-network/components"
import { HStack, useColorModeValue } from "@chakra-ui/react"
import ViewInBlockExplorer from "../ViewInBlockExplorer"
import { ExplorerDataType } from "../../utils/createEtherscanLink"
import { useTStakingContract } from "../../web3/hooks"

export const StakingContractLearnMore = () => {
  const tStakingContract = useTStakingContract()

  if (tStakingContract?.address) {
    return (
      <HStack justify="center" mt={4}>
        <ViewInBlockExplorer
          id={tStakingContract.address}
          type={ExplorerDataType.ADDRESS}
          text="Read More"
        />
        <BodySm color={useColorModeValue("gray.500", "gray.300")}>
          about the Staking Contract
        </BodySm>
      </HStack>
    )
  }

  return null
}
