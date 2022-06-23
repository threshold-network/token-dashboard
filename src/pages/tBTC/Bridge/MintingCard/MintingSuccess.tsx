import { FC, useEffect } from "react"
import {
  BodyLg,
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
import { ModalType } from "../../../../enums"
import { useModal } from "../../../../hooks/useModal"
import { Divider, Table, Td, Tr, useColorModeValue } from "@chakra-ui/react"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import tbtcSuccess from "../../../../static/images/tbtc-success.png"
import TransactionDetailsTable from "./TransactionDetailsTable"

export const MintingSuccess: FC = () => {
  const { updateState } = useTbtcState()

  const {
    btcDepositAddress,
    ethAddress,
    btcRecoveryAddress,
    hasDeclinedJSONFile,
  } = useTbtcState()

  return (
    <Box>
      <TbtcMintingCardTitle previousStep={MintingStep.InitiateMinting} />
      <TbtcMintingCardSubTitle
        stepText="Success"
        subTitle="Your tBTC is on its way!"
      />
      <InfoBox>
        <Image src={tbtcSuccess} />
      </InfoBox>
      <Stack spacing={4} mb={8}>
        <BodyLg>You should receive 1.2 tBTC in about 2h 42m</BodyLg>
        <BodySm>Add the tBTC token address to your Ethererum wallet</BodySm>
      </Stack>
      <TransactionDetailsTable />

      <Button onClick={() => {}} isFullWidth mb={6}>
        Dismiss
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
