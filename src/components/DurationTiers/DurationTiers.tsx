import { BodyXs, Box, H5, Stack, VStack } from "@threshold-network/components"
import { FixedNumber } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import { FC } from "react"
import { formatSatoshi } from "../../utils/formatAmount"
import { getRangeSign } from "../../utils/getRangeSign"
import { getThresholdLib } from "../../utils/getThresholdLib"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { DurationTiersProps } from "./DurationTiers.types"

const { minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount } =
  getThresholdLib().tbtc

const DurationTiers: FC<DurationTiersProps> = ({ items, ...restProps }) => (
  <Stack direction="row" spacing="6" {...restProps}>
    {items.map(({ amount, rangeOperator, currency }, index) => {
      const correctedAmount =
        amount + (rangeOperator.includes("greater") ? 0.01 : -0.01)
      // The amount is corrected by adding or subtracting 0.01 to the given amount
      // depending on the range operator. This is done to avoid floating-point errors
      // when comparing BigNumber values.
      const safeAmount = Number.isSafeInteger(correctedAmount)
        ? correctedAmount
        : Math.floor((correctedAmount as number) * 1e8)
      // Only safe integers (not floating-point numbers) can be transformed to BigNumber.
      // Converting the given amount to a safe integer if it is not already a safe integer.
      // If the amount is already a safe integer, it is returned as is.
      const confirmations = getNumberOfConfirmationsByAmount(safeAmount)
      const hours = Math.round(
        getDurationByNumberOfConfirmations(confirmations) / 60
      )
      const formattedAmount = amount.toFixed(2)

      const hoursSuffix = hours === 1 ? "hour" : "hours"
      const confirmationsSuffix =
        confirmations === 1 ? "confirmation" : "confirmations"
      const rangeSign = getRangeSign(rangeOperator)
      return (
        <Box key={index} flex="1" rounded="md" boxShadow="md">
          <Box textAlign="center" bg="purple.50" w="full" px="3" py="2">
            <H5 color="purple.700">
              {hours} {hoursSuffix}
            </H5>
            <BodyXs color="purple.700">
              + {confirmations} {confirmationsSuffix}
            </BodyXs>
          </Box>
          <VStack px="8" py="5" w="full" mt="0" spacing="0">
            <H5 alignSelf="start" color="gray.500">
              {rangeSign} {formattedAmount}
            </H5>
            <BodyXs alignSelf="end" color="gray.500">
              {currency}
            </BodyXs>
          </VStack>
        </Box>
      )
    })}
  </Stack>
)

export default DurationTiers
