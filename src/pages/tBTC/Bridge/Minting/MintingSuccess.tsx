import { FC, useEffect } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { Navigate } from "react-router"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useFetchDepositDetails } from "../../../../hooks/tbtc"
import { BridgeProcessDetailsPageSkeleton } from "../components/BridgeProcessDetailsPageSkeleton"

const MintingSuccessComponent: FC = () => {
  const threshold = useThreshold()
  const { utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()

  const btcDepositTxHash = utxo?.transactionHash?.toString()
  const depositKey = threshold.tbtc.buildDepositKey(
    btcDepositTxHash,
    utxo.outputIndex,
    "big-endian"
  )
  const { isFetching, data, error } = useFetchDepositDetails(depositKey)

  useEffect(() => {
    if (!isFetching && data && !error) {
      removeDepositData()
    }
  }, [isFetching, data, error, removeDepositData])

  if ((isFetching || !data) && !error) {
    return <BridgeProcessDetailsPageSkeleton />
  }

  return (
    <Navigate
      to={`/tBTC/mint/deposit/${depositKey}`}
      state={{
        shouldStartFromFirstStep: !data?.optimisticMintingFinalizedTxHash,
      }}
      replace={true}
    />
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
