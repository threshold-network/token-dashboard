import { FC, ComponentProps } from "react"
import { useColorModeValue } from "@chakra-ui/react"
import { BodySm } from "@threshold-network/components"
import ViewInBlockExplorer from "../ViewInBlockExplorer"
import { useTStakingContract } from "../../web3/hooks"
import { ExplorerDataType } from "../../networks/enums/networks"

type StakingContractLearnMoreProps = ComponentProps<typeof BodySm>

export const StakingContractLearnMore: FC<StakingContractLearnMoreProps> = (
  props
) => {
  const tStakingContract = useTStakingContract()
  const color = useColorModeValue("gray.500", "gray.300")

  if (tStakingContract?.address) {
    return (
      <BodySm color={color} textAlign="center" {...props}>
        Read the{" "}
        <ViewInBlockExplorer
          id={tStakingContract.address}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract."
        />
      </BodySm>
    )
  }

  return null
}
