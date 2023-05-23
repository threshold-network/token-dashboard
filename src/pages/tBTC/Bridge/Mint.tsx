import { useEffect } from "react"
import { Outlet } from "react-router"
import { useWeb3React } from "@web3-react/core"
import { H5 } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { DepositDetails } from "./DepositDetails"
import { ResumeDepositPage } from "./ResumeDeposit"
import { MintingTimeline } from "./Minting/MintingTimeline"
import {
  useFetchRecentDeposits,
  useTBTCDepositDataFromLocalStorage,
} from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { isSameETHAddress } from "../../../web3/utils"
import { MintingFlowRouter } from "./Minting/MintingFlowRouter"
import { useFetchTvl } from "../../../hooks/useFetchTvl"
import { TbtcMintingCardTitle } from "./components/TbtcMintingCardTitle"
import SubmitTxButton from "../../../components/SubmitTxButton"
import {
  ProtocolHistoryRecentDeposits,
  ProtocolHistoryTitle,
  ProtocolHistoryViewMoreLink,
  TVL,
} from "../../../components/tBTC"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"

export const MintPage: PageComponent = ({}) => {
  return <Outlet />
}

export const MintingFormPage: PageComponent = ({ ...props }) => {
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()
  const { btcDepositAddress, updateState } = useTbtcState()
  const { account } = useWeb3React()

  useEffect(() => {
    // Update the store with the deposit data if the account is placed in tbtc
    // local storage.
    if (
      tBTCDepositData &&
      account &&
      tBTCDepositData[account] &&
      isSameETHAddress(tBTCDepositData[account].ethAddress, account) &&
      tBTCDepositData[account].btcDepositAddress !== btcDepositAddress
    ) {
      const {
        btcDepositAddress,
        ethAddress,
        blindingFactor,
        btcRecoveryAddress,
        walletPublicKeyHash,
        refundLocktime,
      } = tBTCDepositData[account]

      updateState("ethAddress", ethAddress)
      updateState("blindingFactor", blindingFactor)
      updateState("btcRecoveryAddress", btcRecoveryAddress)
      updateState("walletPublicKeyHash", walletPublicKeyHash)
      updateState("refundLocktime", refundLocktime)
      // We reset the minting step to undefined to show skeleton and the
      // useEffect in MintingFlowRouter will update and set the proper minting
      // step when it recognizes the "btcDepositAddress" change.
      updateState("mintingStep", undefined)
      updateState("btcDepositAddress", btcDepositAddress)
    }
  }, [account])

  return <MintingFlowRouter />
}

MintingFormPage.route = {
  path: "",
  index: false,
  isPageEnabled: true,
}

const MintPageLayout: PageComponent = () => {
  const { active } = useWeb3React()
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()
  const [deposits] = useFetchRecentDeposits(3)

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <BridgeLayout>
      <BridgeLayoutMainSection>
        {active ? (
          <Outlet />
        ) : (
          <>
            <TbtcMintingCardTitle />
            <H5 align={"center"}>Ready to mint tBTC?</H5>
            <SubmitTxButton mb="6" mt="4" />
            <TVL tvl={tvl.tBTC} tvlInUSD={tvlInUSD.tBTC} />
            <ProtocolHistoryTitle mt="8" />
            <ProtocolHistoryRecentDeposits
              deposits={deposits}
              _after={{
                content: `" "`,
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "100px",
                opacity: "0.9",
                background:
                  "linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 117.78%)",
              }}
            />
            <ProtocolHistoryViewMoreLink mt="7" />
          </>
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        <MintingTimeline />
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

MintPageLayout.route = {
  path: "",
  index: false,
  isPageEnabled: true,
  pages: [MintingFormPage, ResumeDepositPage],
}

MintPage.route = {
  path: "mint",
  pathOverride: "mint/*",
  index: true,
  title: "Mint",
  pages: [MintPageLayout, DepositDetails],
  isPageEnabled: true,
}
