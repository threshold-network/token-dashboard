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
import StakeSuccessOldModal from "../components/Modal/StakingSuccessModal/StakeSuccessOld"
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
import NewAppsToAuthorizeModal from "../components/Modal/NewAppsToAuthorizeModal"
import TbtcRecoveryFileModalModal from "../components/Modal/TbtcRecoveryFileModal"
import TbtcMintingConfirmationModal from "../components/Modal/TbtcMintingConfirmationModal"
import UseDesktopModal from "../components/Modal/UseDesktopModal"
import DeauthorizeApplicationModal from "../components/Modal/DeauthorizeApplicationModal"
import {
  AuthorizeStakingApps,
  StakingApplicationsAuthorized,
  IncreaseAuthorization,
  IncreaseAuthorizationSuccess,
  ConfirmDeauthorization,
  DeauthorizationCompleted,
  DeauthorizationInitiated,
} from "../components/Modal/StakingApplications"
import SubmitStakeModal from "../components/Modal/SubmitStake"
import NewStakerAuthorizeStakingApplicationModal from "../components/Modal/NewStakerAuthorizeStakingApplicationModal"
import MapOperatorToStakingProviderModal from "../components/Modal/MapOperatorToStakingProviderModal"
import MapOperatorToStakingProviderConfirmationModal from "../components/Modal/MapOperatorToStakingProviderConfirmationModal"
import { MapOperatorToStakingProviderSuccess } from "../components/Modal/MapOperatorToStakingProviderSuccessModal"
import AnalyticsModal from "../components/Modal/AnalyticsModal"
import { GenerateNewDepositAddress, NewTBTCApp } from "../components/Modal/tBTC"
import FeedbackSubmissionModal from "../components/Modal/FeedbackSubmissionModal"

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
  [ModalType.StakeSuccessOLD]: StakeSuccessOldModal,
  [ModalType.UnstakeSuccess]: UnstakingSuccessModal,
  [ModalType.UnstakeT]: UnstakeTModalStep1,
  [ModalType.UnstakeTStep2]: UnstakeTModalStep2,
  [ModalType.StakingChecklist]: StakingChecklistModal,
  [ModalType.TopupT]: TopupTModal,
  [ModalType.TopupLegacyStake]: LegacyTopUpModal,
  [ModalType.TopupTSuccess]: TopupTSuccessModal,
  [ModalType.ClaimingRewards]: ClaimingRewards,
  [ModalType.ClaimingRewardsSuccess]: ClaimRewardsSuccessModal,
  [ModalType.NewAppsToAuthorize]: NewAppsToAuthorizeModal,
  [ModalType.TbtcRecoveryJson]: TbtcRecoveryFileModalModal,
  [ModalType.TbtcMintingConfirmation]: TbtcMintingConfirmationModal,
  [ModalType.UseDesktop]: UseDesktopModal,
  [ModalType.DeauthorizeApplication]: DeauthorizeApplicationModal,
  [ModalType.SubmitStake]: SubmitStakeModal,
  [ModalType.MapOperatorToStakingProvider]: MapOperatorToStakingProviderModal,
  [ModalType.MapOperatorToStakingProviderConfirmation]:
    MapOperatorToStakingProviderConfirmationModal,
  [ModalType.MapOperatorToStakingProviderSuccess]:
    MapOperatorToStakingProviderSuccess,
  [ModalType.AuthorizeStakingApps]: AuthorizeStakingApps,
  [ModalType.StakingApplicationsAuthorized]: StakingApplicationsAuthorized,
  [ModalType.IncreaseAuthorization]: IncreaseAuthorization,
  [ModalType.IncreaseAuthorizationSuccess]: IncreaseAuthorizationSuccess,
  [ModalType.SubmitStake]: SubmitStakeModal,
  [ModalType.NewStakerAuthorizeStakingApplication]:
    NewStakerAuthorizeStakingApplicationModal,
  [ModalType.ConfirmDeauthorization]: ConfirmDeauthorization,
  [ModalType.DeauthorizationCompleted]: DeauthorizationCompleted,
  [ModalType.DeauthorizationInitiated]: DeauthorizationInitiated,
  [ModalType.Analytics]: AnalyticsModal,
  [ModalType.NewTBTCApp]: NewTBTCApp,
  [ModalType.FeedbackSubmission]: FeedbackSubmissionModal,
  [ModalType.GenerateNewDepositAddress]: GenerateNewDepositAddress,
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
    closeModal: () => ModalActionTypes | void
  }
}
