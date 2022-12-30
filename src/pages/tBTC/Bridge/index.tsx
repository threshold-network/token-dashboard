import { HStack, useMediaQuery, VStack } from "@threshold-network/components"
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
import { useAppDispatch, useAppSelector } from "../../../hooks/store"
import { selectBridgeTransacionHistory, tbtcSlice } from "../../../store/tbtc"
import { useWeb3React } from "@web3-react/core"

const TBTCBridge: PageComponent = (props) => {
  const { mintingType } = useTbtcState()
  const { openModal, closeModal } = useModal()
  const dispatch = useAppDispatch()
  const bridgeTransactionHistory = useAppSelector(selectBridgeTransacionHistory)
  const { account } = useWeb3React()

  const [isSmallerThan1280] = useMediaQuery("(max-width: 1280px)")

  useEffect(() => {
    if (!account) return

    dispatch(
      tbtcSlice.actions.requestBridgeTransactionHistory({
        depositor: account,
      })
    )
  }, [dispatch, account])

  useEffect(() => {
    if (isSmallerThan1280) {
      openModal(ModalType.UseDesktop)
    } else {
      closeModal()
    }
  }, [isSmallerThan1280])

  return (
    <HStack
      alignItems={{ base: "flex-end", lg: "flex-start" }}
      w={"100%"}
      flexDirection={{ base: "column", lg: "row" }}
      spacing={4}
    >
      <VStack
        spacing={4}
        mb={{ base: 10, xl: 0 }}
        w={{ base: "100%", lg: "40%", xl: "25%" }}
      >
        <TbtcBalanceCard />
        <TransactionHistory data={bridgeTransactionHistory} />
      </VStack>
      <VStack spacing={4} w={{ base: "100%", lg: "60%", xl: "75%" }}>
        <MintUnmintNav w={"100%"} />
        {mintingType === TbtcMintingType.mint && <MintingCard p={35} />}
        {mintingType === TbtcMintingType.unmint && <UnmintingCard p={35} />}
      </VStack>
    </HStack>
  )
}

TBTCBridge.route = {
  path: "",
  index: false,
  title: "Bridge",
  isPageEnabled: true,
}

export default TBTCBridge
