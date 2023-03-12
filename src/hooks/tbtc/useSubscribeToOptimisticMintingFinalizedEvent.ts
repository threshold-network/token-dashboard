import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { tbtcSlice } from "../../store/tbtc"
import { useAppDispatch } from "../store"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { MintingStep } from "../../types/tbtc"
import { useThreshold } from "../../contexts/ThresholdContext"

type OptimisticMintingFinalizedEventCallback = (
  minter: string,
  depositKey: BigNumber,
  depositor: string,
  optimisticMintingDebt: BigNumber,
  event: Event
) => void

export const useSubscribeToOptimisticMintingFinalizedEventBase = (
  callback: OptimisticMintingFinalizedEventCallback,
  filterParams?: any[],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tbtcVaultContract = useTBTCVaultContract()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingFinalized",
    //@ts-ignore
    callback,
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}

export const useSubscribeToOptimisticMintingFinalizedEvent = () => {
  const threshold = useThreshold()
  const { updateState, utxo, mintingStep } = useTbtcState()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useSubscribeToOptimisticMintingFinalizedEventBase(
    (...args) => {
      const [, depositKey, , , event] = args
      const depositKeyFromEvent = depositKey.toHexString()
      const depositKeyFromUTXO = utxo
        ? threshold.tbtc.buildDepositKey(
            utxo.transactionHash.toString(),
            utxo.outputIndex,
            "big-endian"
          )
        : ""

      if (
        mintingStep === MintingStep.MintingSuccess &&
        depositKeyFromEvent === depositKeyFromUTXO
      ) {
        updateState("optimisticMintingFinalizedTxHash", event.transactionHash)
      }

      dispatch(
        tbtcSlice.actions.optimisticMintingFinalized({
          depositKey: depositKeyFromEvent,
          txHash: event.transactionHash,
        })
      )
    },
    [null, null, account]
  )
}
