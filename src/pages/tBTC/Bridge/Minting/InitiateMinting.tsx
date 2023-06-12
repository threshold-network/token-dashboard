import { FC } from "react"
import { Alert, AlertIcon, BodyMd, Button } from "@threshold-network/components"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import { AlertDescription } from "@chakra-ui/react"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"

const InitiateMintingComponent: FC<{
  utxo: UnspentTransactionOutput
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxo, onPreviousStepClick }) => {
  const { openModal } = useModal()

  const confirmDespotAndMint = async () => {
    openModal(ModalType.TbtcMintingConfirmation, { utxo: utxo })
  }

  return (
    <>
      <BridgeProcessCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <BridgeProcessCardSubTitle
        stepText="Step 3"
        subTitle="Initiate minting"
      />
      <BodyMd color="gray.500" mb={6}>
        This step requires you to sign a transaction in your Ethereum wallet.
      </BodyMd>
      <BodyMd color="gray.500" mb={6}>
        Your tBTC will arrive in your wallet in around ~3 hours.
      </BodyMd>
      <Button
        onClick={confirmDespotAndMint}
        isFullWidth
        data-ph-capture-attribute-button-name={
          "Confirm deposit & mint (Step 2)"
        }
      >
        Initiate minting
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
