import { FC } from "react"
import { ModalCloseButton as _ModalCloseButton } from "@threshold-network/components"
import { CloseButtonProps } from "@chakra-ui/close-button"

const ModalCloseButton: FC<CloseButtonProps> = (props) => {
  return <_ModalCloseButton className="ph-no-capture" {...props} />
}

export default ModalCloseButton
