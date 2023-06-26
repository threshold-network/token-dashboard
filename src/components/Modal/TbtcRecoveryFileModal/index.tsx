import { FC } from "react"
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  BodyLg,
  H5,
  Image,
  BodySm,
  useDisclosure,
  Box,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import btcJsonFile from "../../../static/images/tbtc-json-file.png"
import withBaseModal from "../withBaseModal"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { downloadFile } from "../../../web3/utils"
import { getChainIdentifier } from "../../../threshold-ts/utils"
import { BridgeContractLink } from "../../tBTC"
import { useTbtcState } from "../../../hooks/useTbtcState"

const TbtcRecoveryFileModalModal: FC<
  BaseModalProps & {
    ethAddress: string
    blindingFactor: string
    walletPublicKeyHash: string
    refundPublicKeyHash: string
    refundLocktime: string
    btcDepositAddress: string
  }
> = ({
  closeModal,
  ethAddress,
  blindingFactor,
  walletPublicKeyHash,
  refundPublicKeyHash,
  refundLocktime,
  btcDepositAddress,
}) => {
  const { isOpen: isOnConfirmStep, onOpen: setIsOnConfirmStep } =
    useDisclosure()
  const { btcRecoveryAddress } = useTbtcState()

  const handleDoubleReject = () => {
    closeModal()
  }

  const depositScriptParameters: DepositScriptParameters = {
    depositor: getChainIdentifier(ethAddress),
    blindingFactor,
    walletPublicKeyHash,
    refundPublicKeyHash,
    refundLocktime,
  }

  const handleDownloadClick = () => {
    const date = new Date().toISOString().split("T")[0]

    const fileName = `${ethAddress}_${btcDepositAddress}_${date}`

    const finalData = {
      ...depositScriptParameters,
      btcRecoveryAddress: btcRecoveryAddress,
    }
    downloadFile(JSON.stringify(finalData), fileName, "text/json")

    closeModal()
  }

  const titleText = isOnConfirmStep
    ? "Are you sure you do not want to download the Recovery Receipt?"
    : "Download for your records"

  const bodyContent = isOnConfirmStep ? (
    <BodyLg>
      The file is extremely important in case you need to make a fast recovery.
    </BodyLg>
  ) : (
    <>
      <BodyLg mb={6}>
        This file is important in the rare case of fund recovery{" "}
        <Box as="strong">
          Keep it until you have received your tBTC token. One deposit, one
          receipt.
        </Box>
      </BodyLg>
      <BodyLg>
        This file contains a BTC recovery address, a wallet public key, a refund
        public key and a refund lock time of your deposit.
      </BodyLg>
    </>
  )

  return (
    <>
      <ModalHeader>
        {isOnConfirmStep ? "Take note" : "Recovery Receipt"}
      </ModalHeader>
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>{titleText}</H5>
          {bodyContent}
        </InfoBox>
        <Image mt="14" mb="16" mx="auto" maxW="210px" src={btcJsonFile} />
        <BodySm textAlign="center">
          View bridge contract on&nbsp;
          <BridgeContractLink text="etherscan" />.
        </BodySm>
      </ModalBody>
      <ModalFooter>
        {isOnConfirmStep ? (
          <Button
            onClick={handleDoubleReject}
            variant="outline"
            mr={2}
            data-ph-capture-attribute-button-name={
              "Dismiss Anyway [JSON download]"
            }
          >
            Dismiss Anyway
          </Button>
        ) : (
          <Button
            onClick={setIsOnConfirmStep}
            variant="outline"
            mr={2}
            data-ph-capture-attribute-button-name={"Cancel [JSON download]"}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={handleDownloadClick}
          data-ph-capture-attribute-button-name={"Download JSON"}
        >
          Download
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcRecoveryFileModalModal)
