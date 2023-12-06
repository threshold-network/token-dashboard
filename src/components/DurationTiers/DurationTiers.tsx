import { BodyXs, Box, H5, Stack, VStack } from "@threshold-network/components"
import { FC } from "react"
import { getRangeSign } from "../../utils/getRangeSign"
import {
  getDurationByAmount,
  getNumberOfConfirmationsByAmount,
} from "../../utils/tBTC"
import { DurationTiersProps } from "./DurationTiers.types"

const DurationTiers: FC<DurationTiersProps> = ({ items, ...restProps }) => (
  <Stack direction="row" spacing="6" {...restProps}>
    {items.map(({ amount, rangeOperator, currency }, index) => {
      const correctedAmount =
        amount + (rangeOperator.includes("greater") ? 0.01 : -0.01)
      const hours = getDurationByAmount(correctedAmount)
      const confirmations = getNumberOfConfirmationsByAmount(correctedAmount)

      const hoursSuffix = hours === 1 ? "hour" : "hours"
      const confirmationsSuffix =
        confirmations === 1 ? "confirmation" : "confirmations"
      const rangeSign = getRangeSign(rangeOperator)
      const formattedAmount = amount.toFixed(2)

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
