import { useDispatch, useSelector } from "react-redux"
import { UseModal } from "../types"
import {
  closeModal as closeModalAction,
  openModal as openModalAction,
} from "../store/modal"
import { RootState } from "../store"
import { ModalType } from "../enums"
import { useMemo } from "react"

export const useModal: UseModal = () => {
  const modalType = useSelector((state: RootState) => state.modal.modalType)
  const isOpen = useMemo(() => !!modalType, [modalType])
  const modalProps = useSelector((state: RootState) => state.modal.props)
  const dispatch = useDispatch()

  const openModal = (modalType: ModalType, props: any) =>
    dispatch(openModalAction({ modalType, props }))

  const closeModal = () => dispatch(closeModalAction())

  return {
    isOpen,
    modalType,
    modalProps,
    openModal,
    closeModal,
  }
}
