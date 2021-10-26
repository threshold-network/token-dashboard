import { useReduxToken } from "../hooks/useReduxToken"
import { useKeep } from "../web3/hooks/useKeep"

export const ScratchPad = ({}) => {
  const { keep } = useReduxToken()
  const { fetchBalance } = useKeep()

  if (keep.loading) {
    return <div>LOADING</div>
  }
  return (
    <div>
      {keep.balance} <button onClick={fetchBalance}>Fetch again</button>{" "}
    </div>
  )
}
