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
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { BaseModalProps } from "../../../types"
import shortenAddress from "../../../utils/shortenAddress"
import InfoBox from "../../InfoBox"
import { BridgeContractLink } from "../../tBTC"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../TransacionDetails"
import ModalCloseButton from "../ModalCloseButton"
import withBaseModal from "../withBaseModal"

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
  // TODO: calculate the BTC amount- take into account fees
  const btcAmount = "1.25"
  const thresholdNetworkFee = "0"
  const btcMinerFee = "0"

  // TODO: implement submit function
  const initiateUnminting = () => {
    // TODO: It's a temporary solution to be able to go through the whole flow.
    navigate("/tBTC/unmint/redemption/123456789")
    closeModal()
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
