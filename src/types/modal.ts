import { ModalType } from "../enums"
import { ElementType } from "react"
import ExampleModal from "../components/Modal/ExampleModal"
import SelectWalletModal from "../components/Modal/SelectWalletModal"

export const MODAL_TYPES: Record<ModalType, ElementType> = {
  [ModalType.Example]: ExampleModal,
  [ModalType.SelectWallet]: SelectWalletModal,
}

export interface BaseModalProps {
  closeModal: () => void
}

export interface OpenModal {
  payload: {
    modalType: ModalType
    props: any
  }
}

export interface CloseModal {}

export type ModalActionTypes = OpenModal | CloseModal

export interface UseModal {
  (): {
    modalType: ModalType | null
    modalProps: any
    openModal: (type: ModalType, props?: any) => ModalActionTypes
    closeModal: () => ModalActionTypes
  }
}
