import { createOutputScriptFromAddress } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
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
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { useRequestRedemption } from "../../../hooks/tbtc"
import {
  BaseModalProps,
  UnspentTransactionOutputPlainObject,
} from "../../../types"
import shortenAddress from "../../../utils/shortenAddress"
import { buildRedemptionDetailsLink } from "../../../utils/tBTC"
import { OnSuccessCallback } from "../../../web3/hooks"
import InfoBox from "../../InfoBox"
import { BridgeContractLink } from "../../tBTC"
import { InlineTokenBalance } from "../../TokenBalance"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../TransacionDetails"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"

type InitiateUnmintingProps = {
  unmintAmount: string
  btcAddress: string
  wallet: {
    walletPublicKey: string
    mainUtxo: UnspentTransactionOutputPlainObject
  }
} & BaseModalProps

const InitiateUnmintingBase: FC<InitiateUnmintingProps> = ({
  closeModal,
  unmintAmount,
  btcAddress,
  wallet,
}) => {
  const navigate = useNavigate()
  const { account } = useWeb3React()
  // TODO: calculate the BTC amount- take into account fees
  const btcAmount = unmintAmount
  const thresholdNetworkFee = "0"
  const btcMinerFee = "0"

  const onSuccess: OnSuccessCallback = (receipt) => {
    navigate(
      buildRedemptionDetailsLink(
        receipt.transactionHash,
        account!,
        wallet.walletPublicKey,
        createOutputScriptFromAddress(btcAddress).toPrefixedString()
      )
    )
    closeModal()
  }

  const { sendTransaction } = useRequestRedemption(onSuccess)

  const initiateUnminting = async () => {
    const { walletPublicKey, mainUtxo } = wallet
    await sendTransaction(walletPublicKey, mainUtxo, btcAddress, unmintAmount)
  }

  return (
    <>
      <ModalHeader>Initiate unminting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5>
            Through unminting you will get back{" "}
            <InlineTokenBalance tokenAmount={btcAmount} /> BTC
          </H5>
          <BodyLg mt="4">
            Unminting tBTC requires one transaction on your end.
          </BodyLg>
        </InfoBox>
        <List mt="6" spacing="2">
          <TransactionDetailsAmountItem
            label="Unminted Amount"
            tokenAmount={unmintAmount}
            tokenSymbol="tBTC"
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsAmountItem
            label="Bitcoin Miner Fee"
            tokenAmount={btcMinerFee}
            tokenSymbol="BTC"
            tokenDecimals={8}
            precision={6}
            higherPrecision={8}
          />
          <TransactionDetailsAmountItem
            label="Threshold Network Fee"
            tokenAmount={thresholdNetworkFee}
            tokenSymbol="tBTC"
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
        <Button onClick={initiateUnminting}>Unmint</Button>
      </ModalFooter>
    </>
  )
}

export const InitiateUnminting = withBaseModal(InitiateUnmintingBase)
