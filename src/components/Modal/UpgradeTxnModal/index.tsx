import { Button, ModalCloseButton, ModalHeader, Text } from "@chakra-ui/react"
import { FC } from "react"
import withBaseModal from "../withBaseModal"
import { H5 } from "../../Typography"

const UpgradeTxnModal: FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const approveErc20 = () => {}

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
