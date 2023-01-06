import { FC } from "react"
import { Box, Button, Flex, H5 } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { useTBTCBridgeContractAddress } from "../../../../hooks/useTBTCBridgeContractAddress"
import { useWeb3React } from "@web3-react/core"
import { ModalType } from "../../../../enums"
import { useModal } from "../../../../hooks/useModal"

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
  const { active } = useWeb3React()
  const { openModal } = useModal()

  return (
    <Flex flexDirection="column">
      {active ? (
        <MintingFlowRouterBase />
      ) : (
        <>
          <H5 align={"center"}>Connect wallet to mint tBTC</H5>
          <Button
            mt={6}
            isFullWidth
            onClick={() => openModal(ModalType.SelectWallet)}
            type="button"
          >
            Connect Wallet
          </Button>
        </>
      )}
      <Box as="p" textAlign="center" mt="6">
        <ViewInBlockExplorer
          id={brdigeContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Bridge Contract"
        />
      </Box>
    </Flex>
  )
}
