import { FC, useEffect } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { Navigate } from "react-router"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"

const MintingSuccessComponent: FC = () => {
  const threshold = useThreshold()
  const { utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()

  const btcDepositTxHash = utxo.transactionHash.toString()
  const depositKey = threshold.tbtc.buildDepositKey(
    btcDepositTxHash,
    utxo.outputIndex,
    "big-endian"
  )

  useEffect(() => {
    removeDepositData()
  }, [removeDepositData])

  return (
    <Navigate
      to={`/tBTC/mint/deposit/${depositKey}`}
      state={{ shouldStartFromFirstStep: true }}
      replace={true}
    />
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
