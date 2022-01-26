import { FC, useState } from "react"
import {
  Box,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Stack,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
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

const TopupTModal: FC<BaseModalProps & { stake: StakeData }> = ({ stake }) => {
  const { closeModal, openModal } = useModal()
  const [amountTopUp, setAmountToTopup] = useState<string | number>(0)
  const { topup } = useTopupTransaction((tx) =>
    openModal(ModalType.TopupTSuccess, { transactionHash: tx.hash })
  )

  const {
    t: { balance: maxAmount },
  } = useTokenState()

  return (
    <>
      <ModalHeader>Top up your T stake</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4}>You are about to top up your T stake</H5>
            <Body1>Lorem Ipsum about what topping up does means</Body1>
          </InfoBox>

          <Stack spacing={6} mb={6}>
            <Box>
              <TokenBalanceInput
                label={`T Amount to top up`}
                amount={amountTopUp}
                setAmount={setAmountToTopup}
                max={maxAmount}
                icon={ThresholdCircleBrand}
                mb={2}
              />
              <Body3>
                {formatTokenAmount(maxAmount)} T available to top up.
              </Body3>
            </Box>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={+amountTopUp == 0 || +amountTopUp > +maxAmount}
          onClick={() =>
            topup({
              stakingProvider: stake.stakingProvider,
              amount: amountTopUp,
            })
          }
        >
          Top Up
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TopupTModal)
