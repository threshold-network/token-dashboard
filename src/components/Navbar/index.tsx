import { FC } from "react"
import { useModal } from "../../hooks/useModal"
import { useWeb3React } from "@web3-react/core"
import NavbarComponent from "./Component"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId } = useWeb3React()

  return <NavbarComponent {...{ active, account, chainId, openModal }} />
}

export default Navbar
