import { FC, useState } from "react"
import { useParams } from "react-router-dom"
import { IoCheckmarkSharp } from "react-icons/all"
import {
  BodyLg,
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  Divider,
  H5,
  Icon,
  LabelSm,
  List,
  ListItem,
} from "@threshold-network/components"
import {
  Timeline,
  TimelineBreakpoint,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
} from "../../../components/Timeline"
import {
  TransactionDetailsAmountItem,
  TransactionDetailsItem,
} from "../../../components/TransacionDetails"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import ViewInBlockExplorer, {
  Chain as ViewInBlockExplorerChain,
} from "../../../components/ViewInBlockExplorer"
import ButtonLink from "../../../components/ButtonLink"
import { BridgeProcessStep } from "./components/BridgeProcessStep"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import { BridgeProcessCardSubTitle } from "./components/BridgeProcessCardSubTitle"
import { BridgeProcessResource } from "./components/BridgeProcessResource"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import shortenAddress from "../../../utils/shortenAddress"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { PageComponent } from "../../../types"
import mainCardBackground from "../../../static/images/minting-completed-card-bg.png"

export const UnmintDetails: PageComponent = () => {
  // TODO: Fetch redemption details by redemption key.
  const { redemptionKey } = useParams()
  const [shouldDisplaySuccessStep, setShouldDisplaySuccessStep] =
    useState(false)

  // TODO: check if the process is completed based on the redemptions details
  // data.
  const isProcessCompleted = true
  const unmintedAmount = "1200000000000000000"
  const btcAddress = "bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h"
  const fee = "20000000000000000"

  // TODO: Probably create a shared component because we do the same on the
  // deposit details page
  const mainCardProps = shouldDisplaySuccessStep
    ? {
        backgroundImage: mainCardBackground,
        backgroundPosition: "bottom -10px right",
        backgroundRepeat: "no-repeat",
      }
    : {}

  const transactions: {
    label: string
    txHash?: string
    chain: ViewInBlockExplorerChain
  }[] = [
    { label: "Unwrap", txHash: "0x0", chain: "ethereum" },
    { label: "BTC sent", txHash: "0x1", chain: "bitcoin" },
  ]

  return (
    <BridgeLayout {...mainCardProps} spacing="4">
      <BridgeLayoutMainSection>
        <BridgeProcessCardTitle bridgeProcess="unmint" />
        <BridgeProcessCardSubTitle
          display="flex"
          stepText={shouldDisplaySuccessStep ? "Unminted" : "Unminting"}
        >
          {!shouldDisplaySuccessStep && (
            <Box as="span" ml="2">
              {" "}
              - In progress...
            </Box>
          )}
          <InlineTokenBalance
            tokenAmount={unmintedAmount}
            withSymbol
            tokenSymbol="tBTC"
            ml="auto"
            withHigherPrecision
          />
        </BridgeProcessCardSubTitle>
        <Timeline>
          <TimelineItem status="active">
            <TimelineBreakpoint>
              <TimelineDot position="relative">
                <Icon
                  as={IoCheckmarkSharp}
                  position="absolute"
                  color="white"
                  w="22px"
                  h="22px"
                  m="auto"
                  left="0"
                  right="0"
                  textAlign="center"
                />
              </TimelineDot>
              <TimelineConnector />
            </TimelineBreakpoint>
            <TimelineContent>
              <BodyXs whiteSpace="pre-line">tBTC unwrapped</BodyXs>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem status={isProcessCompleted ? "active" : "semi-active"}>
            <TimelineBreakpoint>
              <TimelineDot position="relative">
                {isProcessCompleted && (
                  <Icon
                    as={IoCheckmarkSharp}
                    position="absolute"
                    color="white"
                    w="22px"
                    h="22px"
                    m="auto"
                    left="0"
                    right="0"
                    textAlign="center"
                  />
                )}
              </TimelineDot>
              <TimelineConnector />
            </TimelineBreakpoint>
            <TimelineContent>
              <BodyXs whiteSpace="pre-line">BTC sent</BodyXs>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
        {shouldDisplaySuccessStep ? (
          <SuccessStep
            unmintedAmount={unmintedAmount}
            thresholdNetworkFee={fee}
            btcAddress={btcAddress}
          />
        ) : (
          <BridgeProcessStep
            title="Unminting in progress"
            chain="ethereum"
            txHash={"0x0"}
            progressBarColor="brand.500"
            isCompleted={isProcessCompleted}
            // TODO: set correct icon here
            icon={<IoCheckmarkSharp />}
            onComplete={() => setShouldDisplaySuccessStep(true)}
            isIndeterminate
          >
            <BodyMd mt="6" px="3.5" mb="10" alignSelf="flex-start">
              Your redemption request is being processed. This will take around
              5 hours.
            </BodyMd>
          </BridgeProcessStep>
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection
        display="flex"
        flex="1"
        flexDirection="column"
        h="100%"
      >
        <LabelSm>elapsed time</LabelSm>
        <BodyLg mt="2.5" color="gray.500">
          15 minutes
        </BodyLg>

        <LabelSm mt="5">Transacion History</LabelSm>
        <List mt="6" color="gray.500" spacing="2" mb="20">
          {transactions
            .filter((item) => !!item.txHash)
            .map((item) => (
              <ListItem key={item.txHash}>
                <BodySm>
                  {item.label}{" "}
                  <ViewInBlockExplorer
                    id={item.txHash!}
                    type={ExplorerDataType.TRANSACTION}
                    chain={item.chain}
                    text="transaction"
                  />
                  .
                </BodySm>
              </ListItem>
            ))}
        </List>
        {!shouldDisplaySuccessStep && (
          <BridgeProcessResource
            // TODO: set correct props here
            title="Commodo ullamcorper a lacus vestibulum sed"
            subtitle="Diam sit amet nisl suscipit adipiscing bibendum est ultricies integer."
            link="TODO"
          />
        )}
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

const SuccessStep: FC<{
  unmintedAmount: string
  thresholdNetworkFee: string
  btcAddress: string
}> = ({ unmintedAmount, thresholdNetworkFee, btcAddress }) => {
  return (
    <>
      <H5 mt="4">Success!</H5>
      <Divider mt="9" mb="4" />
      <List spacing="4">
        <TransactionDetailsAmountItem
          label="Unminted Amount"
          tokenAmount={unmintedAmount}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsAmountItem
          label="Threshold Network Fee"
          tokenAmount={thresholdNetworkFee}
          tokenSymbol="tBTC"
          precision={6}
          higherPrecision={8}
        />
        <TransactionDetailsItem
          label="BTC address"
          value={shortenAddress(btcAddress)}
        />
      </List>
      <ButtonLink mt="8" size="lg" to="tBTC/mint" width="100%">
        New Mint
      </ButtonLink>
    </>
  )
}

UnmintDetails.route = {
  path: "redemption/:redemptionKey",
  index: false,
  isPageEnabled: true,
}
