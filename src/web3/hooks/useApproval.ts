import { useSendTransaction } from "./useSendTransaction"
import { useTokenAllowance } from "./useTokenAllowance"
import { MaxUint256 } from "@ethersproject/constants"
import { BigNumber } from "ethers"
import { Contract } from "@ethersproject/contracts"

const useApproval = (
  tokenContract?: Contract,
  spender?: string,
  onSuccess?: () => void | Promise<void>
) => {
  const { sendTransaction, status } = useSendTransaction(
    tokenContract!,
    "approve",
    onSuccess
  )

  const allowance = useTokenAllowance(tokenContract, spender)

  const approve = async (amountToApprove = MaxUint256.toString()) => {
    if (BigNumber.from(amountToApprove).gte(BigNumber.from(allowance))) {
      await sendTransaction(spender, amountToApprove)
    }
  }

  return { approve, status }
}

export default useApproval
