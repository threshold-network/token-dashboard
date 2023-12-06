import { useSendTransaction } from "./useSendTransaction"
import { MaxUint256 } from "@ethersproject/constants"
import { Contract } from "@ethersproject/contracts"

const useApproveAndCall = (
  tokenContract?: Contract,
  spender?: string,
  extraCallData?: Uint8Array,
  onSuccess?: () => void | Promise<void>
) => {
  const { sendTransaction, status } = useSendTransaction(
    tokenContract!,
    "approveAndCall",
    onSuccess
  )

  const approveAndCall = async (amountToApprove = MaxUint256.toString()) => {
    await sendTransaction(
      spender,
      amountToApprove,
      extraCallData ?? Uint8Array.from([])
    )
  }

  return { approveAndCall, status }
}

export default useApproveAndCall
