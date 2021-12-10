import { FC, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import CardTemplate from "./CardTemplate"
import { Button, HStack, Icon, Link, Stack } from "@chakra-ui/react"
import { Body2, Body3, H1, H3, H5 } from "../../../components/Typography"
import { Divider } from "../../../components/Divider"
import MultiSegmentProgress from "../../../components/MultiSegmentProgress"
import numeral from "numeral"
import { useWeb3React } from "@web3-react/core"
import { useReduxToken } from "../../../hooks/useReduxToken"

const BalanceStat: FC<{
  balance: number
  icon: any
  text: string
  conversionRate?: number
}> = ({ balance, icon, text, conversionRate }) => {
  return (
    <HStack justify="space-between">
      <HStack>
        <Icon as={icon} boxSize="24px" />
        <H5>{numeral(balance).format("0,00.00")}</H5>
        <Body3 color="gray.500">{text}</Body3>
      </HStack>
      {conversionRate && (
        <Body3 color="gray.500">
          1 {text} = {conversionRate} T
        </Body3>
      )}
    </HStack>
  )
}

const WalletBalances: FC = () => {
  const { account } = useWeb3React()
  const { keep, nu, t } = useReduxToken()

  const totalAssetBalance = keep.balance + nu.balance + t.balance

  const progressBarValues = useMemo(() => {
    return {
      ["#7D00FF"]: {
        value: (keep.balance / totalAssetBalance) * 100,
        tooltip: keep.text,
      },
      ["#1E65F3"]: {
        value: (nu.balance / totalAssetBalance) * 100,
        tooltip: nu.text,
      },
      ["#48dbb4"]: {
        value: (t.balance / totalAssetBalance) * 100,
        tooltip: t.text,
      },
    }
  }, [account, totalAssetBalance, t.balance, nu.balance, t.balance])

  const conversionToTAmount = useMemo(() => {
    return keep.balance * keep.conversionRate + nu.balance * nu.conversionRate
  }, [keep.balance, nu.balance])

  return (
    <CardTemplate title="WALLET">
      <Body2 mb={2}>Liquid Tokens</Body2>
      <MultiSegmentProgress values={progressBarValues} />
      <Stack spacing={2} mt={4}>
        {t.balance !== 0 && (
          <BalanceStat balance={t.balance} icon={t.icon} text={t.text} />
        )}
        <BalanceStat
          conversionRate={keep.conversionRate}
          balance={keep.balance}
          icon={keep.icon}
          text={keep.text}
        />
        <BalanceStat
          conversionRate={8.26}
          balance={nu.balance}
          icon={nu.icon}
          text={nu.text}
        />
      </Stack>
      <Divider borderColor="gray.300" />
      <Body2>Upgrades to</Body2>
      <HStack bg="gray.50" mt={4} px={6} py={2} borderRadius="md">
        <Icon as={t.icon} boxSize="32px" />
        <H3>{numeral(conversionToTAmount).format("0,00.00")}</H3>
      </HStack>
      <Link as={RouterLink} to="/upgrade">
        <Button size="lg" isFullWidth mt={8}>
          Upgrade Tokens
        </Button>
      </Link>
      <HStack justify="center" mt={4}>
        <Link color="brand.500" textDecoration="underline">
          Read More
        </Link>{" "}
        <Body3 color="gray.500">about Exchange Rate</Body3>
      </HStack>
    </CardTemplate>
  )
}

export default WalletBalances
