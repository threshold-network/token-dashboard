import { FC } from "react"
import { Alert, AlertIcon, BodyMd, Button } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import { AlertDescription } from "@chakra-ui/react"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"

const InitiateMintingComponent: FC<{
  utxos: UnspentTransactionOutput[] | undefined
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ utxos, onPreviousStepClick }) => {
  const { updateState } = useTbtcState()
  const { openModal } = useModal()

  const confirmDespotAndMint = async () => {
    openModal(ModalType.TbtcMintingConfirmation, { utxos: utxos })
  }

  return (
    <>
      <TbtcMintingCardTitle
        previousStep={MintingStep.Deposit}
        onPreviousStepClick={onPreviousStepClick}
      />
      <TbtcMintingCardSubTitle stepText="Step 3" subTitle="Initiate minting" />
      <Alert status="warning" my={6}>
        <AlertIcon />
        <AlertDescription>
          You do not need to wait for the BTC transaction to be mined to
          initiate minting.
        </AlertDescription>
      </Alert>
      <BodyMd color="gray.500" mb={6}>
        This step requires you to sign a transaction in your Ethereum wallet.
      </BodyMd>
      <BodyMd color="gray.500" mb={6}>
        Your tBTC will arrive in your wallet in around 1-3 hours.
      </BodyMd>
      <Button onClick={confirmDespotAndMint} isFullWidth>
        Confirm deposit & mint
      </Button>
    </>
  )
}

export const InitiateMinting = withOnlyConnectedWallet(InitiateMintingComponent)
