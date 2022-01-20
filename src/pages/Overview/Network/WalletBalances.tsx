import { FC, useMemo } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Button,
  HStack,
  Link,
  Stack,
  useColorModeValue,
} from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { formatUnits } from "@ethersproject/units"
import IconEnum from "../../../enums/icon"
import CardTemplate from "./CardTemplate"
import { Body2, Body3 } from "../../../components/Typography"
import { Divider } from "../../../components/Divider"
import MultiSegmentProgress from "../../../components/MultiSegmentProgress"
import { useTokenState } from "../../../hooks/useTokenState"
import Icon from "../../../components/Icon"
import TokenBalance from "../../../components/TokenBalance"
import { BigNumber } from "ethers"
import { useTConvertedAmount } from "../../../hooks/useTConvertedAmount"
import { Token } from "../../../enums"
import { formatTokenAmount } from "../../../utils/formatAmount"

const BalanceStat: FC<{
  balance: string | number
  icon: IconEnum
  text: string
  conversionRate?: number | string
  tokenDecimals?: number
}> = ({ balance, icon, text, conversionRate, tokenDecimals }) => {
  return (
    <HStack justify="space-between">
      <HStack>
        <Icon as={icon} boxSize="24px" />
        <TokenBalance
          tokenAmount={balance}
          tokenSymbol={text}
          withSymbol
          tokenDecimals={tokenDecimals}
        />
      </HStack>
      {conversionRate && (
        <Body3 color="gray.500">
          1 {text} = {conversionRate} T
        </Body3>
      )}
    </HStack>
  )
}

const progressBarColors = {
  t: "#7D00FF",
  nu: "#1E65F3",
  keep: "#48dbb4",
}

const WalletBalances: FC = () => {
  const { account } = useWeb3React()
  const { keep, nu, t } = useTokenState()

  // do to: figure out how to pass in the token decimals
  const formattedKeep = Number(formatUnits(keep.balance))
  const formattedNu = Number(formatUnits(nu.balance))
  const formattedT = Number(formatUnits(t.balance))
  const totalAssetBalance = formattedKeep + formattedNu + formattedT

  const progressBarValues = useMemo(() => {
    return [
      {
        color: progressBarColors.keep,
        value: (formattedKeep / totalAssetBalance) * 100,
        tooltip: `${formatTokenAmount(keep.balance)} ${keep.text}`,
      },
      {
        color: progressBarColors.nu,
        value: (formattedNu / totalAssetBalance) * 100,
        tooltip: `${formatTokenAmount(nu.balance)} ${nu.text}`,
      },
      {
        color: progressBarColors.t,
        value: (formattedT / totalAssetBalance) * 100,
        tooltip: `${formatTokenAmount(t.balance)} ${t.text}`,
      },
    ]
  }, [account, totalAssetBalance, t.balance, nu.balance, t.balance])

  const { amount: keepToT } = useTConvertedAmount(Token.Keep, keep.balance)
  const { amount: nuToT } = useTConvertedAmount(Token.Nu, nu.balance)

  const conversionToTAmount = useMemo(() => {
    return BigNumber.from(keepToT).add(nuToT).toString()
  }, [keepToT, nuToT])

  return (
    <CardTemplate title="WALLET">
      <Body2 mb={2}>Liquid Tokens</Body2>
      <MultiSegmentProgress values={progressBarValues} />
      <Stack spacing={2} mt={4}>
        {formattedT !== 0 && (
          <BalanceStat balance={t.balance} icon={t.icon} text={t.text} />
        )}
        <BalanceStat
          conversionRate={keep.conversionRate}
          balance={keep.balance}
          icon={keep.icon}
          text={keep.text}
          tokenDecimals={keep.decimals}
        />
        <BalanceStat
          conversionRate={nu.conversionRate}
          balance={nu.balance}
          icon={nu.icon}
          text={nu.text}
        />
      </Stack>
      <Divider borderColor="gray.300" />
      <Body2>Possible T amount</Body2>
      <HStack
        bg={useColorModeValue("gray.50", "gray.700")}
        mt={4}
        px={6}
        py={2}
        borderRadius="md"
      >
        <Icon as={t.icon} boxSize="32px" />
        <TokenBalance tokenAmount={conversionToTAmount} />
      </HStack>

      <Button
        size="lg"
        isFullWidth
        mt={8}
        as={RouterLink}
        to="/upgrade"
        _hover={{ textDecoration: "none" }}
      >
        Upgrade Tokens
      </Button>

      <HStack justify="center" mt={4}>
        <Link
          color={useColorModeValue("brand.500", "white")}
          textDecoration="underline"
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/threshold-network/solidity-contracts/blob/main/docs/rfc-2-vending-machine.adoc"
        >
          Read More
        </Link>{" "}
        <Body3 color="gray.500">about Exchange Rate</Body3>
      </HStack>
    </CardTemplate>
  )
}

export default WalletBalances
