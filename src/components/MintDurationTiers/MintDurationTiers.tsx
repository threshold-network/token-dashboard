import { BodyXs, Flex, H5, Stack, VStack } from "@threshold-network/components"
import { FC } from "react"
import { getRangeSign } from "../../utils/getRangeSign"
import { getDurationByNumberOfConfirmations } from "../../utils/tBTC"
import { StackProps } from "@threshold-network/components"
import { ComponentPropsWithoutRef } from "react"
import { RangeOperatorType, CurrencyType } from "../../types"
import { useThreshold } from "../../contexts/ThresholdContext"

type BaseProps = ComponentPropsWithoutRef<"li"> & StackProps
type MintDurationTiersItemProps = {
  amount: number
  currency: CurrencyType
  rangeOperator: RangeOperatorType
}

interface MintDurationTiersProps extends BaseProps {
  items: MintDurationTiersItemProps[]
}

const MintDurationTiers: FC<MintDurationTiersProps> = ({
  items,
  ...restProps
}) => {
  const {
    tbtc: {
      minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount,
    },
  } = useThreshold()

  return (
    <Stack
      direction={{
        base: "column",
        sm: "row",
      }}
      spacing={{
        base: 3,
        md: 6,
      }}
      {...restProps}
    >
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
          <Flex
            key={index}
            flexFlow={{ sm: "column" }}
            flex="1"
            rounded="md"
            boxShadow="md"
          >
            <Flex
              flexFlow="column"
              justifyContent="center"
              textAlign="center"
              bg="purple.50"
              w="full"
              px="3"
              py="2"
            >
              <H5 color="purple.700">
                {hours} {hoursSuffix}
              </H5>
              <BodyXs color="purple.700" whiteSpace="nowrap">
                + {confirmations} {confirmationsSuffix}
              </BodyXs>
            </Flex>
            <VStack
              px={{
                base: 4,
                sm: 4,
                md: 8,
              }}
              py="5"
              w="full"
              mt="0"
              spacing="0"
            >
              <H5 alignSelf="start" color="gray.500" whiteSpace="nowrap">
                {rangeSign} {formattedAmount}
              </H5>
              <BodyXs alignSelf="end" color="gray.500">
                {currency}
              </BodyXs>
            </VStack>
          </Flex>
        )
      })}
    </Stack>
  )
}

export default MintDurationTiers
