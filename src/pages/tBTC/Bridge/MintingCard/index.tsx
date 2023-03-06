import { ComponentProps, FC, useEffect } from "react"
import { Card } from "@threshold-network/components"
import { MintingTimeline } from "./MintingTimeline"
import { Box, StackDivider, Stack } from "@chakra-ui/react"
import { MintingFlowRouter } from "./MintingFlowRouter"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { useTBTCDepositDataFromLocalStorage } from "../../../../hooks/tbtc"
import { useWeb3React } from "@web3-react/core"
import { isSameETHAddress } from "../../../../web3/utils"
import { ExternalPool } from "../../../../components/tBTC/ExternalPool"

export const MintingCard: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  const { tBTCDepositData } = useTBTCDepositDataFromLocalStorage()
  const { btcDepositAddress, updateState } = useTbtcState()
  const { account } = useWeb3React()
  const { curveTBTCPool } = useTbtcState()

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

  return (
    <>
      <Card {...props} minW="0">
        <Stack
          direction={{
            base: "column",
            xl: "row",
          }}
          divider={<StackDivider />}
          h="100%"
          spacing={8}
        >
          <Box
            w={{
              base: "100%",
              xl: "66%",
            }}
          >
            <MintingFlowRouter />
          </Box>
          <Box
            w={{
              base: "100%",
              xl: "33%",
            }}
            minW={"216px"}
          >
            <MintingTimeline />
          </Box>
        </Stack>
      </Card>
      {/* TODO: ExternalPool is placed here just for a showcase. This might not be the best place for it, so feel free to remove it */}
      <ExternalPool
        title={"TBTC Curve Pool"}
        externalPoolData={{ poolName: "tBTC/WBTC/sBTC", ...curveTBTCPool }}
        mt={4}
      />
    </>
  )
}
