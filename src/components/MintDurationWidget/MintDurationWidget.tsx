import {
  BodyLg,
  BodyXs,
  Box,
  Flex,
  HStack,
  LabelSm,
} from "@threshold-network/components"
import { FC } from "react"
import { useThreshold } from "../../contexts/ThresholdContext"
import { getRangeSign } from "../../utils/getRangeSign"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { BoxProps } from "@threshold-network/components"
import { RangeOperatorType, CurrencyType } from "../../types"

interface MintDurationWidgetProps extends BoxProps {
  label?: string
  amount: [RangeOperatorType, number, CurrencyType]
}

const MintDurationWidget: FC<MintDurationWidgetProps> = ({
  label = "Duration",
  amount,
  ...restProps
}) => {
  const [operator, value, currency] = amount
  const sign = getRangeSign(operator)
  const {
    tbtc: {
      minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount,
    },
  } = useThreshold()

  const correctedValue = value + (operator.includes("greater") ? 0.01 : -0.01)
  // The amount is corrected by adding or subtracting 0.01 to the given amount
  // depending on the range operator. This is done to avoid floating-point errors
  // when comparing BigNumber values.
  const safeAmount = Number.isSafeInteger(correctedValue)
    ? value
    : Math.floor(value * 1e8)
  // Only safe integers (not floating-point numbers) can be transformed to BigNumber.
  // Converting the given amount to a safe integer if it is not already a safe integer.
  // If the amount is already a safe integer, it is returned as is.
  const confirmations = getNumberOfConfirmationsByAmount(safeAmount)
  const formattedValue = value.toFixed(2)
  const duration = Math.round(
    getDurationByNumberOfConfirmations(confirmations) / 60
  )
  const durationSuffix = duration === 1 ? "Hour" : "Hours"

  return (
    <Box {...restProps}>
      <LabelSm mb="4">{label}</LabelSm>
      <HStack>
        <BodyXs
          color="purple.700"
          bg="purple.50"
          rounded="sm"
          pl="2"
          pr="4"
          py="1"
        >
          ~ {duration} {durationSuffix}
        </BodyXs>
        <Flex alignItems="end">
          <BodyLg color="gray.500">
            {sign} {formattedValue}
          </BodyLg>
          <BodyXs ml="1.5" mb="0.5" color="gray.500">
            {currency}
          </BodyXs>
        </Flex>
      </HStack>
    </Box>
  )
}

export default MintDurationWidget