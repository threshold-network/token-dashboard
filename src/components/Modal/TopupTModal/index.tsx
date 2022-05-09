import { FC, useCallback, useState } from "react"
import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { BodyLg, BodySm, H5 } from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import TokenBalanceInput from "../../TokenBalanceInput"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { useModal } from "../../../hooks/useModal"
import { BaseModalProps } from "../../../types"
import ThresholdCircleBrand from "../../../static/icons/ThresholdCircleBrand"
import { ModalType } from "../../../enums"
import { StakeData } from "../../../types/staking"
import { useTopupTransaction } from "../../../web3/hooks/useTopupTransaction"
import { useTokenState } from "../../../hooks/useTokenState"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink/SharedLinks"

const TopupTModal: FC<
  BaseModalProps & { stake: StakeData; initialTopupAmount?: number }
> = ({ stake, initialTopupAmount }) => {
  const [amountTopUp, setAmountToTopup] = useState<string | number | undefined>(
    initialTopupAmount
  )

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

  const {
    t: { balance: maxAmount },
  } = useTokenState()

  return (
    <>
      <ModalHeader>Topping up Stake</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4}>You are about to top up your stake</H5>
            <BodyLg>
              By topping up your stake you will add a new deposit of tokens to
              your existing stake.
            </BodyLg>
          </InfoBox>
          <Stack spacing={6} mb={12}>
            <Box>
              <TokenBalanceInput
                label={`T Amount`}
                amount={amountTopUp}
                setAmount={setAmountToTopup}
                max={maxAmount}
                icon={ThresholdCircleBrand}
                mb={2}
              />
              <BodySm>
                {formatTokenAmount(maxAmount)} T available to top up.
              </BodySm>
            </Box>
          </Stack>
        </Stack>
        <StakingContractLearnMore />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={
            !amountTopUp || +amountTopUp == 0 || +amountTopUp > +maxAmount
          }
          onClick={() => {
            if (amountTopUp) {
              topup({
                stakingProvider: stake.stakingProvider,
                amount: amountTopUp,
              })
            }
          }}
        >
          Top Up
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TopupTModal)
