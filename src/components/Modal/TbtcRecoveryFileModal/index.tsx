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
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/src/deposit"
import { downloadFile } from "../../../web3/utils"
import { getChainIdentifier } from "../../../threshold-ts/utils"
import { BridgeContractLink } from "../../tBTC"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { capture } from "../../../posthog"
import { PosthogEvent } from "../../../types/posthog"

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
    ? "Are you sure you do not want to download the JSON file?"
    : "Download this JSON file"

  const bodyContent = isOnConfirmStep ? (
    <BodyLg>
      The file is extremely important in case you need to make a fast recovery.
    </BodyLg>
  ) : (
    <>
      <BodyLg mb={6}>
        This file is important to save in case you need to recover your funds.
        Keep it until you have successfully initiated minting. One deposit, one
        JSON file.
      </BodyLg>
      <BodyLg>
        This file contains your BTC recovery address, the wallet public key, the
        refund public key and the refund lock time of this deposit.
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
          <BridgeContractLink text="bridge contract" />.
        </BodySm>
      </ModalBody>
      <ModalFooter>
        {isOnConfirmStep ? (
          <Button
            onClick={() => {
              capture(PosthogEvent.ButtonClicked, {
                buttonName: "Dismiss Anyway [JSON download]",
              })
              handleDoubleReject()
            }}
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
            onClick={() => {
              capture(PosthogEvent.ButtonClicked, {
                buttonName: "Cancel [JSON download]",
              })
              setIsOnConfirmStep()
            }}
            variant="outline"
            mr={2}
            data-ph-capture-attribute-button-name={"Cancel [JSON download]"}
          >
            Cancel
          </Button>
        )}
        <Button
          onClick={() => {
            capture(PosthogEvent.ButtonClicked, {
              buttonName: "Download JSON",
            })
            handleDownloadClick()
          }}
          data-ph-capture-attribute-button-name={"Download JSON"}
        >
          Download
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TbtcRecoveryFileModalModal)
