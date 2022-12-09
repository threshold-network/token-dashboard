import { FC } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { BodyLg, BodySm, H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import { useStakingState } from "../../../hooks/useStakingState"
import { useStakeTransaction } from "../../../web3/hooks/useStakeTransaction"
import { ModalType } from "../../../enums"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../Link"
import StakingStats from "../../StakingStats"
import ModalCloseButton from "../ModalCloseButton"

const SubmitStakeModal: FC<BaseModalProps> = () => {
  const { openModal } = useModal()

  const openStakingBounceSurveyModal = () => {
    console.log("opening the modal....?")
    openModal(ModalType.StakingBounceSurvey)
  }

  // stake transaction, opens success modal on success callback
  const { stake } = useStakeTransaction((tx) =>
    openModal(ModalType.StakeSuccess, {
      transactionHash: tx.hash,
    })
  )

  const { stakingProvider, beneficiary, authorizer, stakeAmount } =
    useStakingState()

  const submitStake = () => {
    stake({ stakingProvider, beneficiary, authorizer, amount: stakeAmount })
  }

  return (
    <>
      <ModalHeader display="flex" alignItems="baseline">
        <H5 mr={2}>Stake Tokens</H5>
        <BodySm>(Step 1)</BodySm>
      </ModalHeader>
      <ModalCloseButton onClick={openStakingBounceSurveyModal} />
      <ModalBody>
        <InfoBox variant="modal" spacing={6} mb={6}>
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
      <ModalFooter>
        <Button onClick={openStakingBounceSurveyModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button onClick={submitStake}>Stake</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(SubmitStakeModal)
