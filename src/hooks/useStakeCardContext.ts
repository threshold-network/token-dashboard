import { useContext } from "react"
import { StakeCardContext } from "../contexts/StakeCardContext"

export const useStakeCardContext = () => {
  const stakeCardContext = useContext(StakeCardContext)

  if (!stakeCardContext) {
    throw new Error("StakeCardContext used outside of the StakeCard component.")
  }

  return stakeCardContext
}
