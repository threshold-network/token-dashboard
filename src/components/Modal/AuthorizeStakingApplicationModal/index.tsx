import { FC, useState, useMemo } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { BodySm, H5 } from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import withBaseModal from "../withBaseModal"

const AuthorizeStakingApplicationModal: FC<
  BaseModalProps & { stake: StakeData }
> = ({ stake, closeModal }) => {
  const handleSubmit = () => {
    console.log("next")
  }

  return (
    <>
      <ModalHeader>Authorize Apps</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6">
          <H5 mb={4}>
            Please authorize Threshold apps to use your stake to earn rewards
          </H5>
          <BodySm>
            You can authorize 100% of your stake to all the apps and change this
            at any time.
          </BodySm>
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Authorize Selected Apps</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(AuthorizeStakingApplicationModal)
