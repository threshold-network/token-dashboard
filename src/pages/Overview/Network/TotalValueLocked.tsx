import { FC } from "react"
import numeral from "numeral"
import { Flex } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { H1 } from "../../../components/Typography"

const TotalValueLocked: FC<{ totalValueLocked: number }> = ({
  totalValueLocked,
}) => {
  const tvl = numeral(totalValueLocked).format("$0,00")

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
