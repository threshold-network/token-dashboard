import {
  BodyLg,
  BodySm,
  Button,
  Divider,
  H5,
  List,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Skeleton,
  Box,
} from "@threshold-network/components"
import { FC } from "react"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import { InlineTokenBalance } from "../../TokenBalance"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../TransactionDetails"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"
import { PosthogButtonId } from "../../../types/posthog"
import SubmitTxButton from "../../SubmitTxButton"
import { BridgeRoute } from "../../../threshold-ts/bridge"
import { BigNumber } from "ethers"
import { formatUnits } from "@ethersproject/units"

type InitiateBridgingProps = {
  amount: string
  fromNetwork: string
  toNetwork: string
  bridgeRoute: BridgeRoute
  estimatedFee: BigNumber | null
  estimatedTime: number
  onConfirm: () => Promise<void>
} & BaseModalProps

const InitiateBridgingBase: FC<InitiateBridgingProps> = ({
  closeModal,
  amount,
  fromNetwork,
  toNetwork,
  bridgeRoute,
  estimatedFee,
  estimatedTime,
  onConfirm,
}) => {
  const formatTime = (seconds: number): string => {
    if (seconds < 3600) {
      return `~${Math.round(seconds / 60)} minutes`
    } else if (seconds < 86400) {
      return `~${Math.round(seconds / 3600)} hours`
    } else {
      return `~${Math.round(seconds / 86400)} days`
    }
  }

  const handleConfirm = () => {
    try {
      // Close immediately, run in background
      closeModal()
      void onConfirm()
    } catch (error) {
      console.error("Bridge transaction failed:", error)
    }
  }

  const bridgeTypeText =
    bridgeRoute === "ccip" ? "CCIP Bridge" : "Standard Bridge"
  const feeAmount = estimatedFee ? formatUnits(estimatedFee, 18) : "0"

  return (
    <>
      <ModalHeader>Initiate {bridgeTypeText}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5>
            You are bridging{" "}
            <InlineTokenBalance
              tokenSymbol="tBTC"
              tokenAmount={amount}
              withSymbol
              precision={6}
              higherPrecision={8}
            />
          </H5>
          <BodyLg mt="4">
            From {fromNetwork} to {toNetwork} using {bridgeTypeText}. This will
            take approximately {formatTime(estimatedTime)}.
          </BodyLg>
        </InfoBox>
        <List mt="6" spacing="2">
          <TransactionDetailsAmountItem
            label="Bridge Amount"
            amount={amount}
            suffixItem="tBTC"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsAmountItem
            label="Estimated Fee"
            amount={feeAmount}
            suffixItem="ETH"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsItem label="From Network" value={fromNetwork} />
          <TransactionDetailsItem label="To Network" value={toNetwork} />
          <TransactionDetailsItem label="Bridge Type" value={bridgeTypeText} />
          <TransactionDetailsItem
            label="Estimated Time"
            value={formatTime(estimatedTime)}
          />
        </List>
        <BodySm textAlign="center" mt="9">
          {bridgeRoute === "ccip" ? (
            <>
              Your tokens will be bridged using Chainlink CCIP. The transaction
              will be viewable on the CCIP Explorer.
            </>
          ) : (
            <>
              Your tokens will be bridged using the Standard Bridge. This
              process takes 7 days to complete.
            </>
          )}
        </BodySm>
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <SubmitTxButton onSubmit={handleConfirm}>Confirm Bridge</SubmitTxButton>
      </ModalFooter>
    </>
  )
}

export const InitiateBridging = withBaseModal(InitiateBridgingBase)
