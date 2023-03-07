import { FC, useEffect, useState } from "react"
import {
  BodyLg,
  BodySm,
  Box,
  Button,
  HStack,
  Image,
  Progress,
  Skeleton,
  Stack,
  Text,
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
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { CheckCircleIcon } from "@chakra-ui/icons"
import { useThreshold } from "../../../../contexts/ThresholdContext"

const MintingSuccessComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const dispatch = useAppDispatch()
  const threshold = useThreshold()
  const {
    tBTCMintAmount,
    utxo,
    txConfirmations,
    depositRevealedTxHash,
    optimisticMintingRequestedTxHash,
    optimisticMintingFinalizedTxHash,
  } = useTbtcState()

  const btcDepositTxHash = utxo.transactionHash.toString()
  const tbtcTokenAddress = useTBTCTokenAddress()

  const onDismissButtonClick = () => {
    onPreviousStepClick(MintingStep.ProvideData)
  }

  const transactionHash = utxo.transactionHash.toString()
  const value = utxo.value.toString()

  useEffect(() => {
    dispatch(
      tbtcSlice.actions.fetchUtxoConfirmations({
        utxo: { transactionHash, value },
      })
    )
  }, [dispatch, transactionHash, value])

  const minConfirmationsNeeded =
    threshold.tbtc.minimumNumberOfConfirmationsNeeded(utxo.value)

  const areConfirmationsLoaded = txConfirmations !== undefined

  const checkmarkColor =
    txConfirmations &&
    minConfirmationsNeeded &&
    txConfirmations >= minConfirmationsNeeded
      ? "brand.500"
      : "gray.500"

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
      <Stack my={2}>
        <Skeleton isLoaded={areConfirmationsLoaded}>
          <Progress
            h="2"
            borderRadius="md"
            colorScheme="brand"
            value={
              txConfirmations >= minConfirmationsNeeded
                ? 100
                : (txConfirmations / minConfirmationsNeeded) * 100
            }
          />
        </Skeleton>
        <HStack mt={1} alignSelf="flex-end">
          <CheckCircleIcon w={4} h={4} color={checkmarkColor} />{" "}
          <BodySm color={"gray.500"}>
            <Skeleton isLoaded={areConfirmationsLoaded} display="inline-block">
              {txConfirmations > minConfirmationsNeeded
                ? minConfirmationsNeeded
                : txConfirmations}
              {"/"}
              {minConfirmationsNeeded}
            </Skeleton>
            {"  Bitcoin Network Confirmations"}
          </BodySm>
        </HStack>
      </Stack>

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
          <Text>
            The tBTC minting process will start only after{" "}
            {minConfirmationsNeeded} Bitcoin Network confirmations.
          </Text>
        </BodySm>
      </Stack>
      <TransactionDetailsTable />
      <Stack spacing="2" alignItems="center">
        <BodySm>
          View BTC deposit transaction on{" "}
          <ViewInBlockExplorer
            chain="bitcoin"
            id={btcDepositTxHash}
            type={ExplorerDataType.TRANSACTION}
            text="Blockstream"
          />
        </BodySm>
        {depositRevealedTxHash && (
          <BodySm>
            View deposit transaction on{" "}
            <ViewInBlockExplorer
              id={depositRevealedTxHash}
              type={ExplorerDataType.TRANSACTION}
              text="Etherscan"
            />
          </BodySm>
        )}
        {optimisticMintingRequestedTxHash && (
          <BodySm>
            View Optimistic Minting Requested transaction on{" "}
            <ViewInBlockExplorer
              id={optimisticMintingRequestedTxHash}
              type={ExplorerDataType.TRANSACTION}
              text="Etherscan"
            />
          </BodySm>
        )}
        {optimisticMintingFinalizedTxHash && (
          <BodySm>
            View Optimistic Minting Finalized transaction on{" "}
            <ViewInBlockExplorer
              id={optimisticMintingFinalizedTxHash}
              type={ExplorerDataType.TRANSACTION}
              text="Etherscan"
            />
          </BodySm>
        )}
      </Stack>

      <Button onClick={onDismissButtonClick} isFullWidth mb={6} mt="10">
        New Mint
      </Button>
    </>
  )
}

export const MintingSuccess = withOnlyConnectedWallet(MintingSuccessComponent)
