import { useEffect } from "react"
import { Outlet } from "react-router"
import { useWeb3React } from "@web3-react/core"
import { Box, Card, Stack, StackDivider } from "@threshold-network/components"
import { PageComponent } from "../../../types"
import { DepositDetails } from "./DepositDetails"
import { ResumeDepositPage } from "./ResumeDeposit"
import { MintingTimeline } from "./Minting/MintingTimeline"
import { useTBTCDepositDataFromLocalStorage } from "../../../hooks/tbtc"
import { useTbtcState } from "../../../hooks/useTbtcState"
import { isSameETHAddress } from "../../../web3/utils"
import { MintingFlowRouter } from "./Minting/MintingFlowRouter"

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
  return (
    <Stack
      as={Card}
      direction={{
        base: "column",
        xl: "row",
      }}
      divider={<StackDivider />}
      spacing={8}
      minW="0"
      alignItems="flex-start"
      gap="unset"
    >
      <Box
        w={{
          base: "100%",
          xl: "66%",
        }}
      >
        <Outlet />
      </Box>
      <MintingTimeline
        w={{
          base: "100%",
          xl: "33%",
        }}
        minW={"216px"}
      />
    </Stack>
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
