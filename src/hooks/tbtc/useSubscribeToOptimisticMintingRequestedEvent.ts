import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { MintingStep } from "../../types/tbtc"
import { useThreshold } from "../../contexts/ThresholdContext"

type OptimisticMintingRequestedEventCallback = (
  minter: string,
  depositKey: BigNumber,
  depositor: string,
  amount: BigNumber,
  fundingTxHash: unknown,
  fundingOutputIndex: BigNumber,
  event: Event
) => void

export const useSubscribeToOptimisticMintingRequestedEventBase = (
  callback: OptimisticMintingRequestedEventCallback,
  filterParams?: any[string],
  shouldSubscribeIfUserNotConnected: boolean = false
) => {
  const tbtcVaultContract = useTBTCVaultContract()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingRequested",
    //@ts-ignore
    callback,
    filterParams,
    shouldSubscribeIfUserNotConnected
  )
}

export const useSubscribeToOptimisticMintingRequestedEvent = () => {
  const threshold = useThreshold()
  const { updateState, utxo, mintingStep } = useTbtcState()
  const { account } = useWeb3React()

  useSubscribeToOptimisticMintingRequestedEventBase(
    (
      minter: string,
      depositKey: BigNumber,
      depositor: string,
      amount: BigNumber,
      fundingTxHash: unknown,
      fundingOutputIndex: BigNumber,
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
        updateState("optimisticMintingRequestedTxHash", event.transactionHash)
      }
    },
    [null, null, account]
  )
}
