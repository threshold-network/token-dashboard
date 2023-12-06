import { useEffect } from "react"
import { Outlet } from "react-router"
import { useWeb3React } from "@web3-react/core"
import { MintingStep, PageComponent } from "../../../types"
import { DepositDetails } from "./DepositDetails"
import { ResumeDepositPage } from "./ResumeDeposit"
import { MintingTimeline } from "./Minting/MintingTimeline"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { isSameETHAddress } from "../../../web3/utils"
import { MintingFlowRouter } from "./Minting/MintingFlowRouter"

import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import { BridgeProcessEmptyState } from "./components/BridgeProcessEmptyState"
import { useToast } from "../../../hooks/useToast"
import { MintDurationWidget } from "../../../components/MintDurationWidget"
import { useIsTbtcSdkInitializing } from "../../../contexts/ThresholdContext"

export const MintPage: PageComponent = ({}) => {
  return <Outlet />
}

export const MintingFormPage: PageComponent = ({ ...props }) => {
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()
  const { btcDepositAddress, updateState } = useTbtcState()
  const { account } = useWeb3React()
  const { isSdkInitializing, isSdkInitializedWithSigner } =
    useIsTbtcSdkInitializing()

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
      // When the code enters this if, this means that the deposit data is
      // placed in tBTC local storage and we need to update the store with that
      // data. The SDK might still be initializing though, so we should show the
      // loading state as soon as possible. That's why we are setting the
      // `mintingStep` as undefined when we notice that sdk is initializing -
      // this will display a loading state for the minting flow, and then
      // redirect to the correct step.
      if (isSdkInitializing) updateState("mintingStep", undefined)

      if (!isSdkInitializing && isSdkInitializedWithSigner) {
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
    }
  }, [account, isSdkInitializing, isSdkInitializedWithSigner])

  return <MintingFlowRouter />
}

MintingFormPage.route = {
  path: "",
  index: false,
  isPageEnabled: true,
}

const MintPageLayout: PageComponent = () => {
  const { active } = useWeb3React()
  const { ToastContainer } = useToast("tbtc-bridge-minting", {
    isDismissable: true,
  })
  const { mintingStep } = useTbtcState()
  const shouldRenderDurationWidget = ![
    MintingStep.ProvideData,
    MintingStep.Deposit,
  ].includes(mintingStep)

  return (
    <>
      <ToastContainer />
      <BridgeLayout>
        <BridgeLayoutMainSection>
          {active ? (
            <Outlet />
          ) : (
            <BridgeProcessEmptyState title="Ready to mint tBTC?" />
          )}
        </BridgeLayoutMainSection>
        <BridgeLayoutAsideSection>
          {shouldRenderDurationWidget && (
            <MintDurationWidget amount={["less", 1, "BTC"]} /> // TODO: Read prop values from the store
          )}
          <MintingTimeline />
        </BridgeLayoutAsideSection>
      </BridgeLayout>
    </>
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
