import { FC } from "react"
import { Box, Flex } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"

const MintingFlowRouterBase = () => {
  const { mintingStep } = useTbtcState()

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit />
    }
    case MintingStep.InitiateMinting: {
      return <InitiateMinting />
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return null
  }
}

export const MintingFlowRouter: FC = () => {
  const brdigeContractAddress = useTBTCBridgeContractAddress()

  return (
    <Flex flexDirection="column" justifyContent="space-between" h="100%">
      <MintingFlowRouterBase />
      <Box as="p" textAlign="center">
        <ViewInBlockExplorer
          id={brdigeContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Bridge Contract"
        />
      </Box>
    </Flex>
  )
}
