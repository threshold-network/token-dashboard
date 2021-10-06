import { FC, useState } from "react"
import { useModal } from "../../hooks/useModal"
import { useWeb3React } from "@web3-react/core"
import NavbarComponent from "./Component"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId } = useWeb3React()
  const [hideAlert, setHideAlert] = useState(false)

  return (
    <NavbarComponent
      {...{ active, account, chainId, openModal, hideAlert, setHideAlert }}
    />
  )
}

export default Navbar
