import { BigNumber } from "ethers"
import { useWeb3React } from "@web3-react/core"
import { tbtcSlice } from "../../store/tbtc"
import { useAppDispatch } from "../store"
import { useTBTCVaultContract } from "./useTBTCVaultContract"
import { useSubscribeToContractEvent } from "../../web3/hooks"

export const useSubscribeToOptimisticMintingFinalizedEvent = () => {
  const tbtcVaultContract = useTBTCVaultContract()
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()

  useSubscribeToContractEvent(
    tbtcVaultContract,
    "OptimisticMintingFinalized",
    //@ts-ignore
    (minter: string, depositKey: BigNumber) => {
      dispatch(
        tbtcSlice.actions.optimisticMintingFinalized({
          depositKey: depositKey.toHexString(),
        })
      )
    },
    [null, null, account]
  )
}
