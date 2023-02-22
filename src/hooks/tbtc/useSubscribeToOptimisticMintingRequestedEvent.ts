import { BigNumber, Event } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useTbtcState } from "../useTbtcState"
import { MintingStep } from "../../types/tbtc"
import { useThreshold } from "../../contexts/ThresholdContext"

export const useSubscribeToOptimisticMintingRequestedEvent = () => {
  const tbtcVaultContract = useTBTCVaultContract()
  const threshold = useThreshold()
  const { updateState, utxo, mintingStep } = useTbtcState()
  const { account } = useWeb3React()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingRequested",
    //@ts-ignore
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
