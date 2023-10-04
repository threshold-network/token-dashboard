import { FC } from "react"
import {
  ModalCloseButton as _ModalCloseButton,
  CloseButtonProps,
} from "@threshold-network/components"

const ModalCloseButton: FC<CloseButtonProps> = (props) => {
  return <_ModalCloseButton className="ph-no-capture" {...props} />
}

export default ModalCloseButton
