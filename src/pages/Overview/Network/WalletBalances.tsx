import { FC, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import CardTemplate from "./CardTemplate"
import {
  Button,
  HStack,
  Icon,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { Body2, Body3, H3, H5 } from "../../../components/Typography"
import { Divider } from "../../../components/Divider"
import MultiSegmentProgress from "../../../components/MultiSegmentProgress"
import numeral from "numeral"
import { useWeb3React } from "@web3-react/core"
import { useReduxToken } from "../../../hooks/useReduxToken"
import { formatUnits } from "@ethersproject/units"

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

  // do to: figure out how to pass in the token decimals
  const formattedKeep = Number(formatUnits(keep.balance, 6))
  const formattedNu = Number(formatUnits(nu.balance))
  const formattedT = Number(formatUnits(t.balance))

  const totalAssetBalance = formattedKeep + formattedNu + formattedT

  const progressBarValues = useMemo(() => {
    return {
      ["#7D00FF"]: {
        value: (formattedKeep / totalAssetBalance) * 100,
        tooltip: `${numeral(formattedKeep).format("0,00.00")} ${keep.text}`,
      },
      ["#1E65F3"]: {
        value: (formattedNu / totalAssetBalance) * 100,
        tooltip: `${numeral(formattedNu).format("0,00.00")} ${nu.text}`,
      },
      ["#48dbb4"]: {
        value: (formattedT / totalAssetBalance) * 100,
        tooltip: `${numeral(formattedT).format("0,00.00")} ${t.text}`,
      },
    }
  }, [account, totalAssetBalance, t.balance, nu.balance, t.balance])

  const conversionToTAmount = useMemo(() => {
    return formattedKeep * keep.conversionRate + formattedNu * nu.conversionRate
  }, [formattedKeep, formattedNu])

  return (
    <CardTemplate title="WALLET">
      <Body2 mb={2}>Liquid Tokens</Body2>
      <MultiSegmentProgress values={progressBarValues} />
      <Stack spacing={2} mt={4}>
        {formattedT !== 0 && (
          <BalanceStat balance={formattedT} icon={t.icon} text={t.text} />
        )}
        <BalanceStat
          conversionRate={keep.conversionRate}
          balance={formattedKeep}
          icon={keep.icon}
          text={keep.text}
        />
        <BalanceStat
          conversionRate={8.26}
          balance={formattedNu}
          icon={nu.icon}
          text={nu.text}
        />
      </Stack>
      <Divider borderColor="gray.300" />
      <Body2>Upgrades to</Body2>
      <HStack
        bg={useColorModeValue("gray.50", "gray.700")}
        mt={4}
        px={6}
        py={2}
        borderRadius="md"
      >
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
