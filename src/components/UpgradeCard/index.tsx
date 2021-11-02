import TokenBalanceInput from "../TokenBalanceInput"
import KeepLight from "../../static/icons/KeepLight"
import { FC, useState } from "react"
import { useReduxToken } from "../../hooks/useReduxToken"
import { Token } from "../../enums"
import NuLight from "../../static/icons/NuLight"
import UpgradeCardTemplate from "./UpgradeCardTemplate"

export interface UpgradeCardProps {
  token: Token
}

const UpgradeCard: FC<UpgradeCardProps> = ({ token }) => {
  const { keep } = useReduxToken()
  const [amount, setAmount] = useState<string | number>("")

  const submitUpgrade = () => {
    console.log("time to upgrade!")
  }

  if (token === Token.Nu) {
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
          max={keep.balance}
          icon={NuLight}
        />
      </UpgradeCardTemplate>
    )
  }

  if (token === Token.Keep) {
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
  }

  return null
}

export default UpgradeCard
