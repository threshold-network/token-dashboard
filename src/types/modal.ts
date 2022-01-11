import { ModalType } from "../enums"
import { ElementType } from "react"
import SelectWalletModal from "../components/Modal/SelectWalletModal"
import {
  TransactionIdle as UpgradeToT,
  TransactionSuccess as UpgradeToTSuccess,
} from "../components/Modal/UpgradeToTModal"
import {
  TransactionFailed,
  TransactionIsPending,
  TransactionIsWaitingForConfirmation,
} from "../components/Modal/TransactionModal"
import StakingSuccessModal from "../components/Modal/StakingSuccessModal"
import ConfirmStakingParams from "../components/Modal/ConfirmStakingParams"
import StakingChecklistModal from "../components/Modal/StakingChecklistModal"
import StakingPreNeededModal from "../components/Modal/StakingSuccessPreNeededModal"
import SubmitPreAddressModal from "../components/Modal/SubmitPreAddressModal"

export const MODAL_TYPES: Record<ModalType, ElementType> = {
  [ModalType.SelectWallet]: SelectWalletModal,
  [ModalType.TransactionIsPending]: TransactionIsPending,
  [ModalType.TransactionIsWaitingForConfirmation]:
    TransactionIsWaitingForConfirmation,
  [ModalType.TransactionFailed]: TransactionFailed,
  [ModalType.UpgradeToT]: UpgradeToT,
  [ModalType.UpgradedToT]: UpgradeToTSuccess,
  [ModalType.ConfirmStakingParams]: ConfirmStakingParams,
  [ModalType.StakeSuccess]: StakingSuccessModal,
  [ModalType.StakingChecklist]: StakingChecklistModal,
  [ModalType.StakeSuccessPreNeeded]: StakingPreNeededModal,
  [ModalType.SubmitPreAddress]: SubmitPreAddressModal,
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

export interface UpdateProps {
  payload: any
}

export interface CloseModal {}

export type ModalActionTypes = OpenModal | CloseModal | UpdateProps

export interface UseModal {
  (): {
    modalType: ModalType | null
    modalProps: any
    openModal: (type: ModalType, props?: any) => ModalActionTypes
    closeModal: () => ModalActionTypes
  }
}
