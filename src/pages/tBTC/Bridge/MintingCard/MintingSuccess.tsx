import { FC } from "react"
import {
  BodyLg,
  BodySm,
  Box,
  Button,
  Image,
  Stack,
} from "@threshold-network/components"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { TbtcMintingCardSubTitle } from "../components/TbtcMintingCardSubtitle"
import InfoBox from "../../../../components/InfoBox"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import tbtcSuccess from "../../../../static/images/tbtc-success.png"
import TransactionDetailsTable from "../components/TransactionDetailsTable"
import { useTBTCTokenAddress } from "../../../../hooks/useTBTCTokenAddress"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"

const MintingSuccessComponent: FC = () => {
  const { updateState } = useTbtcState()

  const { btcDepositAddress, ethAddress, btcRecoveryAddress } = useTbtcState()
  const tbtcTokenAddress = useTBTCTokenAddress()

  return (
    <>
      <TbtcMintingCardTitle previousStep={MintingStep.InitiateMinting} />
      <TbtcMintingCardSubTitle
        stepText="Success"
        subTitle="Your tBTC is on its way!"
      />
      <InfoBox>
        <Image src={tbtcSuccess} />
      </InfoBox>
      <Stack spacing={4} mb={8}>
        <BodyLg>
          You should receive 1.2 tBTC in around{" "}
          <Box as="span" color="brand.500">
            1-3 hours
          </Box>
          .
        </BodyLg>
        <BodySm>
          Add the tBTC{" "}
          <ViewInBlockExplorer
            id={tbtcTokenAddress}
            type={ExplorerDataType.ADDRESS}
            text="token address"
          />{" "}
          to your Ethererum wallet.
        </BodySm>
      </Stack>
      <TransactionDetailsTable />

      <Button onClick={() => {}} isFullWidth mb={6} mt="10">
        Dismiss
      </Button>
    </>
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
