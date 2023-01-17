import { FC } from "react"
import { LabelSm, Box, Divider } from "@threshold-network/components"
import TimelineItem from "../components/TimelineItem"
import tbtcMintingStep1 from "../../../../static/images/tbtcMintingStep1.svg"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { SweepTimer } from "../components/SweepTimer"

export const UnmintingTimeline: FC = () => {
  const { mintingStep } = useTbtcState()
  return (
    <Box>
      <LabelSm mb={8}>Minting Timeline</LabelSm>
      <TimelineItem
        isActive={mintingStep === MintingStep.ProvideData}
        isComplete={
          mintingStep === MintingStep.Deposit ||
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        stepText="Step 1"
        helperLabelText="OFF-CHAIN"
        title="Provide Data"
        description="Provide an ETH address and a BTC Recovery address to generate an unique BTC deposit address. Read more"
        imageSrc={tbtcMintingStep1}
      />
      <TimelineItem
        isActive={mintingStep === MintingStep.Deposit}
        isComplete={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        stepText="Step 2"
        helperLabelText="ACTION ON BITCOIN NETWORK"
        title="Make a BTC deposit"
        description="Send any amount of BTC to this unique BTC Deposit Address. The amount you send is the amount will be minted as tBTC."
        imageSrc={tbtcMintingStep1}
      />
      <TimelineItem
        isActive={
          mintingStep === MintingStep.InitiateMinting ||
          mintingStep === MintingStep.MintingSuccess
        }
        // we never render the complete state for this step
        isComplete={false}
        stepText="Step 3"
        helperLabelText="ACTION ON ETHEREUM NETWORK"
        title="Initiate minting"
        description="Minting tBTC does not require you to wait for the Bitcoin confirmation. Sign an Ethereum transaction in your wallet and your tBTC will arrive within the next bridge crossing."
        imageSrc={tbtcMintingStep1}
      />
      <Divider />
      <SweepTimer />
    </Box>
  )
}
