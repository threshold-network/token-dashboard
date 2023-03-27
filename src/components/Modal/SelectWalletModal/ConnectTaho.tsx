import { FC } from "react"
import {
  Alert,
  AlertIcon,
  AlertDescription,
} from "@threshold-network/components"
import { Taho } from "../../../static/icons/Taho"
import { useWeb3React } from "@web3-react/core"
import {
  taho,
  TahoIsNotDefaultWalletError,
  TahoNotInstalledError,
  UserRejectedRequestError,
} from "../../../web3/connectors"
import {
  AccountSuccessAlert,
  WalletConnectionModalBase,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "./components"
import { ExternalHref } from "../../../enums"
import Link from "../../Link"

const ConnectTaho: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error, active, deactivate } = useWeb3React()

  const isTahoNotInstalled = error instanceof TahoNotInstalledError
  const isTahoNotDefaultWallet = error instanceof TahoIsNotDefaultWalletError

  const hasUserRejectedConnectionRequest =
    error instanceof UserRejectedRequestError

  const hasAnyError =
    isTahoNotInstalled ||
    isTahoNotDefaultWallet ||
    hasUserRejectedConnectionRequest ||
    error

  return (
    <WalletConnectionModalBase
      connector={taho}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={Taho}
      title="Taho"
      subTitle={
        isTahoNotInstalled || isTahoNotDefaultWallet
          ? ""
          : "The Taho extension will open in an external window."
      }
      tryAgain={
        hasUserRejectedConnectionRequest
          ? () => {
              deactivate()
              activate(taho)
            }
          : undefined
      }
    >
      {isTahoNotInstalled && <InstallTaho />}
      {isTahoNotDefaultWallet && <TahoIsNotSetAsDefaultWallet />}
      {hasUserRejectedConnectionRequest && <WalletRejectedAlert />}
      {!isTahoNotInstalled &&
        !isTahoNotDefaultWallet &&
        !hasUserRejectedConnectionRequest &&
        hasAnyError &&
        `Unexpected ${error?.name} error: ${error?.message}`}
      {!active && !hasAnyError && <WalletInitializeAlert />}
      {active && (
        <AccountSuccessAlert message="Your Taho wallet is connected" />
      )}
    </WalletConnectionModalBase>
  )
}

const InstallTaho: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        Taho is not installed. Please install the Taho extension on{" "}
        <Link isExternal href={ExternalHref.installTaho}>
          their website
        </Link>
        .
      </AlertDescription>
    </Alert>
  )
}

const TahoIsNotSetAsDefaultWallet: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        Taho is not set as default wallet. Please make sure Taho is your defaul
        wallet and try again.
      </AlertDescription>
    </Alert>
  )
}

export default ConnectTaho
