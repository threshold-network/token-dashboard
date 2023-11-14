import { useWeb3React } from "@web3-react/core"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { isSameETHAddress } from "../../web3/utils"
import { useAppDispatch } from "../store"
import { useBridgeContract } from "./useBridgeContract"
import { tbtcSlice } from "../../store/tbtc"
import { BigNumber, Event } from "ethers"
import { useThreshold } from "../../contexts/ThresholdContext"
import { useTbtcState } from "../useTbtcState"

type DepositRevealedEventCallback = (
  fundingTxHash: string,
  fundingOutputIndex: number,
  depositor: string,
  amount: BigNumber,
  blindingFactor: any,
  walletPubKeyHash: string,
  refundPubKeyHash: any,
  refundLocktime: any,
  vault: string,
  event: Event
) => void

export const useSubscribeToDepositRevealedEvent = () => {
  const contract = useBridgeContract()
  const { utxo, updateState } = useTbtcState()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const threshold = useThreshold()

  useSubscribeToContractEvent<DepositRevealedEventCallback>(
    contract,
    "DepositRevealed",
    async (
      fundingTxHash,
      fundingOutputIndex,
      depositor,
      amount,
      blindingFactor,
      walletPubKeyHash,
      refundPubKeyHash,
      refundLocktime,
      vault,
      event
    ) => {
      if (!account || !isSameETHAddress(depositor, account)) return

      const { amountToMint } = await threshold.tbtc.getEstimatedDepositFees(
        amount.toString()
      )

      const depositKeyFromEvent = threshold.tbtc.buildDepositKey(
        fundingTxHash,
        fundingOutputIndex
      )
      const depositKeyFromUTXO = utxo
        ? threshold.tbtc.buildDepositKey(
            utxo.transactionHash.toString(),
            utxo.outputIndex,
            "big-endian"
          )
        : ""

      if (depositKeyFromEvent === depositKeyFromUTXO) {
        updateState("depositRevealedTxHash", event.transactionHash)
      }

      dispatch(
        tbtcSlice.actions.depositRevealed({
          fundingOutputIndex,
          fundingTxHash,
          amount: amountToMint,
          txHash: event.transactionHash,
          depositor: depositor,
          depositKey: depositKeyFromEvent,
          blockNumber: event.blockNumber,
        })
      )
    },
    [null, null, account as string]
  )
}
