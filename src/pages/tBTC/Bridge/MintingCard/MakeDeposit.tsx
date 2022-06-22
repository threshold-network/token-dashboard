import { FC } from "react"
import { Box, Button, HStack, Image, Stack, Tag } from "@chakra-ui/react"
import { BodyMd } from "@threshold-network/components"
import btcQrTmp from "./BTC_QA_TMP.png"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "./TbtcMintingCardSubtitle"
import InfoBox from "../../../../components/InfoBox"
import TooltipIcon from "../../../../components/TooltipIcon"
import CopyToClipboard from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { MintingStep } from "../../../../types/tbtc"

const AddressRow: FC<{ address: string; text: string }> = ({
  address,
  text,
}) => {
  return (
    <HStack justify="space-between">
      <Tag size="md" variant="subtle" colorScheme="brand">
        {text}
      </Tag>
      <HStack>
        <BodyMd color="brand.500">{shortenAddress(address)}</BodyMd>
        <CopyToClipboard textToCopy={address} />
      </HStack>
    </HStack>
  )
}

export const MakeDeposit: FC = () => {
  const handleSubmit = () => {
    console.log("yo")
  }

  const { btcDepositAddress, ethAddress, btcRecoveryAddress } = useTbtcState()

  return (
    <Box>
      <TbtcMintingCardTitle previousStep={MintingStep.ProvideData} />
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
      <InfoBox>
        <HStack>
          <BodyMd color="gray.700">BTC Deposit Address</BodyMd>
          <TooltipIcon label="This is an unique BTC address generated based on the ETH address and Recovery address you provided. Send your BTC funds to this address in order to mint tBTC." />
        </HStack>

        {/* TODO: Generate this QR Code */}
        <Image
          my={6}
          mx="auto"
          bg="white"
          borderRadius="lg"
          maxW="145px"
          maxH="145px"
          src={btcQrTmp}
        />

        <HStack bg="white" borderRadius="lg" justify="space-between" px={4}>
          <BodyMd color="brand.500">{shortenAddress(btcDepositAddress)}</BodyMd>
          <CopyToClipboard textToCopy={btcDepositAddress} />
        </HStack>
      </InfoBox>
      <Stack spacing={4} mb={8}>
        <BodyMd>Provided Addresses Recap</BodyMd>
        <AddressRow text="ETH Address" address={ethAddress} />
        <AddressRow text="BTC Recovery Address" address={btcRecoveryAddress} />
      </Stack>
      <Button onClick={handleSubmit} form="tbtc-minting-data-form" isFullWidth>
        I sent the BTC
      </Button>
    </Box>
  )
}
