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
import { useTbtcState } from "../../../hooks/useTbtcState"
import { Skeleton } from "@chakra-ui/react"
import MintingTransactionDetails from "../../../pages/tBTC/Bridge/components/MintingTransactionDetails"
import { MintingStep } from "../../../types/tbtc"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import {
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { useRevealDepositTransaction } from "../../../hooks/tbtc"
import { BigNumber } from "ethers"
import { getChainIdentifier } from "../../../threshold-ts/utils"
import { InlineTokenBalance } from "../../TokenBalance"
import { BridgeContractLink } from "../../tBTC"

export interface TbtcMintingConfirmationModalProps extends BaseModalProps {
  utxo: UnspentTransactionOutput
}

const TbtcMintingConfirmationModal: FC<TbtcMintingConfirmationModalProps> = ({
  utxo,
  closeModal,
}) => {
  const {
    updateState,
    tBTCMintAmount,
    btcRecoveryAddress,
    ethAddress,
    refundLocktime,
    walletPublicKeyHash,
    blindingFactor,
    mintingFee,
    thresholdNetworkFee,
  } = useTbtcState()
  const threshold = useThreshold()

  const onSuccessfulDepositReveal = () => {
    updateState("mintingStep", MintingStep.MintingSuccess)
    closeModal()
  }

  const { sendTransaction: revealDeposit } = useRevealDepositTransaction(
    onSuccessfulDepositReveal
  )

  const initiateMintTransaction = async () => {
    const depositScriptParameters: DepositScriptParameters = {
      depositor: getChainIdentifier(ethAddress),
      blindingFactor,
      walletPublicKeyHash: walletPublicKeyHash,
      refundPublicKeyHash: decodeBitcoinAddress(btcRecoveryAddress),
      refundLocktime,
    }

    await revealDeposit(utxo, depositScriptParameters)
  }

  const amount = BigNumber.from(utxo.value).toString()

  useEffect(() => {
    const getEstimatedFees = async () => {
      const { treasuryFee, optimisticMintFee, amountToMint } =
        await threshold.tbtc.getEstimatedFees(amount)

      updateState("mintingFee", optimisticMintFee)
      updateState("thresholdNetworkFee", treasuryFee)
      updateState("tBTCMintAmount", amountToMint)
    }

    getEstimatedFees()
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
            Minting tBTC is a process that requires one transaction.
          </BodyLg>
        </InfoBox>
        <MintingTransactionDetails />
        <BodySm textAlign="center" mt="16">
          Read more about the&nbsp;
          <BridgeContractLink text="bridge contract" />.
        </BodySm>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={!tBTCMintAmount || !mintingFee || !thresholdNetworkFee}
          onClick={initiateMintTransaction}
        >
          Start minting
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcMintingConfirmationModal)
