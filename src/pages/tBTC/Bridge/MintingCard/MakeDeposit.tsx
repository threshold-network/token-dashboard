import { FC, useEffect, useState } from "react"
import {
  BodyMd,
  Box,
  BoxLabel,
  Button,
  ChecklistGroup,
  HStack,
  Stack,
  Divider,
  useColorModeValue,
} from "@threshold-network/components"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import InfoBox from "../../../../components/InfoBox"
import TooltipIcon from "../../../../components/TooltipIcon"
import CopyToClipboard from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { MintingStep } from "../../../../types/tbtc"
import { QRCode } from "../../../../components/QRCode"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { UnspentTransactionOutput } from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"

const AddressRow: FC<{ address: string; text: string }> = ({
  address,
  text,
}) => {
  return (
    <HStack justify="space-between">
      <BoxLabel>{text}</BoxLabel>
      <HStack>
        <BodyMd color="brand.500">{shortenAddress(address)}</BodyMd>
        <CopyToClipboard textToCopy={address} />
      </HStack>
    </HStack>
  )
}

const MakeDepositComponent: FC = () => {
  const { openModal } = useModal()
  const { btcDepositAddress, ethAddress, btcRecoveryAddress, updateState } =
    useTbtcState()
  const threshold = useThreshold()
  const [utxos, setUtxos] = useState<UnspentTransactionOutput[] | undefined>(
    undefined
  )

  useEffect(() => {
    const findUtxos = async () => {
      const utxos = await threshold.tbtc.findAllUnspentTransactionOutputs(
        btcDepositAddress
      )
      if (utxos && utxos.length > 0) setUtxos(utxos)
    }

    findUtxos()
    const interval = setInterval(async () => {
      await findUtxos()
    }, 10000)

    return () => clearInterval(interval)
  }, [btcDepositAddress])

  useEffect(() => {})

  const handleSubmit = async () => {
    // TODO: Check if any of the utxo's is not revealed
    if (utxos && utxos.length > 0) {
      updateState("mintingStep", MintingStep.InitiateMinting)
    }
  }

  const onPreviousStepClick = () => {
    openModal(ModalType.GenerateNewDepositAddress)
  }

  return (
    <>
      <TbtcMintingCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <TbtcMintingCardSubTitle
        stepText="Step 2"
        subTitle="Make your BTC deposit"
      />
      <BodyMd color="gray.500" mb={6}>
        Use this generated address to send any amount of BTC you want to mint as
        tBTC.
      </BodyMd>
      <BodyMd color="gray.500" mb={6}>
        This address is an unique generated address based on the data you
        provided.
      </BodyMd>
      <InfoBox p="4">
        <HStack
          alignItems="center"
          // To center the tooltip icon. The tooltip icon is wrapped by `span`
          // because of: If you're wrapping an icon from `react-icons`, you need
          // to also wrap the icon in a `span` element as `react-icons` icons do
          // not use forwardRef. See
          // https://chakra-ui.com/docs/components/tooltip#with-an-icon.
          sx={{ ">span": { display: "flex" } }}
        >
          <BodyMd color="gray.700">BTC Deposit Address</BodyMd>
          <TooltipIcon label="This is an unique BTC address generated based on the ETH address and Recovery address you provided. Send your BTC funds to this address in order to mint tBTC." />
        </HStack>

        <Box
          my={5}
          p={3}
          backgroundColor={"white"}
          width={"100%"}
          maxW={"145px"}
          marginY="4"
          borderRadius="4"
          border={"1px solid"}
          borderColor={"brand.500"}
          alignSelf="center"
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={btcDepositAddress}
            viewBox={`0 0 256 256`}
          />
        </Box>

        <HStack
          bg="white"
          borderRadius="lg"
          justify="center"
          mb="2"
          p="1"
          pl="2"
          sx={{ ">div": { marginInlineStart: "0 !important" } }}
        >
          <BodyMd color="brand.500" isTruncated>
            {btcDepositAddress}
          </BodyMd>
          <CopyToClipboard textToCopy={btcDepositAddress} />
        </HStack>
      </InfoBox>
      <Stack spacing={4} mt="5" mb={8}>
        <BodyMd>Provided Addresses Recap</BodyMd>
        <AddressRow text="ETH Address" address={ethAddress} />
        <AddressRow text="BTC Recovery Address" address={btcRecoveryAddress} />
      </Stack>
      <Divider mt={4} mb={6} />
      <ChecklistGroup
        mb={6}
        checklistItems={[
          {
            itemId: "staking_deposit__0",
            itemTitle: "",
            itemSubTitle: (
              <BodyMd color={useColorModeValue("gray.500", "gray.300")}>
                Send the funds and come back to this dApp. You do not need to
                wait for the BTC transaction to be mined
              </BodyMd>
            ),
          },
        ]}
      />
      <Button
        onClick={handleSubmit}
        form="tbtc-minting-data-form"
        isDisabled={!utxos}
        isFullWidth
      >
        I sent the BTC
      </Button>
    </>
  )
}

export const MakeDeposit = withOnlyConnectedWallet(MakeDepositComponent)
