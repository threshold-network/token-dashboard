import { FC, useEffect } from "react"
import { useParams, Outlet, useNavigate } from "react-router-dom"
import { Stack, Container } from "@chakra-ui/react"
import UpgradeCard from "../components/UpgradeCard"
import TokenBalanceCard from "../components/TokenBalanceCard"
import { useModal } from "../hooks/useModal"
import { UpgredableToken } from "../types"
import { ModalType, Token } from "../enums"
import SubNavigationPills from "../components/SubNavigationPills"
import useDocumentTitle from "../hooks/useDocumentTitle"

const subNavLinks = [
  {
    text: "KEEP to T",
    path: "keep",
  },
  { text: "NU to T", path: "nu" },
]

const UpgradePage: FC & { route: {} } = () => {
  useDocumentTitle("Threshold - Upgrade")

  return (
    <>
      <SubNavigationPills links={subNavLinks} />
      <Container maxW={{ base: "2xl", xl: "6xl" }} mt="6.25rem">
        <Outlet />
      </Container>
    </>
  )
}

UpgradePage.route = {}

export const UpgradeTokenPage = () => {
  const { token } = useParams()
  const navigate = useNavigate()
  const _token = token === "nu" ? Token.Nu : Token.Keep
  const { openModal } = useModal()

  useEffect(() => {
    if (token !== "nu" && token !== "keep") {
      navigate("/upgrade/nu", { replace: true })
    }
  }, [token, navigate])

  const onSubmit = (amount: string | number, token: UpgredableToken) => {
    openModal(ModalType.UpgradeToT, {
      upgradedAmount: amount,
      token,
    })
  }

  return (
    <Stack
      direction={{ base: "column-reverse", md: "row" }}
      w="100%"
      align="flex-start"
      spacing="1rem"
    >
      <UpgradeCard token={_token} onSubmit={onSubmit} />
      <Stack w={{ base: "100%", md: "50%" }} spacing="1rem">
        <TokenBalanceCard token={_token} />
        <TokenBalanceCard token={Token.T} />
      </Stack>
    </Stack>
  )
}

export default UpgradePage
