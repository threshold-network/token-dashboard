import { FC, useEffect } from "react"
import {
  BodyMd,
  BodySm,
  Box,
  BoxLabel,
  Button,
  ChecklistGroup,
  Flex,
  HStack,
  Image,
  Stack,
  Tag,
  useMediaQuery,
} from "@threshold-network/components"
import btcQrTmp from "./BTC_QA_TMP.png"
import { TbtcMintingCardTitle } from "./TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "./TbtcMintingCardSubtitle"
import InfoBox from "../../../../components/InfoBox"
import TooltipIcon from "../../../../components/TooltipIcon"
import CopyToClipboard from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import shortenAddress from "../../../../utils/shortenAddress"
import { MintingStep } from "../../../../types/tbtc"

import { Divider, useColorModeValue } from "@chakra-ui/react"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

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
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)")
  const { updateState } = useTbtcState()

  const handleSubmit = () => {
    updateState("mintingStep", MintingStep.InitiateMinting)
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
          <BodySm color="brand.500">
            {isLargerThan1280
              ? btcDepositAddress
              : shortenAddress(btcDepositAddress)}
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
