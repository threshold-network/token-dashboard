import { Event } from "@ethersproject/contracts"
import { BigNumber, BigNumberish } from "ethers"
import { ModalType } from "../../enums"
import {
  stakingApplicationsSlice,
  StakingAppName,
} from "../../store/staking-applications"
import { useSubscribeToContractEvent } from "../../web3/hooks"
import { useAppDispatch } from "../store"
import { useModal } from "../useModal"
import { useStakingAppContract } from "./useStakingAppContract"

export const useSubscribeToAuthorizationDecreaseRequestedEvent = (
  appName: StakingAppName
) => {
  const contract = useStakingAppContract(appName)
  const { openModal } = useModal()
  const dispatch = useAppDispatch()

  useSubscribeToContractEvent(
    contract,
    "AuthorizationDecreaseRequested",
    // @ts-ignore
    async (
      stakingProvider: string,
      operator: string,
      fromAmount: BigNumberish,
      toAmount: BigNumberish,
      decreasingAt: BigNumberish,
      event: Event
    ) => {
      openModal(ModalType.DeauthorizationInitiated, {
        stakingProvider: stakingProvider,
        txHash: event.transactionHash,
        decreaseAmount: BigNumber.from(toAmount.toString()).sub(
          BigNumber.from(fromAmount.toString()).abs().toString()
        ),
      })
      dispatch(
        stakingApplicationsSlice.actions.authorizationDecreaseRequested({
          stakingProvider,
          appName,
          toAmount: toAmount.toString(),
          decreasingAt: decreasingAt.toString(),
        })
      )
    }
  )
}