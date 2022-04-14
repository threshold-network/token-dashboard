import { FC, useState } from "react"
import UpgradeCardTemplate from "./UpgradeCardTemplate"
import TokenBalanceInput from "../TokenBalanceInput"
import KeepLight from "../../static/icons/KeepLight"
import NuLight from "../../static/icons/NuLight"
import { useTokenBalance } from "../../hooks/useTokenBalance"
import { Token } from "../../enums"
import { UpgredableToken } from "../../types"
import { vendingMachine as vendingMachineConstants } from "../../constants"

export interface UpgradeCardProps {
  token: UpgredableToken
  onSubmit: (amount: string | number, token: UpgredableToken) => void
}

const tokenToIconMap = {
  [Token.Keep]: KeepLight,
  [Token.Nu]: NuLight,
}

const UpgradeCard: FC<UpgradeCardProps> = ({ token, onSubmit }) => {
  const balance = useTokenBalance(token)
  const [amount, setAmount] = useState<string | number | undefined>(undefined)

  const submitUpgrade = () => {
    if (amount && +amount > 0) {
      onSubmit(amount, token)
    }
  }

  return (
    <UpgradeCardTemplate
      token={token}
      amountToConvert={amount || ""}
      onSubmit={submitUpgrade}
      max={balance}
    >
      <TokenBalanceInput
        label={`${token} Amount`}
        amount={amount}
        setAmount={setAmount}
        max={balance}
        icon={tokenToIconMap[token]}
        decimalScale={
          vendingMachineConstants.WRAPPED_TOKEN_CONVERSION_PRECISION
        }
      />
    </UpgradeCardTemplate>
  )
}

export default UpgradeCard
