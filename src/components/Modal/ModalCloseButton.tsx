import { FC } from "react"
import { ModalCloseButton as _ModalCloseButton } from "@threshold-network/components"
import { useStyles } from "@chakra-ui/system"
import { CloseButton } from "@chakra-ui/close-button"

const ModalCloseButton: FC<{ onClick?: VoidFunction }> = ({ onClick }) => {
  const styles = useStyles()

  if (onClick) {
    // avoids the auto-close functionality of the ModalCloseButton if a custom click handler is passed
    return (
      <CloseButton
        __css={styles.closeButton}
        className="chakra-modal__close-btn ph-no-capture"
        onClick={onClick}
      />
    )
  }

  return <_ModalCloseButton className="ph-no-capture" />
}

export default ModalCloseButton
