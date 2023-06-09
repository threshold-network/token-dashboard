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
import { BaseModalProps } from "../../../types"
import { threshold } from "../../../utils/getThresholdLib"
import shortenAddress from "../../../utils/shortenAddress"
import InfoBox from "../../InfoBox"
import { BridgeContractLink } from "../../tBTC"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../TransacionDetails"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"
import { getContractPastEvents } from "../../../web3/utils/index"
import {
  encodeToBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { Hex } from "@keep-network/tbtc-v2.ts"
import { BigNumber } from "ethers"

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
  const { account } = useWeb3React()
  // TODO: calculate the BTC amount- take into account fees
  const btcAmount = "1.25"
  const thresholdNetworkFee = "0"
  const btcMinerFee = "0"

  const onSuccess = () => {
    // TODO: build redemption key here and redirect to the redemption details page.
    const redemptionKey = "test"
    navigate(`/tBTC/unmint/redemption/${redemptionKey}`)
    closeModal()
  }

  const { sendTransaction } = useRequestRedemption(onSuccess)

  const initiateUnminting = async () => {
    // TODO: Temporary solution- we will pass this data via props once we merge
    // https://github.com/threshold-network/token-dashboard/pull/532
    const walletPublicKey =
      "028ed84936be6a9f594a2dcc636d4bebf132713da3ce4dac5c61afbf8bbb47d6f7"
    const utxo: UnspentTransactionOutput = {
      transactionHash: Hex.from(
        "0x5b6d040eb06b3de1a819890d55d251112e55c31db4a3f5eb7cfacf519fad7adb"
      ),
      outputIndex: 0,
      value: BigNumber.from("791613461"),
    }

    await sendTransaction(
      account!,
      walletPublicKey,
      utxo,
      btcAddress,
      unmintAmount
    )
  }

  return (
    <>
      <ModalHeader>Initiate unminting tBTC</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5>Through unminting you will get back {btcAmount} BTC</H5>
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
