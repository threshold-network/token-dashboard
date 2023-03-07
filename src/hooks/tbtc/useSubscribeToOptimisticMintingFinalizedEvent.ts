import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { tbtcSlice } from "../../store/tbtc"
import { useAppDispatch } from "../store"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { MintingStep } from "../../types/tbtc"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useSubscribeToOptimisticMintingFinalizedEvent = () => {
  const tbtcVaultContract = useTBTCVaultContract()
  const threshold = useThreshold()
  const { updateState, utxo, mintingStep } = useTbtcState()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingFinalized",
    //@ts-ignore
    (
      minter: string,
      depositKey: BigNumber,
      depositor: string,
      optimisticMintingDebt: BigNumber,
      event: Event
    ) => {
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
