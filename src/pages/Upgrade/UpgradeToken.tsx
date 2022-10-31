import { FC } from "react"
import { Stack } from "@threshold-network/components"
import UpgradeCard from "../../components/UpgradeCard"
import TokenBalanceCard from "../../components/TokenBalanceCard"
import { useModal } from "../../hooks/useModal"
import { UpgredableToken, RouteProps } from "../../types"
import { ModalType, Token } from "../../enums"

const UpgradeToken: FC<RouteProps & { token: UpgredableToken }> = ({
  token,
}) => {
  const { openModal } = useModal()

  const onSubmit = (amount: string | number, token: UpgredableToken) => {
    openModal(ModalType.UpgradeToT, {
      upgradedAmount: amount,
      token,
    })
  }

  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      spacing={4}
      w="100%"
      align="flex-start"
    >
      <UpgradeCard token={token} onSubmit={onSubmit} />
      <Stack spacing={4} w={{ base: "100%", md: "50%" }}>
        <TokenBalanceCard token={token} />
        <TokenBalanceCard token={Token.T} />
      </Stack>
    </Stack>
  )
}

export default UpgradeToken
