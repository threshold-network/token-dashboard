import TokenBalanceInput from "../TokenBalanceInput"
import KeepLight from "../../static/icons/KeepLight"
import { FC, useState } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { ModalType, Token } from "../../enums"
import NuLight from "../../static/icons/NuLight"
import UpgradeCardTemplate from "./UpgradeCardTemplate"
import { useModal } from "../../hooks/useModal"

export interface UpgradeCardProps {
  token: Token
}

const UpgradeCard: FC<UpgradeCardProps> = ({ token }) => {
  const { keep, nu } = useReduxToken()
  const [amount, setAmount] = useState<string | number>("")
  const { openModal } = useModal()

  const submitUpgrade = () => {
    openModal(ModalType.UpgradeTransaction)
  }

  switch (token) {
    case Token.Nu:
      return (
        <UpgradeCardTemplate
          token={token}
          amountToConvert={amount}
          onSubmit={submitUpgrade}
        >
          <TokenBalanceInput
            label="Nu Amount"
            amount={amount}
            setAmount={setAmount}
            max={nu.balance}
            icon={NuLight}
          />
        </UpgradeCardTemplate>
      )
    case Token.Keep:
      return (
        <UpgradeCardTemplate
          token={token}
          amountToConvert={amount}
          onSubmit={submitUpgrade}
        >
          <TokenBalanceInput
            label="KEEP Amount"
            amount={amount}
            setAmount={setAmount}
            max={keep.balance}
            icon={KeepLight}
          />
        </UpgradeCardTemplate>
      )
    default:
      return null
  }
}

export default UpgradeCard
