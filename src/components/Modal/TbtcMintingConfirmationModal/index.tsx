import { FC, useEffect } from "react"
import {
  BodyLg,
  BodySm,
  Button,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { Skeleton } from "@chakra-ui/react"
import TransactionDetailsTable from "../../../pages/tBTC/Bridge/components/TransactionDetailsTable"
import { MintingStep } from "../../../types/tbtc"
import { useTbtcMintTransaction } from "../../../web3/hooks/useTbtcMintTransaction"
import ModalCloseButton from "../ModalCloseButton"

const TbtcMintingConfirmationModal: FC<BaseModalProps> = ({ closeModal }) => {
  const {
    updateState,
    tBTCMintAmount,
    isLoadingTbtcMintAmount,
    isLoadingBitcoinMinerFee,
  } = useTbtcState()

  const { mint } = useTbtcMintTransaction((tx) => {
    updateState("mintingStep", MintingStep.MintingSuccess)
  })

  const initiateMintTransaction = () => {
    // TODO: implement this
    // mint({})

    // 1. reveal deposit to the bridge

    // 2. the sweep will mint automatically
    // 3. minting will happen behind the scenes

    // TODO: this is a shortcut for now. We need to implement this properly
    updateState("mintingStep", MintingStep.MintingSuccess)
    closeModal()
  }

  // TODO: this is just to mock the loading state for the UI
  useEffect(() => {
    const timer = setTimeout(() => {
      updateState("tBTCMintAmount", 1.2)
      updateState("bitcoinMinerFee", 0.001)
      updateState("isLoadingTbtcMintAmount", false)
      updateState("isLoadingBitcoinMinerFee", false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <ModalHeader>Initiate minting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>
            You will initiate the minting of{" "}
            <Skeleton
              isLoaded={!isLoadingTbtcMintAmount}
              w={isLoadingTbtcMintAmount ? "105px" : undefined}
              display="inline-block"
            >
              {tBTCMintAmount}
            </Skeleton>{" "}
            tBTC
          </H5>
          <BodyLg>
            Minting tBTC is a process that requires one transaction.
          </BodyLg>
        </InfoBox>
        <TransactionDetailsTable />
        <BodySm textAlign="center" mt="16">
          Read more about the&nbsp;
          <ViewInBlockExplorer
            id="NEED BRIDGE CONTRACT ADDRESS"
            type={ExplorerDataType.ADDRESS}
            text="bridge contract."
          />
        </BodySm>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={isLoadingTbtcMintAmount || isLoadingBitcoinMinerFee}
          onClick={initiateMintTransaction}
        >
          Start minting
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcMintingConfirmationModal)
