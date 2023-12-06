import { FC, useRef } from "react"
import {
  AlertBox,
  AlertIcon,
  BodyLg,
  BodyXs,
  Box,
  Button,
  H5,
  LabelSm,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import InfoBox from "../../InfoBox"
import MapOperatorToStakingProviderForm, {
  MapOperatorToStakingProviderFormValues,
} from "./MapOperatorToStakingProviderForm"
import { FormikProps } from "formik"
import { ModalType } from "../../../enums"
import { useModal } from "../../../hooks/useModal"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { useWeb3React } from "@web3-react/core"
import { useThreshold } from "../../../contexts/ThresholdContext"
import {
  isAddressZero,
  isSameETHAddress,
  AddressZero,
} from "../../../web3/utils"
import { selectMappedOperators } from "../../../store/account/selectors"
import { useAppSelector } from "../../../hooks/store"
import ModalCloseButton from "../ModalCloseButton"

export interface MapOperatorToStakingProviderModalProps {
  mappedOperatorTbtc: string
  mappedOperatorRandomBeacon: string
  mappedOperatorTaco: string
}

const MapOperatorToStakingProviderModal: FC<
  BaseModalProps & MapOperatorToStakingProviderModalProps
> = () => {
  const { account } = useWeb3React()
  const formRefTbtc =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)
  const formRefTaco =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)
  const { closeModal, openModal } = useModal()
  const threshold = useThreshold()

  const {
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    mappedOperatorTaco,
    isOperatorMappedOnlyInRandomBeacon,
    isOperatorMappedOnlyInTbtc,
    isOperatorMappedOnlyInTaco,
  } = useAppSelector(selectMappedOperators)

  const onSubmit = async ({
    operator,
    appName,
    mappedOperatorTbtc,
    mappedOperatorRandomBeacon,
    mappedOperatorTaco,
  }: MapOperatorToStakingProviderFormValues) => {
    if (account) {
      openModal(ModalType.MapOperatorToStakingProviderConfirmation, {
        operator,
        appName,
        mappedOperatorTbtc,
        mappedOperatorRandomBeacon,
        mappedOperatorTaco,
      })
    }
  }

  const checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string
  ) => Promise<boolean> = async (operator: string) => {
    const stakingProviderMappedEcdsa =
      await threshold.multiAppStaking.ecdsa.operatorToStakingProvider(operator)
    const stakingProviderMappedRandomBeacon =
      await threshold.multiAppStaking.randomBeacon.operatorToStakingProvider(
        operator
      )

    return (
      (!isAddressZero(stakingProviderMappedEcdsa) &&
        !isSameETHAddress(stakingProviderMappedEcdsa, account!)) ||
      (!isAddressZero(stakingProviderMappedRandomBeacon) &&
        !isSameETHAddress(stakingProviderMappedRandomBeacon, account!))
    )
  }

  const handleSubmit = async () => {
    console.log(
      mappedOperatorTaco,
      mappedOperatorTbtc,
      mappedOperatorRandomBeacon
    )
    if (formRefTbtc.current?.values?.operator) {
      console.log("submitting tbtc", formRefTbtc.current?.values?.operator)
      await formRefTbtc.current.handleSubmit()
    }

    if (formRefTaco.current?.values?.operator) {
      console.log("submitting taco", formRefTaco.current?.values?.operator)
      await formRefTaco.current.handleSubmit()
    }
  }

  return (
    <>
      <ModalHeader>Operator Address Mapping</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          {isOperatorMappedOnlyInRandomBeacon ||
          isOperatorMappedOnlyInTbtc ||
          isOperatorMappedOnlyInTaco ? (
            <H5>
              We noticed you've only mapped 1 application's Operator Address.
            </H5>
          ) : (
            <H5>
              We’ve noticed your wallet address is the same as your Provider
              Address
            </H5>
          )}
          <BodyLg mt="4">
            Map your Operator Address to your Provider Address to improve the
            support of your hardware wallet. Mapping will require one
            transaction per application.
          </BodyLg>
        </InfoBox>
        <BodyLg mt={"10"}>
          Choose an application to map the Operator Address:
          {/*  JAMES TODO JAMES THEREF do we need another input for tbtc/rb */}
        </BodyLg>
        <Box
          p={"24px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"12px"}
          mt={"5"}
          mb={"5"}
        >
          {isOperatorMappedOnlyInRandomBeacon ? (
            <LabelSm>tBTC app</LabelSm>
          ) : isOperatorMappedOnlyInTbtc ? (
            <LabelSm>random beacon app</LabelSm>
          ) : (
            <LabelSm>tBTC + Random Beacon (requires 2txs)</LabelSm>
          )}
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRefTbtc}
            formId="map-operator-to-staking-provider-form-tbtc"
            initialAddress={
              isOperatorMappedOnlyInRandomBeacon
                ? mappedOperatorRandomBeacon
                : isOperatorMappedOnlyInTbtc
                ? mappedOperatorTbtc
                : ""
            }
            onSubmitForm={(operator) => onSubmit({ operator, appName: "tbtc" })}
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            mappedOperatorTbtc={mappedOperatorTbtc}
            mappedOperatorRandomBeacon={mappedOperatorRandomBeacon}
          />
        </Box>
        <AlertBox
          status="warning"
          withIcon={false}
          alignItems="center"
          p={"8px 10px"}
        >
          <AlertIcon h={"14px"} as={"div"} alignSelf="auto" />
          <BodyXs>
            Take note! tBTC + Random Beacon Apps Rewards Bundle will require two
            transactions, one transaction per application.
          </BodyXs>
        </AlertBox>
        <Box
          p={"24px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"12px"}
          mt={"5"}
          mb={"5"}
        >
          <LabelSm>Taco (requires 1tx)</LabelSm>
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRefTaco}
            formId="map-operator-to-staking-provider-form-taco"
            initialAddress={""}
            onSubmitForm={onSubmit}
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            mappedOperatorTaco={mappedOperatorTaco}
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button type="submit" onClick={handleSubmit}>
          Map Address
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(MapOperatorToStakingProviderModal)
