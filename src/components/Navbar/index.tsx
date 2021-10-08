import { FC, ReactElement, useMemo } from "react"
import { useWeb3React } from "@web3-react/core"
import { useModal } from "../../hooks/useModal"
import NavbarComponent from "./NavbarComponent"
import { ChainID } from "../../types"
import { Ethereum } from "../../static/icons/Ethereum"
import { Circle, Icon } from "@chakra-ui/react"
import { BsQuestionCircleFill } from "react-icons/all"

const Navbar: FC = () => {
  const { openModal } = useModal()
  const { account, active, chainId, deactivate } = useWeb3React()

  return (
    <NavbarComponent {...{ active, account, chainId, openModal, deactivate }} />
  )
}

export default Navbar
