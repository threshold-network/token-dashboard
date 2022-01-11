import { useSelector, useDispatch } from "react-redux"
import { UseModal } from "../types"
import {
  openModal as openModalAction,
  closeModal as closeModalAction,
} from "../store/modal"
import { RootState } from "../store"
import { ModalType } from "../enums"

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
