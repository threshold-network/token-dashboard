import { FC } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from "@chakra-ui/react"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, StakeData } from "../../../types"
import { BodyLg, H5 } from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import StakingApplicationIcon from "../../StakingApplicationIcon"

const InitiateDeauthorization: FC<BaseModalProps & { stake: StakeData }> = ({
  closeModal,
}) => {
  return (
    <>
      <ModalHeader>Initiate Deauthorization</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5 mb={4}>
            You're about to initiate the decrease of your TBTC authoriation.
          </H5>
          <BodyLg>
            Initiation and confirmation of deauthorization is a two step action.
          </BodyLg>
        </InfoBox>
        <StakingApplicationIcon stakingApplication={} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(InitiateDeauthorization)
