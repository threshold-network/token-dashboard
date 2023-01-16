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
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import btcJsonFile from "../../../static/images/tbtc-json-file.png"
import withBaseModal from "../withBaseModal"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { MintingStep } from "../../../types/tbtc"
import { downloadFile } from "../../../web3/utils"
import Link from "../../Link"
import { ExternalHref } from "../../../enums"

const TbtcRecoveryFileModalModal: FC<
  BaseModalProps & {
    depositScriptParameters: DepositScriptParameters
    ethAddress: string
    btcDepositAddress: string
  }
> = ({
  closeModal,
  depositScriptParameters,
  ethAddress,
  btcDepositAddress,
}) => {
  const { isOpen: isOnConfirmStep, onOpen: setIsOnConfirmStep } =
    useDisclosure()
  const { updateState } = useTbtcState()

  const handleDoubleReject = () => {
    updateState("mintingStep", MintingStep.Deposit)
    closeModal()
  }

  const handleDownloadClick = (data: DepositScriptParameters) => {
    const date = new Date()
    const fileName = `
    ${ethAddress}-
    ${btcDepositAddress}-
    ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}
    `

    downloadFile(JSON.stringify(data), fileName, "text/json")

    closeModal()
    updateState("mintingStep", MintingStep.Deposit)
  }

  const titleText = isOnConfirmStep
    ? "Are you sure you do not want to download the .JSON file?"
    : "Download this .JSON file"

  const bodyContent = isOnConfirmStep ? (
    <BodyLg>
      The file is extremely important in case you need to make a fast recovery.
    </BodyLg>
  ) : (
    <>
      <BodyLg mb={6}>
        This file is important to save in case you need to make a fast recovery.
      </BodyLg>
      <BodyLg>
        This file contains a wallet public key, a refund public key and a refund
        lock time.
      </BodyLg>
    </>
  )

  return (
    <>
      <ModalHeader>
        {isOnConfirmStep ? "Take note" : "Recovery .JSON file"}
      </ModalHeader>
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>{titleText}</H5>
          {bodyContent}
        </InfoBox>
        <Image mt="14" mb="16" mx="auto" maxW="210px" src={btcJsonFile} />
        <BodySm textAlign="center">
          Read more about the&nbsp;
          <Link isExternal href={ExternalHref.tbtcBridgeGithub}>
            bridge contract
          </Link>
          .
        </BodySm>
      </ModalBody>
      <ModalFooter>
        {isOnConfirmStep ? (
          <Button onClick={handleDoubleReject} variant="outline" mr={2}>
            Dismiss Anyway
          </Button>
        ) : (
          <Button onClick={setIsOnConfirmStep} variant="outline" mr={2}>
            Cancel
          </Button>
        )}
        <Button onClick={() => handleDownloadClick(depositScriptParameters)}>
          Download
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcRecoveryFileModalModal)
