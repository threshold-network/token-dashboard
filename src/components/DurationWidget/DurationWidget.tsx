import {
  BodyLg,
  BodyXs,
  Box,
  Flex,
  HStack,
  LabelSm,
} from "@threshold-network/components"
import { parseUnits } from "ethers/lib/utils"
import { getRangeSign } from "../../utils/getRangeSign"
import { getThresholdLib } from "../../utils/getThresholdLib"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { DurationWidgetProps } from "./DurationWidget.types"

const { minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount } =
  getThresholdLib().tbtc

function DurationWidget(props: DurationWidgetProps) {
  const { label = "Duration", amount, ...restProps } = props

  const [operator, value, currency] = amount
  const sign = getRangeSign(operator)

  const formattedValue = value.toFixed(2)
  const confirmations = getNumberOfConfirmationsByAmount(
    parseUnits(formattedValue)
  )
  const duration = getDurationByNumberOfConfirmations(confirmations)
  const durationPrefix = Number.isInteger(duration) ? "~" : ""
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
          {durationPrefix} {duration} {durationSuffix}
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

export default DurationWidget
