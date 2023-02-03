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
import { InlineTokenBalance } from "../../../../components/TokenBalance"

const MintingSuccessComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { tBTCMintAmount } = useTbtcState()

  const tbtcTokenAddress = useTBTCTokenAddress()

  const onDismissButtonClick = () => {
    onPreviousStepClick(MintingStep.ProvideData)
  }

  return (
    <>
      <TbtcMintingCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <TbtcMintingCardSubTitle
        stepText="Success"
        subTitle="Your tBTC is on its way!"
      />
      <InfoBox>
        <Image src={tbtcSuccess} />
      </InfoBox>
      <Stack spacing={4} mb={8}>
        <BodyLg>
          You should receive{" "}
          <InlineTokenBalance
            tokenAmount={tBTCMintAmount}
            withSymbol
            tokenSymbol="tBTC"
          />{" "}
          in around{" "}
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

      <Button onClick={onDismissButtonClick} isFullWidth mb={6} mt="10">
        New Mint
      </Button>
    </>
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
