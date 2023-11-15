import { useWeb3React } from "@web3-react/core"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useBridgeContract } from "./useBridgeContract"
import { tbtcSlice } from "../../store/tbtc"
import { BigNumber, Event } from "ethers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { fromSatoshiToTokenPrecision } from "../../threshold-ts/utils"

export const useSubscribeToRedemptionRequestedEvent = () => {
  const contract = useBridgeContract()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const threshold = useThreshold()

  useSubscribeToContractEvent(
    contract,
    "RedemptionRequested",
    //@ts-ignore
    async (
      walletPublicKeyHash: string,
      redeemerOutputScript: string,
      redeemer: string,
      requestedAmount: BigNumber,
      treasuryFee: BigNumber,
      txMaxFee: BigNumber,
      event: Event
    ) => {
      if (!account || !isSameETHAddress(redeemer, account)) return

      const redemptionKey = threshold.tbtc.buildRedemptionKey(
        walletPublicKeyHash,
        redeemerOutputScript
      )

      dispatch(
        tbtcSlice.actions.redemptionRequested({
          amount: fromSatoshiToTokenPrecision(requestedAmount).toString(),
          txHash: event.transactionHash,
          redemptionKey,
          blockNumber: event.blockNumber,
          additionalData: { redeemerOutputScript, walletPublicKeyHash },
        })
      )
    },
    [null, null, account]
  )
}
