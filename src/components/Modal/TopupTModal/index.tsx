import { FC, useCallback } from "react"
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
import { StakingContractLearnMore } from "../../ExternalLink/SharedLinks"
import InfoBox from "../../InfoBox"
import StakingStats from "../../StakingStats"
import { useModal } from "../../../hooks/useModal"
import { useTopupTransaction } from "../../../web3/hooks/useTopupTransaction"
import { BaseModalProps } from "../../../types"
import { StakeData } from "../../../types/staking"
import { ModalType } from "../../../enums"
import withBaseModal from "../withBaseModal"

const TopupTModal: FC<
  BaseModalProps & { stake: StakeData; amountTopUp: string }
> = ({ stake, amountTopUp }) => {
  const { closeModal, openModal } = useModal()

  const onSuccess = useCallback(
    (tx) => {
      openModal(ModalType.TopupTSuccess, {
        transactionHash: tx.hash,
        stakeAmount: amountTopUp,
        stake,
      })
    },
    [amountTopUp, stake]
  )

  const { topup } = useTopupTransaction(onSuccess)

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
            <BodyLg>
              By topping up your stake you will add a new deposit of tokens to
              your initial stake.
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
