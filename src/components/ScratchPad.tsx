import { useKeep } from "../web3/hooks/useKeep"
import { useMemo } from "react"

export const ScratchPad = ({}) => {
  const { balance } = useKeep()

  return <div>yo: {balance}</div>
}
