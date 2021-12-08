import { FC } from "react"
import { Button, Grid, GridItem, HStack, Image } from "@chakra-ui/react"
import TotalValueLocked from "./TotalValueLocked"
import Interest from "./Interest"
import Governance from "./Governance"
import UpgradeBanner from "./UpgradeBanner"
import WalletBalances from "./WalletBalances"
import Nodes from "./Nodes"

const Network: FC = () => {
  return (
    <Grid
      templateRows="repeat(5, 1fr)"
      templateColumns="repeat(2, 1fr)"
      gap={4}
    >
      <GridItem colSpan={2} rowSpan={1}>
        <UpgradeBanner />
      </GridItem>
      <GridItem rowSpan={{ base: 1, md: 2 }} colSpan={{ base: 2, md: 1 }}>
        <WalletBalances />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }} rowSpan={1}>
        <TotalValueLocked />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }} rowSpan={1}>
        <Nodes />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }} rowSpan={2}>
        <Governance />
      </GridItem>
      <GridItem colSpan={{ base: 2, md: 1 }} rowSpan={1}>
        <Interest />
      </GridItem>
    </Grid>
  )
}
export default Network
