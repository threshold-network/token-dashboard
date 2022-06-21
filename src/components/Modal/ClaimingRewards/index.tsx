import { FC } from "react"
import {
  BodyLg,
  H5,
  Button,
  Divider,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import { StakingContractLearnMore } from "../../ExternalLink/SharedLinks"
import InfoBox from "../../InfoBox"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"

const ClaimingRewardsBase: FC<
  BaseModalProps & {
    totalRewardsAmount: string
    rewards: { beneficiary: string; rewardsAmount: string }[]
  }
> = ({ closeModal, totalRewardsAmount, rewards }) => {
  return (
    <>
      <ModalHeader>Claiming Rewards</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4} color={useColorModeValue("gray.800", "white")}>
              You are about to claim your rewards.
            </H5>
            <BodyLg>
              By completing this action you will claim all the rewards you have
              accrued across all your stakes.
            </BodyLg>
          </InfoBox>
          {/* TODO render summary based on the `rewards` prop */}
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
            console.log("claim tx")
          }}
        >
          Claim All
        </Button>
      </ModalFooter>
    </>
  )
}

export const ClaimingRewards = withBaseModal(ClaimingRewardsBase)
