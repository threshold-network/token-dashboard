import { useDispatch, useSelector } from "react-redux"
import { UseModal } from "../types"
import {
  closeModal as closeModalAction,
  mapOperatorToStakingProviderModalClosed,
  openModal as openModalAction,
  successfullLoginModalClosed,
} from "../store/modal"
import { RootState } from "../store"
import { ModalType } from "../enums"

export const useModal: UseModal = () => {
  const modalType = useSelector((state: RootState) => state.modal.modalType)
  const modalProps = useSelector((state: RootState) => state.modal.props)
  const dispatch = useDispatch()

  const openModal = (modalType: ModalType, props: any) =>
    dispatch(openModalAction({ modalType, props }))

  const closeModal = () => {
    dispatch(closeModalAction())
    if (modalType === ModalType.SelectWallet) {
      dispatch(successfullLoginModalClosed())
    } else if (
      modalType === ModalType.MapOperatorToStakingProvider ||
      modalType === ModalType.MapOperatorToStakingProviderConfirmation ||
      modalType === ModalType.MapOperatorToStakingProviderSuccess
    ) {
      dispatch(mapOperatorToStakingProviderModalClosed())
    }
  }

  return {
    modalType,
    modalProps,
    openModal,
    closeModal,
  }
}
