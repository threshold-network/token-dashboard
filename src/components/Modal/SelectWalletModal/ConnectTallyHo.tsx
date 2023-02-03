import { FC } from "react"
import {
  Alert,
  AlertIcon,
  AlertDescription,
  Link,
} from "@threshold-network/components"
import { TallyHo } from "../../../static/icons/TallyHo"
import { useWeb3React } from "@web3-react/core"
import {
  tallyHo,
  TallyHoIsNotDefaultWalletError,
  TallyHoNotInstalledError,
  UserRejectedRequestError,
} from "../../../web3/connectors"
import {
  AccountSuccessAlert,
  WalletConnectionModalBase,
  WalletInitializeAlert,
  WalletRejectedAlert,
} from "./components"
import { ExternalHref } from "../../../enums"

const ConnectTallyHo: FC<{ goBack: () => void; closeModal: () => void }> = ({
  goBack,
  closeModal,
}) => {
  const { activate, error, active, deactivate } = useWeb3React()

  const isTallyHoNotInstalled = error instanceof TallyHoNotInstalledError
  const isTallyHoNotDefaultWallet =
    error instanceof TallyHoIsNotDefaultWalletError

  const hasUserRejectedConnectionRequest =
    error instanceof UserRejectedRequestError

  const hasAnyError =
    isTallyHoNotInstalled ||
    isTallyHoNotDefaultWallet ||
    hasUserRejectedConnectionRequest ||
    error

  return (
    <WalletConnectionModalBase
      connector={tallyHo}
      goBack={goBack}
      closeModal={closeModal}
      WalletIcon={TallyHo}
      title="Tally Ho!"
      subTitle={
        isTallyHoNotInstalled || isTallyHoNotDefaultWallet
          ? ""
          : "The TallyHo extension will open in an external window."
      }
      tryAgain={
        hasUserRejectedConnectionRequest
          ? () => {
              deactivate()
              activate(tallyHo)
            }
          : undefined
      }
    >
      {isTallyHoNotInstalled && <InstallTallyHo />}
      {isTallyHoNotDefaultWallet && <TallyHoIsNotSetAsDefaultWallet />}
      {hasUserRejectedConnectionRequest && <WalletRejectedAlert />}
      {!isTallyHoNotInstalled &&
        !isTallyHoNotDefaultWallet &&
        !hasUserRejectedConnectionRequest &&
        hasAnyError &&
        `Unexpected ${error?.name} error: ${error?.message}`}
      {!active && !hasAnyError && <WalletInitializeAlert />}
      {active && (
        <AccountSuccessAlert message="Your Tally Ho wallet is connected" />
      )}
    </WalletConnectionModalBase>
  )
}

const InstallTallyHo: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        Tally Ho is not installed. Please install the Tally Ho extension on{" "}
        <Link isExternal href={ExternalHref.installTallyHo}>
          their website.
        </Link>
      </AlertDescription>
    </Alert>
  )
}

const TallyHoIsNotSetAsDefaultWallet: FC = () => {
  return (
    <Alert status="warning">
      <AlertIcon />
      <AlertDescription>
        Tally Ho is not set as default wallet. Please make sure Tally Ho is your
        defaul wallet and try again.
      </AlertDescription>
    </Alert>
  )
}

export default ConnectTallyHo
