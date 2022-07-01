import { FC } from "react"
import { Flex } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { H1 } from "@threshold-network/components"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"

const TotalValueLocked: FC<{ totalValueLocked: number | string }> = ({
  totalValueLocked,
}) => {
  const tvl = formatFiatCurrencyAmount(totalValueLocked)

  return (
    <CardTemplate title="TOTAL VALUE LOCKED" h="auto">
      <Flex justifyContent="center">
        <H1 fontSize={{ base: "4xl", lg: "6xl" }} fontWeight="700">
          {tvl}
        </H1>
      </Flex>
    </CardTemplate>
  )
}

export default TotalValueLocked
