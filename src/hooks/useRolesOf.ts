import { useSelector } from "react-redux"
import { RootState } from "../store"
import { RolesOf } from "../threshold-ts/staking"

export const useRolesOf: () => RolesOf = () => {
  const rolesOf = useSelector(
    (state: RootState) => state.connectedAccount.rolesOf
  )

  return rolesOf
}
