import { FC, useRef, useEffect, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Divider,
  useDisclosure,
  useColorModeValue,
  Collapse,
  Flex,
} from "@chakra-ui/react"
import { BodyLg, BodyMd, BodySm, H5 } from "@threshold-network/components"
import { BsChevronDown, BsChevronUp } from "react-icons/all"
import { FormikProps } from "formik"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import AdvancedParamsForm, { FormValues } from "./AdvancedParamsForm"
import { useStakingState } from "../../../hooks/useStakingState"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"
import StakingStats from "../../StakingStats"
import useCheckDuplicateProviderAddress from "../../../web3/hooks/useCheckDuplicateProviderAddress"

const ConfirmStakingParamsModal: FC<
  BaseModalProps & { stakeAmount: string }
> = ({ stakeAmount }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { closeModal, openModal } = useModal()
  const [hasBeenValidatedOnMount, setHasBeenValidatedOnMount] = useState(false)
  const { account } = useWeb3React()
  const { updateState } = useStakingState()
  const { isOpen, onToggle, onOpen } = useDisclosure()
  const checkIfProviderUsed = useCheckDuplicateProviderAddress()

  useEffect(() => {
    const forceFormValidation = async () => {
      if (hasBeenValidatedOnMount || !formRef.current) return
      setHasBeenValidatedOnMount(true)
      const errors = await formRef.current.validateForm()
      if (errors) {
        formRef.current.setErrors(errors)
        formRef.current.setTouched({ stakingProvider: true })
        onOpen()
      }
    }
    forceFormValidation()
  })

  useEffect(() => {
    // Force the form to be displayed if it is invalid.
    if (!formRef.current?.isValid && !isOpen) {
      onOpen()
    }
  })

  const onSubmit = ({
    stakingProvider,
    beneficiary,
    authorizer,
  }: FormValues) => {
    updateState("stakingProvider", stakingProvider)
    updateState("beneficiary", beneficiary)
    updateState("authorizer", authorizer)
    updateState("stakeAmount", stakeAmount)
    openModal(ModalType.SubmitStake)
  }

  return (
    <>
      <ModalHeader display="flex" alignItems="baseline">
        <H5 mr={2}>Stake Tokens</H5>
        <BodySm>(Step 1)</BodySm>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>You are about to make a deposit into the T Staking Contract.</H5>
          <BodyLg>Staking requires 2 transactions.</BodyLg>
        </InfoBox>
        <StakingStats
          {...{
            stakeAmount,
            beneficiary: account as string,
            stakingProvider: account as string,
            authorizer: account as string,
          }}
        />
        <BodySm color="gray.500" mt="10">
          Provider, Beneficiary, and Authorizer addresses are currently set to
          your wallet address.
        </BodySm>
        <BodyMd textAlign="center" mt="4" mb="6">
          {account}
        </BodyMd>
        <Flex direction="column">
          <Button
            variant="link"
            color={useColorModeValue("brand.500", "white")}
            onClick={onToggle}
            mb={3}
            alignSelf="flex-end"
            rightIcon={isOpen ? <BsChevronUp /> : <BsChevronDown />}
          >
            Customize these addresses
          </Button>
        </Flex>
        <Collapse in={isOpen} animateOpacity>
          <AdvancedParamsForm
            innerRef={formRef}
            formId="advanced-staking-params-form"
            initialAddress={account as string}
            onSubmitForm={onSubmit}
            checkIfProviderUsed={checkIfProviderUsed}
          />
        </Collapse>
        <StakingContractLearnMore textAlign="center" mt="8" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button type="submit" form="advanced-staking-params-form">
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParamsModal)
