import { FC, useEffect, useRef, useState } from "react"
import { useWeb3React } from "@web3-react/core"
import {
  BodyLg,
  BodySm,
  H5,
  Alert,
  AlertIcon,
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  HStack,
} from "@threshold-network/components"
import { FormikProps } from "formik"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import AdvancedParamsForm, { FormValues } from "./AdvancedParamsForm"
import { useStakingState } from "../../../hooks/useStakingState"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../Link"
import useCheckDuplicateProviderAddress from "../../../web3/hooks/useCheckDuplicateProviderAddress"
import { featureFlags } from "../../../constants"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { formatTokenAmount } from "../../../utils/formatAmount"
import ModalCloseButton from "../ModalCloseButton"
import SubmitTxButton from "../../SubmitTxButton"
import { useTStakingContract } from "../../../web3/hooks"

const ConfirmStakingParamsModal: FC<
  BaseModalProps & { stakeAmount: string }
> = ({ stakeAmount }) => {
  const formRef = useRef<FormikProps<FormValues>>(null)
  const { closeModal, openModal } = useModal()
  const [hasBeenValidatedOnMount, setHasBeenValidatedOnMount] = useState(false)
  const { account } = useWeb3React()
  const { updateState } = useStakingState()
  const checkIfProviderUsed = useCheckDuplicateProviderAddress()
  const stakingContract = useTStakingContract()

  // stake transaction, opens success modal on success callback
  // not needed once MAS is launched
  const { stake } = useStakeTransaction((receipt) => {
    if (featureFlags.MULTI_APP_STAKING) {
      openModal(ModalType.StakeSuccess, {
        transactionHash: receipt.transactionHash,
      })
    } else {
      openModal(ModalType.StakeSuccessOLD, {
        transactionHash: receipt.transactionHash,
      })
    }
  })

  useEffect(() => {
    const forceFormValidation = async () => {
      if (hasBeenValidatedOnMount || !formRef.current) return
      setHasBeenValidatedOnMount(true)
      const errors = await formRef.current.validateForm()
      if (errors) {
        formRef.current.setErrors(errors)
        formRef.current.setTouched({ stakingProvider: true })
      }
    }
    forceFormValidation()
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

    if (featureFlags.MULTI_APP_STAKING) {
      openModal(ModalType.SubmitStake)
    } else {
      stake({ stakingProvider, beneficiary, authorizer, amount: stakeAmount })
    }
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
          <H5 mb="4">
            You are about to make a deposit into the T Staking Contract.
          </H5>
          {featureFlags.MULTI_APP_STAKING && (
            <BodyLg>Staking requires 2 transactions.</BodyLg>
          )}
        </InfoBox>
        <List mt="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Staked Amount</BodySm>
              <BodySm>{`${formatTokenAmount(stakeAmount)} T`}</BodySm>
            </HStack>
          </ListItem>
        </List>
        <Alert mb={6} my={9} status="info" fontSize="sm">
          <AlertIcon />
          Take note! These addresses cannot be changed later.
        </Alert>

        <AdvancedParamsForm
          innerRef={formRef}
          formId="advanced-staking-params-form"
          initialAddress={account as string}
          onSubmitForm={onSubmit}
          checkIfProviderUsed={checkIfProviderUsed}
        />

        <StakingContractLearnMore textAlign="center" mt="8" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <SubmitTxButton
          isDisabled={!stakingContract}
          type="submit"
          form="advanced-staking-params-form"
        >
          {featureFlags.MULTI_APP_STAKING ? "Continue" : "Stake"}
        </SubmitTxButton>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(ConfirmStakingParamsModal)
