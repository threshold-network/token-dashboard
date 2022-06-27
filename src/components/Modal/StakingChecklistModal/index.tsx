import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { BodyLg, H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { ModalType } from "../../../enums"
import StakingChecklist from "../../StakingChecklist"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import { FormikProps, withFormik } from "formik"
import { Form, FormikInput } from "../../Forms"
import { FormValues } from "../ConfirmStakingParams/AdvancedParamsForm"

const AdvancedParamsFormBase = withFormik({
  handleSubmit: () => {},
})(() => {
  return (
    <Form id="yo yo">
      <FormikInput
        tooltip="here is some bullshit"
        secondaryLabel="here is some bullshit"
        name="stakingProvider"
        label="Provider Address"
        helperText="Enter a staking provider address."
      />
      <FormikInput
        mt="6"
        name="beneficiary"
        label="Beneficiary Address"
        helperText="This address will receive rewards."
      />
      <FormikInput
        mt="6"
        name="authorizer"
        label="Authorizer Address"
        helperText="This address will authorize applications."
      />
    </Form>
  )
})

const StakingChecklistModal: FC<BaseModalProps & { stakeAmount: string }> = ({
  closeModal,
  stakeAmount,
}) => {
  const { openModal } = useModal()

  return (
    <>
      <ModalHeader>Stake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <BodyLg color={useColorModeValue("gray.700", "white")} as="span">
              <H5 mb={4}>Before you continue</H5>
              <BodyLg>
                Please take note about the Staking Process and requirements you
                need to meet so you can gain rewards.
              </BodyLg>
            </BodyLg>
          </InfoBox>
          <Divider />
          <AdvancedParamsFormBase />
          <StakingChecklist />
          <StakingContractLearnMore mt="4rem !important" />
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            openModal(ModalType.ConfirmStakingParams, { stakeAmount })
          }
        >
          Stake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(StakingChecklistModal)
