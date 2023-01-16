import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  BodyLg,
  H5,
  BodySm,
  Image,
} from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import tbtcIllustration from "../../../static/images/minting-step-2.svg"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import Link from "../../Link"
import { ExternalHref } from "../../../enums"
import ModalCloseButton from "../ModalCloseButton"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"

const GenerateNewDepositAddressBase: FC<BaseModalProps> = ({ closeModal }) => {
  const { removeDepositDataFromLocalStorage } =
    useTBTCDepositDataFromLocalStorage()

  const { resetDepositData } = useTbtcState()

  const onConfirmClick = () => {
    removeDepositDataFromLocalStorage()
    resetDepositData()
    closeModal()
  }

  return (
    <>
      <ModalHeader>Take note</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox mt="0" variant="modal">
          <H5 mb="3" color="gray.800">
            You are about to go generate a new Deposit Address, are you sure?
          </H5>
          <BodyLg mb="12">
            Going back means you will redo Step 1 and generate a new Deposit
            Address.
          </BodyLg>
          <BodyLg>
            You will not be able to use your current generated address if you
            generate a new one.
          </BodyLg>
        </InfoBox>
        <Image
          src={tbtcIllustration}
          maxH={{ base: "140px", xl: "unset" }}
          maxW="200px"
          mx="auto"
          mt="12"
          mb="14"
        />
        <BodySm textAlign="center" color="gray.500">
          Read more about the&nbsp;
          <Link isExternal href={ExternalHref.tbtcBridgeGithub}>
            bridge contract
          </Link>
          .
        </BodySm>
        <Divider mt="2" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onConfirmClick} variant="outline" mr="3">
          Generate New Address
        </Button>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export const GenerateNewDepositAddress = withBaseModal(
  GenerateNewDepositAddressBase
)
