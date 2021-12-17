import { FC } from "react"
import { useParams } from "react-router-dom"
import { Stack, HStack } from "@chakra-ui/react"
import UpgradeCard from "../components/UpgradeCard"
import TokenBalanceCard from "../components/TokenBalanceCard"
import { useModal } from "../hooks/useModal"
import { UpgredableToken } from "../types"
import { ModalType, Token } from "../enums"

const UpgradePage: FC = () => {
  const { token } = useParams()
  const _token = token === "nu" ? Token.Nu : Token.Keep
  const { openModal } = useModal()

  const onSubmit = (amount: string | number, token: UpgredableToken) => {
    openModal(ModalType.UpgradeToT, {
      upgradedAmount: amount,
      token,
    })
  }

  return (
    <HStack w="100%" align="flex-start" spacing="1rem">
      <UpgradeCard token={_token} onSubmit={onSubmit} />
      <Stack w="50%" spacing="1rem">
        <TokenBalanceCard token={_token} />
        <TokenBalanceCard token={Token.T} />
      </Stack>
    </HStack>
  )
}

export default UpgradePage
