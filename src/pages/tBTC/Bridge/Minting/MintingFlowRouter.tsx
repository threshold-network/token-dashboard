import { FC, useEffect } from "react"
import { Box, Flex, H5, Skeleton, Stack } from "@threshold-network/components"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"
import { useWeb3React } from "@web3-react/core"
import SubmitTxButton from "../../../../components/SubmitTxButton"
import { useModal } from "../../../../hooks/useModal"
import { ModalType } from "../../../../enums"
import {
  BridgeContractLink,
  ProtocolHistoryRecentDeposits,
  ProtocolHistoryTitle,
  ProtocolHistoryViewMoreLink,
  TVL,
} from "../../../../components/tBTC"
import { TbtcMintingCardTitle } from "../components/TbtcMintingCardTitle"
import { useRemoveDepositData } from "../../../../hooks/tbtc/useRemoveDepositData"
import { useAppDispatch } from "../../../../hooks/store"
import { tbtcSlice } from "../../../../store/tbtc"
import { useFetchTvl } from "../../../../hooks/useFetchTvl"
import { useFetchRecentDeposits } from "../../../../hooks/tbtc"

const MintingFlowRouterBase = () => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const { mintingStep, updateState, btcDepositAddress, utxo } = useTbtcState()
  const removeDepositData = useRemoveDepositData()
  const { openModal } = useModal()

  const onPreviousStepClick = (previousStep?: MintingStep) => {
    if (mintingStep === MintingStep.MintingSuccess) {
      updateState("mintingStep", MintingStep.ProvideData)
      removeDepositData()
      return
    }
    if (previousStep === MintingStep.ProvideData) {
      openModal(ModalType.GenerateNewDepositAddress)
      return
    }
    updateState("mintingStep", previousStep)
  }

  useEffect(() => {
    if (!btcDepositAddress || !account) return
    dispatch(
      tbtcSlice.actions.findUtxo({ btcDepositAddress, depositor: account })
    )
  }, [btcDepositAddress, account, dispatch])

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit onPreviousStepClick={onPreviousStepClick} />
    }
    case MintingStep.InitiateMinting: {
      return (
        <InitiateMinting
          utxo={utxo!}
          onPreviousStepClick={onPreviousStepClick}
        />
      )
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return (
        <>
          <TbtcMintingCardTitle
            previousStep={MintingStep.ProvideData}
            onPreviousStepClick={onPreviousStepClick}
          />
          <Stack>
            <Skeleton height="40px" />
            <Skeleton height="40px" />
            <Skeleton height="100px" />
          </Stack>
        </>
      )
  }
}

export const MintingFlowRouter: FC = () => {
  const { active } = useWeb3React()
  const [tvlInUSD, fetchTvl, tvl] = useFetchTvl()
  const [deposits] = useFetchRecentDeposits(3)

  useEffect(() => {
    fetchTvl()
  }, [fetchTvl])

  return (
    <Flex flexDirection="column">
      {active ? (
        <>
          <MintingFlowRouterBase />
          <Box as="p" textAlign="center" mt="6">
            <BridgeContractLink />
          </Box>
        </>
      ) : (
        <>
          <TbtcMintingCardTitle />
          <H5 align={"center"}>Ready to mint tBTC?</H5>
          <SubmitTxButton mb="6" mt="4" />
          <TVL tvl={tvl.tBTC} tvlInUSD={tvlInUSD.tBTC} />
          <ProtocolHistoryTitle mt="8" />
          <ProtocolHistoryRecentDeposits
            deposits={deposits}
            _after={{
              content: `" "`,
              position: "absolute",
              bottom: 0,
              left: 0,
              width: "100%",
              height: "100px",
              opacity: "0.9",
              background:
                "linear-gradient(360deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 117.78%)",
            }}
          />
          <ProtocolHistoryViewMoreLink mt="7" />
        </>
      )}
    </Flex>
  )
}
