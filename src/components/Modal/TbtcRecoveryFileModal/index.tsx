import { FC, useState } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
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
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"

const TbtcRecoveryFileModalModal: FC<
  BaseModalProps & {
    jsonData: DepositScriptParameters
    handleDownloadClick: any
    handleDoubleReject: () => void
  }
> = ({ closeModal, jsonData, handleDownloadClick, handleDoubleReject }) => {
  const { isOpen: isOnConfirmStep, onOpen: setIsOnConfirmStep } =
    useDisclosure()
  const { updateState } = useTbtcState()

  const titleText = isOnConfirmStep
    ? "Are you sure you do not want to download the .JSON file?"
    : "Download this JSON file"

  const bodyContent = isOnConfirmStep ? (
    <BodyLg>
      The file is extremely important in case you need to make a fast recovery.
    </BodyLg>
  ) : (
    <>
      <BodyLg mb={6}>
        Please save this file as a measure of safety and precaution.
      </BodyLg>
      <BodyLg>
        This file contains a wallet public key, a refund public key and a refund
        lock time.
      </BodyLg>
    </>
  )

  return (
    <>
      <ModalHeader>Recovery JSON file</ModalHeader>
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>{titleText}</H5>
          {bodyContent}
        </InfoBox>
        <Image margin="40px auto" maxW="210px" src={btcJsonFile} />
        <BodySm textAlign="center">
          Read more about the&nbsp;
          <ViewInBlockExplorer
            id="NEED BRIDGE CONTRACT ADDRESS"
            type={ExplorerDataType.ADDRESS}
            text="bridge contract."
          />
        </BodySm>
      </ModalBody>
      <ModalFooter>
        {isOnConfirmStep ? (
          <Button onClick={handleDoubleReject} variant="outline" mr={2}>
            Dismiss anyway
          </Button>
        ) : (
          <Button onClick={() => setIsOnConfirmStep()} variant="outline" mr={2}>
            Cancel
          </Button>
        )}
        <Button onClick={() => handleDownloadClick(jsonData)}>Download</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcRecoveryFileModalModal)
