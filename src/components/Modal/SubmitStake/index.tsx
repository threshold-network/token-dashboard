import { ChangeEventHandler, FC, useState } from "react"
import {
  BodyLg,
  BodySm,
  BodyMd,
  H5,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Divider,
  Checkbox,
  VStack,
  HStack,
} from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { useStakingState } from "../../../hooks/useStakingState"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { ExternalHref, ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import Link from "../../Link"
import { StakingContractLearnMore } from "../../Link"
import StakingStats from "../../StakingStats"
import ModalCloseButton from "../ModalCloseButton"

const SubmitStakeModal: FC<BaseModalProps> = () => {
  const { closeModal, openModal } = useModal()
  const [isAcknowledgementChecked, setIsAcknowledgementChecked] =
    useState(false)

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction((receipt) => {
    openModal(ModalType.StakeSuccess, {
      transactionHash: receipt.transactionHash,
    })
  })

  const { stakingProvider, beneficiary, authorizer, stakeAmount } =
    useStakingState()

  const submitStake = () => {
    stake({ stakingProvider, beneficiary, authorizer, amount: stakeAmount })
  }

  const handleAcknowledgementCheckbox: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const {
      target: { checked },
    } = event

    setIsAcknowledgementChecked(checked)
  }

  return (
    <>
      <ModalHeader display="flex" alignItems="baseline">
        <H5 mr={2}>Stake Tokens</H5>
        <BodySm>(Step 1)</BodySm>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" gap="4" mb={6}>
          <H5>You are about to make a deposit into the T Staking Contract.</H5>
          <BodyLg>Staking requires 2 transactions.</BodyLg>
        </InfoBox>
        <StakingStats
          {...{
            stakeAmount,
            beneficiary,
            stakingProvider,
            authorizer,
          }}
        />
        <StakingContractLearnMore textAlign="center" mt="8" />
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter p="6">
        <VStack alignItems="flex-end" spacing="6">
          <Checkbox
            onChange={handleAcknowledgementCheckbox}
            alignItems="flex-start"
            size="lg"
            spacing="3"
          >
            <BodyMd>
              I acknowledge that staking in Threshold requires running a
              node.&nbsp;
              <Link href={ExternalHref.runningNodeDocs} isExternal>
                Read more
              </Link>
            </BodyMd>
          </Checkbox>
          <HStack spacing="3">
            <Button onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button onClick={submitStake} disabled={!isAcknowledgementChecked}>
              Stake
            </Button>
          </HStack>
        </VStack>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(SubmitStakeModal)
