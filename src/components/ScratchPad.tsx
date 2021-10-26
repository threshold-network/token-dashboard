import { useReduxToken } from "../hooks/useReduxToken"
import { useTokenContext } from "../contexts/TokenContext"

export const ScratchPad = ({}) => {
  const { keep } = useReduxToken()
  const { fetchKeepBalance } = useTokenContext()

  if (keep.loading) {
    return <div>LOADING</div>
  }
  return (
    <div>
      {keep.balance} <button onClick={fetchKeepBalance}>Fetch again</button>{" "}
    </div>
  )
}
