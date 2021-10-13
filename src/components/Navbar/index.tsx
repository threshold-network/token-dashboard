import { FC } from "react"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../../hooks/useModal"
import NavbarComponent from "./NavbarComponent"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId, deactivate } = useWeb3React()

  return (
    <NavbarComponent {...{ active, account, chainId, openModal, deactivate }} />
  )
}

export default Navbar
