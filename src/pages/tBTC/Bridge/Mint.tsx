import { useEffect } from "react"
import { Outlet } from "react-router"
import { useIsActive } from "../../../hooks/useIsActive"
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
import { MintDurationWidget } from "../../../components/MintDurationWidget"
import { useThreshold } from "../../../contexts/ThresholdContext"
import { useCheckDepositExpirationTime } from "../../../hooks/tbtc/useCheckDepositExpirationTime"
import { useRemoveDepositData } from "../../../hooks/tbtc/useRemoveDepositData"

export const MintPage: PageComponent = ({}) => {
  return <Outlet />
}

export const MintingFormPage: PageComponent = ({ ...props }) => {
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()
  const { btcDepositAddress, updateState, resetDepositData } = useTbtcState()
  const { account, chainId } = useIsActive()
  const checkDepositExpiration = useCheckDepositExpirationTime()
  const removeDepositData = useRemoveDepositData()

  useEffect(() => {
    const updateDepositData = async () => {
      if (
        tBTCDepositData &&
        account &&
        chainId &&
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
          extraData,
          chainName,
        } = tBTCDepositData[account]
        const { isExpired } = await checkDepositExpiration(refundLocktime)
        if (isExpired) {
          resetDepositData()
          removeDepositData()
          return
        }

        updateState("ethAddress", ethAddress)
        updateState("blindingFactor", blindingFactor)
        updateState("btcRecoveryAddress", btcRecoveryAddress)
        updateState("walletPublicKeyHash", walletPublicKeyHash)
        updateState("refundLocktime", refundLocktime)
        updateState("extraData", extraData)
        updateState("chainName", chainName)
        // We reset the minting step to undefined to show skeleton and the
        // useEffect in MintingFlowRouter will update and set the proper minting
        // step when it recognizes the "btcDepositAddress" change.
        updateState("mintingStep", undefined)
        updateState("btcDepositAddress", btcDepositAddress)
      } else {
        resetDepositData()
      }
    }

    // Update the store with the deposit data if the account is placed in tbtc
    // local storage.

    updateDepositData()
  }, [account, tBTCDepositData])

  return <MintingFlowRouter />
}

MintingFormPage.route = {
  path: "",
  index: false,
  isPageEnabled: true,
}

const MintPageLayout: PageComponent = () => {
  const { isActive } = useIsActive()
  const { mintingStep, utxo } = useTbtcState()
  const {
    tbtc: {
      minimumNumberOfConfirmationsNeeded: getNumberOfConfirmationsByAmount,
    },
  } = useThreshold()

  const shouldRenderDurationWidget = ![
    MintingStep.ProvideData,
    MintingStep.Deposit,
    undefined,
  ].includes(mintingStep)
  const confirmations = getNumberOfConfirmationsByAmount(utxo?.value || 0)

  return (
    <BridgeLayout>
      <BridgeLayoutMainSection>
        {isActive ? (
          <Outlet />
        ) : (
          <BridgeProcessEmptyState title="Ready to mint tBTC?" />
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        {shouldRenderDurationWidget && (
          <MintDurationWidget confirmations={confirmations} currency="BTC" />
        )}
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
