import { FC, useCallback, useState } from "react"
import {
  Alert,
  AlertDescription,
  AlertIcon,
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
import useUnstakeTransaction from "../../../web3/hooks/useUnstakeTransaction"
import InfoBox from "../../InfoBox"
import { StakingContractLearnMore } from "../../ExternalLink"

const UnstakeTModal: FC<BaseModalProps & { stake: StakeData }> = ({
  stake,
}) => {
  const { closeModal, openModal } = useModal()
  const [amountToUnstake, setAmountToUnstake] = useState<
    string | number | undefined
  >(undefined)
  const onSuccess = useCallback(
    (tx) =>
      openModal(ModalType.UnstakeSuccess, {
        transactionHash: tx.hash,
        stake,
        unstakeAmount: amountToUnstake,
      }),
    [amountToUnstake, stake]
  )
  const { unstake } = useUnstakeTransaction(onSuccess)

  return (
    <>
      <ModalHeader>Unstake Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Stack spacing={6}>
          <InfoBox variant="modal">
            <H5 mb={4}>You are about to unstake your tokens</H5>
            <Body1>
              You can partially or totally unstake depending on your needs.
            </Body1>
          </InfoBox>
          <Stack spacing={6} mb={6}>
            <Box>
              <TokenBalanceInput
                label={`T Amount`}
                amount={amountToUnstake}
                setAmount={setAmountToUnstake}
                max={stake.tStake}
                icon={ThresholdCircleBrand}
                mb={2}
              />
              <Body3>
                {formatTokenAmount(stake.tStake)} T available to unstake
              </Body3>
            </Box>
          </Stack>
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              Take note! Even if you fully unstake you cannot use the same
              Staking Provider address for new stakes. Even after fully
              unstaking, the resulting empty stake must be topped up to add
              funds.
            </AlertDescription>
          </Alert>
        </Stack>
        <StakingContractLearnMore />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Cancel
        </Button>
        <Button
          disabled={
            !amountToUnstake ||
            +amountToUnstake == 0 ||
            +amountToUnstake > +stake.tStake
          }
          onClick={() => {
            if (amountToUnstake) {
              unstake({
                stakingProvider: stake.stakingProvider,
                amount: amountToUnstake,
              })
            }
          }}
        >
          Unstake
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(UnstakeTModal)
