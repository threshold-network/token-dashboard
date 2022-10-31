import { FC, useMemo } from "react"
import { HStack, Stack, useColorModeValue } from "@chakra-ui/react"
import { useWeb3React } from "@web3-react/core"
import { formatUnits } from "@ethersproject/units"
import IconEnum from "../../../enums/icon"
import CardTemplate from "./CardTemplate"
import { BodyMd, BodySm } from "@threshold-network/components"
import {
  MultiSegmentProgress,
  LineDivider,
} from "@threshold-network/components"
import { useTokenState } from "../../../hooks/useTokenState"
import TokenBalance from "../../../components/TokenBalance"
import { BigNumber } from "ethers"
import { useTConvertedAmount } from "../../../hooks/useTConvertedAmount"
import { ExternalHref, Token } from "../../../enums"
import { formatTokenAmount } from "../../../utils/formatAmount"
import InfoBox from "../../../components/InfoBox"
import Link from "../../../components/Link"
import useUpgradeHref from "../../../hooks/useUpgradeHref"
import ButtonLink from "../../../components/ButtonLink"

const BalanceStat: FC<{
  balance: string | number
  icon: IconEnum
  text: string
  conversionRate?: number | string
  tokenDecimals?: number
}> = ({ balance, icon, text, conversionRate, tokenDecimals }) => {
  return (
    <HStack justify="space-between">
      <TokenBalance
        tokenAmount={balance}
        tokenSymbol={text}
        withSymbol
        tokenDecimals={tokenDecimals}
        icon={icon}
        iconSize="24px"
      />
      {conversionRate && (
        <BodySm color={useColorModeValue("gray.500", "gray.300")}>
          1 {text} = {conversionRate} T
        </BodySm>
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

  const upgradeHref = useUpgradeHref()

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
      {/* title */}
      <BodyMd mb={2}>Liquid Tokens</BodyMd>

      {/* colored asset bar */}
      <MultiSegmentProgress values={progressBarValues} />

      {/* token balances */}
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

      <LineDivider borderColor="gray.300" />

      {/* Possible amount */}
      <BodyMd>Possible T amount</BodyMd>
      <InfoBox mt={4} direction="row" p={4}>
        <TokenBalance
          tokenAmount={conversionToTAmount}
          withSymbol
          tokenSymbol="T"
          icon={t.icon}
          isLarge
        />
      </InfoBox>

      {/* Link to upgrade page */}
      <ButtonLink size="lg" isFullWidth mt={4} to={upgradeHref}>
        Upgrade Tokens
      </ButtonLink>

      {/* exchange rate link */}
      <BodySm
        color={useColorModeValue("gray.500", "gray.300")}
        mt="4"
        textAlign="center"
      >
        <Link isExternal href={ExternalHref.exchangeRateLearnMore}>
          Read More
        </Link>{" "}
        about Exchange Rate
      </BodySm>
    </CardTemplate>
  )
}

export default WalletBalances
