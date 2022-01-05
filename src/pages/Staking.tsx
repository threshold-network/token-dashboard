import { FC, useEffect, useState } from "react"
import { Button, HStack, Stack } from "@chakra-ui/react"
import { useModal } from "../hooks/useModal"
import { ModalType, TransactionStatus } from "../enums"
import { useReduxToken } from "../hooks/useReduxToken"
import { useWeb3React } from "@web3-react/core"
import { useApproveTStaking } from "../web3/hooks/useApproveTStaking"
import { useStakeTransaction } from "../web3/hooks/useStakeTransaction"

const StakingPage: FC = () => {
  const { openModal } = useModal()
  const { t } = useReduxToken()
  const { account } = useWeb3React()

  const { approveTStaking, status: approvalStatus } = useApproveTStaking()
  const { stake, status: stakingStatus } = useStakeTransaction()

  useEffect(() => {
    if (approvalStatus === TransactionStatus.Succeeded) {
      onApprovalSuccess()
    }
  }, [approvalStatus])

  useEffect(() => {
    if (stakingStatus === TransactionStatus.Succeeded) {
      onStakingSuccess()
    }
  }, [stakingStatus])

  const [amountToStake, setAmountToStake] = useState(0)
  const maxAmount = t.balance

  const onStakingParamSubmit = () => {
    approveTStaking()
  }

  const onApprovalSuccess = async () => {
    stake(
      "0x3a16F944293Dc0C509948351bCcb2D149844aFf3",
      account,
      account,
      "100000000000000000000"
    )
  }

  const onStakingSuccess = () => {
    openModal(ModalType.StakeSuccess)
  }

  const initStakingTransaction = async () => {
    openModal(ModalType.ConfirmStakingParams, {
      amountToStake,
      setAmountToStake,
      maxAmount,
      onSubmit: onStakingParamSubmit,
    })
  }

  return (
    <HStack w="100%" align="flex-start" spacing="1rem">
      <Stack w="50%" spacing="1rem">
        <Button onClick={initStakingTransaction}>STAKE</Button>
      </Stack>
    </HStack>
  )
}

export default StakingPage
