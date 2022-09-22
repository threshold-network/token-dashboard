import { FC, useEffect, useRef, useState } from "react"
import {
  AlertBox,
  AlertIcon,
  BodyLg,
  BodyXs,
  Box,
  Button,
  H5,
  HStack,
  LabelSm,
  ModalBody,
  ModalCloseButton,
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
import { featureFlags } from "../../../constants"
import { ModalType } from "../../../enums"
import { openModal } from "../../../store/modal"
import { updateState } from "../../../store/staking"
import { FormValues } from "../../Forms"
import { useModal } from "../../../hooks/useModal"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { useWeb3React } from "@web3-react/core"
import { AddressZero } from "@ethersproject/constants"

const MapOperatorToStakingProviderModal: FC<BaseModalProps> = () => {
  const { account } = useWeb3React()
  const formRef =
    useRef<FormikProps<MapOperatorToStakingProviderFormValues>>(null)
  const { closeModal, openModal } = useModal()
  const [hasBeenValidatedOnMount, setHasBeenValidatedOnMount] = useState(false)

  // useEffect(() => {
  //   const forceFormValidation = async () => {
  //     if (hasBeenValidatedOnMount || !formRef.current) return
  //     setHasBeenValidatedOnMount(true)
  //     const errors = await formRef.current.validateForm()
  //     if (errors) {
  //       formRef.current.setErrors(errors)
  //       formRef.current.setTouched({ operator: true })
  //     }
  //   }
  //   forceFormValidation()
  // })

  const onSubmit = ({ operator }: MapOperatorToStakingProviderFormValues) => {
    console.log("submit", operator)
  }

  return (
    <>
      <ModalHeader>Operator Address Mapping</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>
            We’ve noticed your wallet address is the same with your Provider
            Address
          </H5>
          <BodyLg mt="4">
            Would you like to map your Operator Address? Mapping an Operator
            Address will require one transaction per application.
          </BodyLg>
        </InfoBox>
        <BodyLg mt={"10"}>
          Choose an application to map the Operator Address:
        </BodyLg>
        <Box
          p={"24px"}
          border={"1px solid"}
          borderColor={"gray.100"}
          mt={"5"}
          mb={"5"}
        >
          <LabelSm>TBTC + Random Beacon apps (requires 2txs)</LabelSm>
          <StakeAddressInfo stakingProvider={account ? account : AddressZero} />
          <MapOperatorToStakingProviderForm
            innerRef={formRef}
            formId="map-operator-to-staking-provider-form"
            initialAddress={"0x0"}
            onSubmitForm={onSubmit}
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
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button type="submit" form="map-operator-to-staking-provider-form">
          Map Address
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(MapOperatorToStakingProviderModal)
