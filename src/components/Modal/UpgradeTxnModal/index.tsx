import { Button, ModalCloseButton, ModalHeader, Text } from "@chakra-ui/react"
import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { H5 } from "../../Typography"
import { useKeep } from "../../../web3/hooks/useKeep"

const UpgradeTxnModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const { approveKeep } = useKeep()

  const approveErc20 = () => {
    approveKeep()
  }

  return (
    <>
      <ModalHeader>
        <H5>Upgrade to T</H5>
      </ModalHeader>
      <ModalCloseButton />
      <Button onClick={approveErc20}>Approve ERC20</Button>
    </>
  )
}
export default withBaseModal(UpgradeTxnModal)
