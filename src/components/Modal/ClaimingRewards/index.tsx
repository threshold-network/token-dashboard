import { FC, useCallback } from "react"
import {
  BodyLg,
  H5,
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
  HStack,
  BodySm,
  List,
  ListItem,
} from "@threshold-network/components"
import { useDispatch, useSelector } from "react-redux"
import { StakingContractLearnMore } from "../../Link/SharedLinks"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import {
  OnSuccessCallback,
  useClaimMerkleRewardsTransaction,
} from "../../../web3/hooks"
import {
  interimRewardsClaimed,
  selectAccumulatedRewardsPerBeneficiary,
  selectInterimRewards,
} from "../../../store/rewards"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import ModalCloseButton from "../ModalCloseButton"

const ClaimingRewardsBase: FC<
  BaseModalProps & {
    totalRewardsAmount: string
  }
> = ({ closeModal, totalRewardsAmount }) => {
  const dispatch = useDispatch()
  const { openModal } = useModal()
  const beneficiaryRewards = useSelector(selectAccumulatedRewardsPerBeneficiary)
  const rewards = useSelector(selectInterimRewards)

  const onClaimSuccess = useCallback<OnSuccessCallback>(
    (receipt) => {
      dispatch(interimRewardsClaimed())
      openModal(ModalType.ClaimingRewardsSuccess, {
        transactionHash: receipt.transactionHash,
        totalRewardsAmount,
        beneficiaries: Object.keys(beneficiaryRewards),
      })
    },
    [dispatch, totalRewardsAmount, openModal, beneficiaryRewards]
  )

  const { claim } = useClaimMerkleRewardsTransaction(onClaimSuccess)

  return (
    <>
      <ModalHeader>Claiming Rewards</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox mt="0" variant="modal">
            <H5 mb={4} color={useColorModeValue("gray.800", "white")}>
              You are about to claim your rewards.
            </H5>
            <BodyLg>
              By completing this action you will claim all the rewards you have
              accrued across all your stakes.
            </BodyLg>
          </InfoBox>
          <List spacing="0.5rem">
            {Object.entries(beneficiaryRewards).map(
              ([beneficiary, rewardAmount]) => (
                <ListItem key={beneficiary}>
                  <HStack justify="space-between">
                    <BodySm>Beneficiary Address</BodySm>
                    <BodySm>{shortenAddress(beneficiary)}</BodySm>
                  </HStack>
                  <HStack justify="space-between">
                    <BodySm>Reward Amount</BodySm>
                    <BodySm>{formatTokenAmount(rewardAmount)} T</BodySm>
                  </HStack>
                </ListItem>
              )
            )}
          </List>
          <StakingContractLearnMore mt="2.5rem !important" />
          <Divider />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            claim(Object.keys(rewards))
          }}
        >
          Claim All
        </Button>
      </ModalFooter>
    </>
  )
}

export const ClaimingRewards = withBaseModal(ClaimingRewardsBase)

export * from "./SuccessModal"
