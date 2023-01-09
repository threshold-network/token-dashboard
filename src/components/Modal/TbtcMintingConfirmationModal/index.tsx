import { FC, useEffect } from "react"
import {
  BodyLg,
  BodySm,
  Button,
  H5,
  ModalBody,
  ModalCloseButton,
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
import { useThreshold } from "../../../contexts/ThresholdContext"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { unprefixedAndUncheckedAddress } from "../../../web3/utils"
import { decodeBitcoinAddress } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { useRevealMultipleDepositsTransaction } from "../../../hooks/tbtc"

const TbtcMintingConfirmationModal: FC<BaseModalProps> = ({ closeModal }) => {
  const {
    updateState,
    tBTCMintAmount,
    isLoadingTbtcMintAmount,
    isLoadingBitcoinMinerFee,
    btcRecoveryAddress,
    ethAddress,
    refundLocktime,
    walletPublicKeyHash,
    blindingFactor,
  } = useTbtcState()
  const threshold = useThreshold()

  const { revealMultipleDeposits } = useRevealMultipleDepositsTransaction()

  const initiateMintTransaction = async () => {
    // TODO: implement this
    // mint({})

    // 1. reveal deposit to the bridge

    // 2. the sweep will mint automatically
    // 3. minting will happen behind the scenes

    const deposit: DepositScriptParameters = {
      depositor: {
        identifierHex: unprefixedAndUncheckedAddress(ethAddress),
      },
      blindingFactor,
      walletPublicKeyHash: walletPublicKeyHash,
      refundPublicKeyHash: decodeBitcoinAddress(btcRecoveryAddress),
      refundLocktime,
    }

    const depositAddress = await threshold.tbtc.calculateDepositAddress(deposit)

    const utxos = await threshold.tbtc.findAllUnspentTransactionOutputs(
      depositAddress
    )
    const depositRevealed = await revealMultipleDeposits(utxos, deposit)

    if (depositRevealed) {
      updateState("mintingStep", MintingStep.MintingSuccess)
      closeModal()
    }
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
