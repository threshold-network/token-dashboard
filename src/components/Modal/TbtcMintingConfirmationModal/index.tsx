import { Skeleton } from "@chakra-ui/react"
import { BitcoinUtxo } from "@keep-network/tbtc-v2.ts"
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
import { BigNumber } from "ethers"
import { FC, useEffect } from "react"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useRevealDepositTransaction } from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import MintingTransactionDetails from "../../../pages/tBTC/Bridge/components/MintingTransactionDetails"
import { BaseModalProps } from "../../../types"
import { MintingStep } from "../../../types/tbtc"
import InfoBox from "../../InfoBox"
import { BridgeContractLink } from "../../tBTC"
import { InlineTokenBalance } from "../../TokenBalance"
import withBaseModal from "../withBaseModal"

export interface TbtcMintingConfirmationModalProps extends BaseModalProps {
  utxo: BitcoinUtxo
}

const TbtcMintingConfirmationModal: FC<TbtcMintingConfirmationModalProps> = ({
  utxo,
  closeModal,
}) => {
  const { updateState, tBTCMintAmount, mintingFee, thresholdNetworkFee } =
    useTbtcState()
  const threshold = useThreshold()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    closeModal()
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
  )

  const initiateMintTransaction = async () => {
    await revealDeposit(utxo)
  }

  const amount = BigNumber.from(utxo.value).toString()

  useEffect(() => {
    const getEstimatedDepositFees = async () => {
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedDepositFees(amount)

      updateState("mintingFee", optimisticMintFee)
      updateState("thresholdNetworkFee", treasuryFee)
      updateState("tBTCMintAmount", amountToMint)
    }

    getEstimatedDepositFees()
  }, [amount, updateState, threshold])

  return (
    <>
      <ModalHeader>Initiate minting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5>You will initiate the minting of</H5>
          {/*
            We can't use `InlineTokenBalance` inside the above `H5` because
            the tooltip won't work correctly- will display at the top and
            center of the whole `H5` component not only above token amount.
           */}
          <H5 mb="4">
            <Skeleton isLoaded={!!tBTCMintAmount} maxW="105px" as="span">
              <InlineTokenBalance
                tokenAmount={tBTCMintAmount}
                tokenSymbol="tBTC"
                withSymbol
              />
            </Skeleton>
          </H5>
          <BodyLg>
            Minting tBTC requires a single transaction on Ethereum network and
            takes approximately 3 hours.
          </BodyLg>
        </InfoBox>
        <MintingTransactionDetails />
        <BodySm textAlign="center" mt="16">
          View bridge contract on&nbsp;
          <BridgeContractLink text="etherscan" />.
        </BodySm>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={closeModal}
          variant="outline"
          mr={2}
          data-ph-capture-attribute-button-name={
            "Cancel (TBTC Minting Confirmation Modal)"
          }
        >
          Cancel
        </Button>
        <Button
          disabled={!tBTCMintAmount || !mintingFee || !thresholdNetworkFee}
          onClick={initiateMintTransaction}
          data-ph-capture-attribute-button-name={
            "Start minting (TBTC Minting Confirmation Modal)"
          }
        >
          Start minting
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcMintingConfirmationModal)
