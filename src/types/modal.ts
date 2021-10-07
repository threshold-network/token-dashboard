import { ModalType } from "../enums"
import { ElementType } from "react"
import ExampleModal from "../components/Modal/ExampleModal"

export const MODAL_TYPES: Record<ModalType, ElementType> = {
  [ModalType.Example]: ExampleModal,
}

export interface BaseModalProps {
  closeModal: () => void
}
