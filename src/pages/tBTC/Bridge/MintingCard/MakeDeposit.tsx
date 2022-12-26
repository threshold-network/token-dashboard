import { FC } from "react"
import {
  BodyMd,
  BodySm,
  Box,
  BoxLabel,
  Button,
  ChecklistGroup,
  Flex,
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
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { QRCode } from "../../../../components/QRCode"
import { useThreshold } from "../../../../contexts/ThresholdContext"
import { DepositScriptParameters } from "@keep-network/tbtc-v2.ts/dist/deposit"
import { unprefixedAndUncheckedAddress } from "../../../../threshold-ts/utils"
import { computeHash160 } from "@keep-network/tbtc-v2.ts/dist/bitcoin"

const AddressRow: FC<{ address: string; text: string }> = ({
  address,
  text,
}) => {
  return (
    <HStack justify="space-between">
      <BoxLabel
      // colorScheme="brand"
      >
        {text}
      </BoxLabel>
      <HStack>
        <BodyMd color="brand.500">{shortenAddress(address)}</BodyMd>
        <CopyToClipboard textToCopy={address} />
      </HStack>
    </HStack>
  )
}

export const MakeDeposit: FC = () => {
  const {
    btcDepositAddress,
    ethAddress,
    btcRecoveryAddress,
    blindingFactor,
    walletPublicKey,
    refundLocktime,
    updateState,
  } = useTbtcState()
  const threshold = useThreshold()

  const handleSubmit = async () => {
    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex: unprefixedAndUncheckedAddress(ethAddress),
      },
      blindingFactor: blindingFactor,
      // TODO: pass proper values for walletPubKey and refundPubKey
      walletPubKeyHash: walletPublicKey,
      refundPubKeyHash: computeHash160(btcRecoveryAddress),
      refundLocktime: refundLocktime,
    }
    const depositAddress = await threshold.tbtc.calculateDepositAddress(
      depositScriptParameters,
      "testnet"
    )
    const utxos = await threshold.tbtc.findAllUnspentTransactionOutputs(
      depositAddress
    )
    // TODO: remove console log
    console.log("UTXOS: ", utxos)
    // TODO: Check if any of the utxo's is not revealed
    if (utxos && utxos.length > 0) {
      updateState("mintingStep", MintingStep.InitiateMinting)
    }
  }

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

        <Box
          my={5}
          p={3}
          backgroundColor={"white"}
          width={"100%"}
          maxW={"128px"}
          margin={"5 0"}
          borderRadius="sm"
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

        <HStack bg="white" borderRadius="lg" justify="space-between" px={4}>
          <BodySm color="brand.500" maxW={"xs"} isTruncated>
            {btcDepositAddress}
          </BodySm>
          <CopyToClipboard textToCopy={btcDepositAddress} />
        </HStack>
      </InfoBox>
      <Stack spacing={4} mb={8}>
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
              <BodySm color={useColorModeValue("gray.500", "gray.300")}>
                Send the funds and come back to this dApp. You do not need to
                wait for the BTC transaction to be mined
              </BodySm>
            ),
          },
        ]}
      />
      <Button
        onClick={handleSubmit}
        form="tbtc-minting-data-form"
        isFullWidth
        mb={6}
      >
        I sent the BTC
      </Button>
      <Flex justifyContent="center">
        <ViewInBlockExplorer
          id="NEED BRIDGE CONTRACT ADDRESS"
          type={ExplorerDataType.ADDRESS}
          text="Bridge Contract"
        />
      </Flex>
    </Box>
  )
}
