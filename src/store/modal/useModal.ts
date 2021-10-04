import { useSelector, useDispatch } from "react-redux"
import { ModalType, UseModal } from "./types"
import { openModal as openModalAction, closeModal as closeModalAction } from "."
import { RootState } from "../index"

export const useModal: UseModal = () => {
  const modalType = useSelector((state: RootState) => state.modal.modalType)
  const modalProps = useSelector((state: RootState) => state.modal.props)
  const dispatch = useDispatch()

  const openModal = (modalType: ModalType, props: any) =>
    dispatch(openModalAction({ modalType, props }))

  const closeModal = () => dispatch(closeModalAction())

  return {
    modalType,
    modalProps,
    openModal,
    closeModal,
  }
}
