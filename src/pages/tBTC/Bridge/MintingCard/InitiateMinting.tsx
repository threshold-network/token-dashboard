import { FC } from "react"
import { Alert, AlertIcon, BodyMd, Button } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { MintingStep } from "../../../../types/tbtc"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import { AlertDescription } from "@chakra-ui/react"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"

export const InitiateMinting: FC = () => {
  const { updateState } = useTbtcState()
  const { openModal } = useModal()
  const confirmDespotAndMint = () => {
    // TODO: calculate these values. They are hardcoded for now. Loading states are mocked in the confirmation modal

    updateState("ethGasCost", 50)
    updateState("thresholdNetworkFee", 0.0001)
    updateState("isLoadingTbtcMintAmount", true)
    updateState("isLoadingBitcoinMinerFee", true)
    // updateState("tBTCMintAmount")
    // updateState("bitcoinMinerFee")
    // updateState("mintingStep", MintingStep.MintingSuccess)
    openModal(ModalType.TbtcMintingConfirmation)
  }

  return (
    <>
      <TbtcMintingCardTitle previousStep={MintingStep.Deposit} />
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
