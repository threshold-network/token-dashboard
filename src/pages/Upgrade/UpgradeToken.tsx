import { FC } from "react"
import { Stack, SimpleGrid } from "@threshold-network/components"
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
    <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={4}>
      <UpgradeCard token={token} onSubmit={onSubmit} />
      <Stack spacing={4}>
        <TokenBalanceCard token={token} />
        <TokenBalanceCard token={Token.T} />
      </Stack>
    </SimpleGrid>
  )
}

export default UpgradeToken
