import { FC } from "react"
import { Flex } from "@chakra-ui/react"
import CardTemplate from "./CardTemplate"
import { H1 } from "../../../components/Typography"
import { formatFiatCurrencyAmount } from "../../../utils/formatAmount"
import { useWeb3React } from "@web3-react/core"

const TotalValueLocked: FC<{ totalValueLocked: number | string }> = ({
  totalValueLocked,
}) => {
  const tvl = formatFiatCurrencyAmount(totalValueLocked)
  const { account } = useWeb3React()

  /* TODO: This is a hack - we need a way to load on-chain data without a connected wallet */
  return (
    <CardTemplate title="TOTAL VALUE LOCKED" h="auto">
      <Flex justifyContent="center">
        <H1
          fontSize={account ? { base: "4xl", lg: "6xl" } : "xl"}
          fontWeight="700"
        >
          {account ? tvl : "Please connect your wallet"}
        </H1>
      </Flex>
    </CardTemplate>
  )
}

export default TotalValueLocked
