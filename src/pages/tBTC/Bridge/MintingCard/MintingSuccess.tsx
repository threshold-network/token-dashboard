import { FC } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { Navigate } from "react-router"

const MintingSuccessComponent: FC = () => {
  const threshold = useThreshold()
  const { utxo } = useTbtcState()

  const btcDepositTxHash = utxo.transactionHash.toString()
  const depositKey = threshold.tbtc.buildDepositKey(
    btcDepositTxHash,
    utxo.outputIndex,
    "big-endian"
  )

  return <Navigate to={`/tBTC/mint/deposit/${depositKey}`} />
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
