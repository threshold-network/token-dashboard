import { FC } from "react"
import numeral from "numeral"
import { Flex, useMediaQuery } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { H1, H3 } from "../../../components/Typography"
import useChakraBreakpoint from "../../../hooks/useChakraBreakpoint"

const TotalValueLocked: FC<{ totalValueLocked: number }> = ({
  totalValueLocked,
}) => {
  const tvl = numeral(totalValueLocked).format("$0,00")

  return (
    <CardTemplate title="TOTAL VALUE LOCKED" h="auto">
      <Flex justifyContent={{ base: "flex-start", md: "center" }}>
        <H1 fontSize={{ base: "4xl", lg: "6xl" }} fontWeight="700">
          {tvl}
        </H1>
      </Flex>
    </CardTemplate>
  )
}

export default TotalValueLocked
