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
} from "@threshold-network/components"
import { useIsActive } from "../../../hooks/useIsActive"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useThreshold } from "../../../contexts/ThresholdContext"
import {
  useRedemptionEstimatedFees,
  useRequestRedemption,
} from "../../../hooks/tbtc"
import { BaseModalProps } from "../../../types"
import shortenAddress from "../../../utils/shortenAddress"
import { buildRedemptionDetailsLink } from "../../../utils/tBTC"
import { OnSuccessCallback } from "../../../web3/hooks"
import InfoBox from "../../InfoBox"
import { BridgeContractLink } from "../../tBTC"
import { InlineTokenBalance } from "../../TokenBalance"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../TransactionDetails"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"
import { PosthogButtonId } from "../../../types/posthog"
import SubmitTxButton from "../../SubmitTxButton"

type InitiateUnmintingProps = {
  unmintAmount: string
  btcAddress: string
} & BaseModalProps

const InitiateUnmintingBase: FC<InitiateUnmintingProps> = ({
  closeModal,
  unmintAmount,
  btcAddress,
}) => {
  const navigate = useNavigate()
  const { account } = useIsActive()
  const { estimatedBTCAmount, thresholdNetworkFee } =
    useRedemptionEstimatedFees(unmintAmount)
  const threshold = useThreshold()
  const isCrossChain = threshold.config.crossChain.isCrossChain

  const onSuccess: OnSuccessCallback = (receipt, additionalParams) => {
    //@ts-ignore
    const { walletPublicKey, chainName } = additionalParams
    const link = buildRedemptionDetailsLink(
      account!,
      btcAddress,
      threshold.tbtc.bitcoinNetwork,
      !isCrossChain ? receipt.transactionHash : undefined,
      walletPublicKey ?? undefined,
      chainName ?? undefined
    )
    if (link) {
      navigate(link)
    }
    closeModal()
  }

  const { sendTransaction } = useRequestRedemption(onSuccess)

  const initiateUnminting = async () => {
    await sendTransaction(btcAddress, unmintAmount)
  }

  return (
    <>
      <ModalHeader>Initiate unminting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5>
            Through unminting you will get back{" "}
            <Skeleton isLoaded={!!estimatedBTCAmount} maxW="105px" as="span">
              <InlineTokenBalance
                tokenSymbol="BTC"
                tokenDecimals={8}
                precision={6}
                higherPrecision={8}
                tokenAmount={estimatedBTCAmount!}
                displayTildeBelow={0}
                isEstimated
              />{" "}
            </Skeleton>
            BTC
          </H5>
          <BodyLg mt="4">
            Unminting tBTC requires one transaction on your end.
          </BodyLg>
        </InfoBox>
        <List mt="6" spacing="2">
          <TransactionDetailsAmountItem
            label="Unminted Amount"
            amount={unmintAmount}
            suffixItem="tBTC"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsAmountItem
            label="Threshold Network Fee"
            amount={thresholdNetworkFee}
            suffixItem="tBTC"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsItem
            label="BTC address"
            value={shortenAddress(btcAddress)}
          />
        </List>
        <BodySm textAlign="center" mt="9">
          Read more about the&nbsp;
          <BridgeContractLink text="bridge contract" />.
        </BodySm>
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <SubmitTxButton
          isDisabled={!threshold.tbtc.bridgeContract}
          onSubmit={initiateUnminting}
          data-ph-capture-attribute-button-name={"Unmint (Modal)"}
          data-ph-capture-attribute-button-id={
            PosthogButtonId.InitiateUnminting
          }
          data-ph-capture-attribute-button-text={"Unmint"}
          data-ph-capture-attribute-unminted-tbtc-amount={unmintAmount}
        >
          Unmint
        </SubmitTxButton>
      </ModalFooter>
    </>
  )
}

export const InitiateUnminting = withBaseModal(InitiateUnmintingBase)
