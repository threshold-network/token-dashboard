import { Card, LabelSm } from "@threshold-network/components"
import { ComponentProps, FC, useMemo } from "react"
import { StakingContractLearnMore } from "../../components/Link"
import { TokenAmountForm } from "../../components/Forms"
import { Token, ModalType } from "../../enums"
import { useMinStakeAmount } from "../../hooks/useMinStakeAmount"
import { useModal } from "../../hooks/useModal"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { formatTokenAmount } from "../../utils/formatAmount"
import { useWeb3React } from "@web3-react/core"
import { RootState } from "../../store"
import { useSelector } from "react-redux"

const NewStakeCard: FC<ComponentProps<typeof Card>> = () => {
  const { isBlocked, isFetching } = useSelector(
    (state: RootState) => state.account.trm
  )
  const { openModal } = useModal()
  const tBalance = useTokenBalance(Token.T)
  const { minStakeAmount, isLoading, hasError } = useMinStakeAmount()
  const { active } = useWeb3React()

  const openStakingModal = async (stakeAmount: string) => {
    openModal(ModalType.StakingChecklist, { stakeAmount })
  }

  const placeholder = useMemo(() => {
    if (hasError) {
      return "Error fetching min stake"
    }

    return `Minimum stake ${
      isLoading || minStakeAmount === undefined
        ? "loading..."
        : `${formatTokenAmount(minStakeAmount)} T`
    }`
  }, [isLoading, hasError, minStakeAmount])

  return (
    <Card>
      <LabelSm mb={"2rem"}>New Stake</LabelSm>
      <TokenAmountForm
        isLoading={isFetching}
        onSubmitForm={openStakingModal}
        label="Stake Amount"
        submitButtonText="New Stake"
        maxTokenAmount={tBalance}
        placeholder={placeholder}
        minTokenAmount={minStakeAmount}
        isDisabled={!active || isBlocked}
      />
      <StakingContractLearnMore mt="3" />
    </Card>
  )
}

export default NewStakeCard
