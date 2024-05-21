import { FC, useCallback } from "react"
import {
  Button,
  Divider,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Stack,
  useColorModeValue,
  BodyLg,
  H5,
} from "@threshold-network/components"
import { StakingContractLearnMore } from "../../Link/SharedLinks"
import InfoBox from "../../InfoBox"
import StakingStats from "../../StakingStats"
import { useModal } from "../../../hooks/useModal"
import { useTopupTransaction } from "../../../web3/hooks/useTopupTransaction"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType, TopUpType } from "../../../enums"
import withBaseModal from "../withBaseModal"
import ModalCloseButton from "../ModalCloseButton"
import { OnSuccessCallback } from "../../../web3/hooks"

const TopupTModal: FC<
  BaseModalProps & {
    stake: StakeData
    amountTopUp: string
    topUpType: TopUpType
  }
> = ({ stake, amountTopUp, topUpType }) => {
  const { closeModal, openModal } = useModal()

  const onSuccess = useCallback<OnSuccessCallback>(
    (receipt) => {
      openModal(ModalType.TopupTSuccess, {
        transactionHash: receipt.transactionHash,
        stakeAmount: amountTopUp,
        stake,
      })
    },
    [amountTopUp, stake]
  )

  const { topup } = useTopupTransaction(topUpType, onSuccess)

  return (
    <>
      <ModalHeader>Topping up Stake</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4} color={useColorModeValue("gray.800", "white")}>
              You are about to top up your stake
            </H5>
            <BodyLg mb="6">
              By topping up your stake you will add a new deposit of tokens to
              your initial stake.
            </BodyLg>
            <BodyLg>
              If you want to put newly topped-up tokens to work, make sure to
              individually increase the total authorization to each Threshold
              application (tBTC, Random Beacon & TACo).
              <br />
              If you increase the total number of tokens authorized to the TACo
              app, those tokens will automatically be subject to the same unlock
              horizon as your current TACo stake, including the min.
              deauthorization delay (6 months), plus any lock-up extension on
              top of that.
            </BodyLg>
          </InfoBox>
          <StakingStats
            stakeAmount={amountTopUp}
            amountText="Top-up Amount"
            stakingProvider={stake.stakingProvider}
            beneficiary={stake.beneficiary}
            authorizer={stake.authorizer}
          />
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
            topup({
              stakingProvider: stake.stakingProvider,
              amount: amountTopUp,
            })
          }}
        >
          Top Up
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TopupTModal)
