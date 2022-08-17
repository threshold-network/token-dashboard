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
import UnstakingSuccessModal from "../components/Modal/UnstakeSuccessModal"
import {
  UnstakeTStep1 as UnstakeTModalStep1,
  UnstakeTStep2 as UnstakeTModalStep2,
} from "../components/Modal/UnstakeTModal"
import { LegacyTopUpModal, TopupTModal } from "../components/Modal/TopupTModal"
import TopupTSuccessModal from "../components/Modal/TopupTSuccessModal"
import {
  ClaimingRewards,
  ClaimRewardsSuccessModal,
} from "../components/Modal/ClaimingRewards"

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
  [ModalType.UnstakeSuccess]: UnstakingSuccessModal,
  [ModalType.UnstakeT]: UnstakeTModalStep1,
  [ModalType.UnstakeTStep2]: UnstakeTModalStep2,
  [ModalType.StakingChecklist]: StakingChecklistModal,
  [ModalType.TopupT]: TopupTModal,
  [ModalType.TopupLegacyStake]: LegacyTopUpModal,
  [ModalType.TopupTSuccess]: TopupTSuccessModal,
  [ModalType.ClaimingRewards]: ClaimingRewards,
  [ModalType.ClaimingRewardsSuccess]: ClaimRewardsSuccessModal,
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
