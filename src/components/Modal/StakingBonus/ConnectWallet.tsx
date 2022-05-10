import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import { BonusTitle } from "../../StakingBonus"
import SubmitTxButton from "../../SubmitTxButton"

export const ConnectWallet: FC<BaseModalProps> = ({ closeModal }) => {
  return (
    <>
      <ModalHeader>Staking Bonus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="warning">
          <AlertIcon alignSelf="center" />
          You have to connect your wallet in order to check your eligibility for
          the Staking Bonus.
        </Alert>
        <InfoBox variant="modal" display="flex" alignItems="center">
          <BonusTitle />
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <SubmitTxButton isFullWidth={false} mt={0} />
      </ModalFooter>
    </>
  )
}
