import { FC } from "react"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import InfoBox from "../../InfoBox"
import { H5, Body1 } from "../../Typography"
import { Divider } from "../../Divider"
import { StakingBonusReadMore } from "../../ExternalLink"
import { CheckEligibilityForm, FormValues } from "./CheckEligibilityForm"
import { BaseModalProps } from "../../../types"

export const CheckEligibility: FC<
  BaseModalProps & { onSubmit: (values: FormValues) => void }
> = ({ closeModal, onSubmit }) => {
  return (
    <>
      <ModalHeader>Staking Bonus</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>Check your eligibility based on your Provider Address</H5>
          <Body1 mt="4">
            In order for any stake to get a Staking Bonus it needs to meet two
            requirements.
          </Body1>
          <Body1 mt="8">The Staking Bonus is 2.5% of your stake.</Body1>
        </InfoBox>
        <Divider />
        <CheckEligibilityForm onSubmitForm={onSubmit}></CheckEligibilityForm>
        <StakingBonusReadMore />
        <Divider mb="0" mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
      </ModalFooter>
    </>
  )
}
