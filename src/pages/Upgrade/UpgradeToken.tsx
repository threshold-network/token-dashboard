import { FC } from "react"
import { Stack } from "@chakra-ui/react"
import UpgradeCard from "../../components/UpgradeCard"
import TokenBalanceCard from "../../components/TokenBalanceCard"
import { useModal } from "../../hooks/useModal"
import { UpgredableToken, RouteProps } from "../../types"
import { ModalType, Token } from "../../enums"
import { Contract } from "@ethersproject/contracts"
import { useT } from "../../web3/hooks"

const UpgradeToken: FC<
  RouteProps & { token: UpgredableToken; contract: Contract | null }
> = ({ token, contract }) => {
  const { openModal } = useModal()

  const onSubmit = (amount: string | number, token: UpgredableToken) => {
    openModal(ModalType.UpgradeToT, {
      upgradedAmount: amount,
      token,
    })
  }

  const T = useT()

  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      w="100%"
      align="flex-start"
      spacing="1rem"
    >
      <UpgradeCard token={token} onSubmit={onSubmit} />
      <Stack w={{ base: "100%", md: "50%" }} spacing="1rem">
        <TokenBalanceCard token={token} contract={contract} />
        <TokenBalanceCard token={Token.T} contract={T?.contract} />
      </Stack>
    </Stack>
  )
}

export default UpgradeToken
