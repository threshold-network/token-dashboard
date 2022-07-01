import { Grid, useMediaQuery } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { TbtcBalanceCard } from "./TbtcBalanceCard"
import { MintUnmintNav } from "./MintUnmintNav"
import { MintingCard } from "./MintingCard"
import { UnmintingCard } from "./UnmintingCard"
import { TransactionHistory } from "./TransactionHistory"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { TbtcMintingType } from "../../../types/tbtc"
import { useEffect } from "react"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"

const TBTCBridge: PageComponent = (props) => {
  const { mintingType } = useTbtcState()
  const { openModal, closeModal } = useModal()

  const [isSmallerThan1280] = useMediaQuery("(max-width: 1280px)")

  useEffect(() => {
    if (isSmallerThan1280) {
      openModal(ModalType.UseDesktop)
    } else {
      closeModal()
    }
  }, [isSmallerThan1280])

  return (
    <Grid
      maxW="1040px"
      gridAutoColumns="minmax(0, 1fr)"
      gridAutoFlow="column"
      gridTemplate={{
        base: `
            "tbtc-balance           mint-nav      mint-nav      mint-nav"
            "tbtc-balance           mint-card     mint-card     mint-card"
            "transaction-history    mint-card     mint-card     mint-card"
          `,
        xl: `
            "tbtc-balance           mint-nav      mint-nav      mint-nav"
            "tbtc-balance           mint-card     mint-card     mint-card"
            "transaction-history    mint-card     mint-card     mint-card"
          `,
      }}
      gridGap="4"
    >
      <TbtcBalanceCard gridArea="tbtc-balance" />
      <MintUnmintNav gridArea="mint-nav" />
      <TransactionHistory gridArea="transaction-history" />
      {mintingType === TbtcMintingType.mint && (
        <MintingCard gridArea="mint-card" />
      )}
      {mintingType === TbtcMintingType.unmint && (
        <UnmintingCard gridArea="mint-card" />
      )}
    </Grid>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
}

export default TBTCBridge
