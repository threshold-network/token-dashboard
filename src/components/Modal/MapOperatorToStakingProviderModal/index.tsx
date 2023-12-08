import { FC, useRef, RefObject, useState } from "react"
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
  const formRefRandomBeacon =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)
  const formRefTaco =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)

  type AppName = "tbtc" | "randomBeacon" | "taco"
  const appNameToFormRef: Record<
    AppName,
    RefObject<FormikProps<MapOperatorToStakingProviderFormValues>>
  > = {
    tbtc: formRefTbtc,
    randomBeacon: formRefRandomBeacon,
    taco: formRefTaco,
  }
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

  const checkIfOperatorIsMappedToAnotherStakingProvider: (
    operator: string,
    appName: string
  ) => Promise<boolean> = async (operator: string, appName: string) => {
    let stakingProviderMapped
    switch (appName) {
      case "tbtc":
        stakingProviderMapped =
          await threshold.multiAppStaking.ecdsa.operatorToStakingProvider(
            operator
          )
        break
      case "randomBeacon":
        stakingProviderMapped =
          await threshold.multiAppStaking.randomBeacon.operatorToStakingProvider(
            operator
          )
        break
      case "taco":
        stakingProviderMapped =
          await threshold.multiAppStaking.taco.operatorToStakingProvider(
            operator
          )
        break
      default:
        throw new Error(`Unsupported app name: ${appName}`)
    }

    return (
      !isAddressZero(stakingProviderMapped) &&
      !isSameETHAddress(stakingProviderMapped, account!)
    )
  }
  type SelectedApp = {
    appName: string
    operator: string
  }
  const [selectedApps, setSelectedApps] = useState<SelectedApp[]>([])

  const submitMapping = async () => {
    await formRefTbtc?.current?.validateForm()
    await formRefRandomBeacon?.current?.validateForm()
    await formRefTaco?.current?.validateForm()
    const operatorTbtc = formRefTbtc.current?.values?.operator
    const operatorRandomBeacon = formRefRandomBeacon.current?.values?.operator
    const operatorTaco = formRefTaco.current?.values?.operator
    if (operatorTbtc) {
      setSelectedApps((apps) => [
        ...apps,
        {
          appName: "tbtc",
          operator: operatorTbtc,
        },
      ])
    }
    if (operatorRandomBeacon) {
      setSelectedApps((apps) => [
        ...apps,
        {
          appName: "randomBeacon",
          operator: operatorRandomBeacon,
        },
      ])
    }
    if (operatorTaco) {
      setSelectedApps((apps) => [
        ...apps,
        {
          appName: "taco",
          operator: operatorTaco,
        },
      ])
    }
    openModal(ModalType.MapOperatorToStakingProviderConfirmation, {
      applications: selectedApps.map((_) => ({
        appName: _.appName,
        operator: _.operator,
      })),
    })
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
          <LabelSm>tBTC</LabelSm>
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRefTbtc}
            formId="map-operator-to-staking-provider-form-tbtc"
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            appName={"tbtc"}
            mappedOperatorTbtc={mappedOperatorTbtc}
          />
        </Box>
        <Box
          p={"24px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          borderRadius={"12px"}
          mt={"5"}
          mb={"5"}
        >
          <LabelSm>Random Beacon</LabelSm>
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRefRandomBeacon}
            formId="map-operator-to-staking-provider-form-random-beacon"
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            appName={"randomBeacon"}
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
            checkIfOperatorIsMappedToAnotherStakingProvider={
              checkIfOperatorIsMappedToAnotherStakingProvider
            }
            appName={"taco"}
            mappedOperatorTaco={mappedOperatorTaco}
          />
        </Box>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button type="submit" onClick={submitMapping}>
          Map Address
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(MapOperatorToStakingProviderModal)
