import {
  BodyLg,
  BodyXs,
  Box,
  Flex,
  HStack,
  LabelSm,
} from "@threshold-network/components"
import { FC } from "react"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { BoxProps } from "@threshold-network/components"
import { CurrencyType } from "../../types"

interface MintDurationWidgetProps extends BoxProps {
  label?: string
  confirmations: number
  currency: CurrencyType
}

const amountMap = new Map<number, string>([
  [1, "< 0.10"],
  [3, "< 1.00"],
  [6, ">= 1.00"],
])

const MintDurationWidget: FC<MintDurationWidgetProps> = ({
  label = "Duration",
  confirmations,
  currency,
  ...restProps
}) => {
  const durationInMinutes = getDurationByNumberOfConfirmations(confirmations)
  // Round up the minutes to the nearest half-hour
  const hours = (Math.round(durationInMinutes / 30) * 30) / 60
  const hoursSuffix = hours === 1 ? "Hour" : "Hours"

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
          ~ {hours} {hoursSuffix}
        </BodyXs>
        <Flex alignItems="end" color="gray.500">
          <BodyLg>{amountMap.get(confirmations)}</BodyLg>
          <BodyXs ml="1.5" mb="0.5">
            {currency}
          </BodyXs>
        </Flex>
      </HStack>
    </Box>
  )
}

export default MintDurationWidget
