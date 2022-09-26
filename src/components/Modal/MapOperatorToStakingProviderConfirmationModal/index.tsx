import { CheckCircleIcon } from "@chakra-ui/icons"
import {
  Box,
  BoxProps,
  Button,
  HStack,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@chakra-ui/react"
import { AddressZero } from "@ethersproject/constants"
import {
  BodyLg,
  BodyMd,
  BodySm,
  H5,
  LabelSm,
} from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { FC } from "react"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import withBaseModal from "../withBaseModal"

const OperatorMappingConfirmation: FC<
  BoxProps & { appName: string; operator: string; stakingProvider: string }
> = ({ appName, operator, stakingProvider, ...restProps }) => {
  return (
    <Box
      p={"24px"}
      border={"1px solid"}
      borderColor={"gray.100"}
      borderRadius={"12px"}
      mt={"5"}
      mb={"5"}
      {...restProps}
    >
      <HStack>
        <CheckCircleIcon w={4} h={4} color="green.500" />
        <LabelSm>{appName} app</LabelSm>
      </HStack>
      <Box mt={5}>
        <BodyMd color={"gray.500"}>Operator address: </BodyMd>
        <BodyMd mt={2}>{operator}</BodyMd>
      </Box>
      <StakeAddressInfo mt={2} mb={0} stakingProvider={stakingProvider} />
    </Box>
  )
}

const MapOperatorToStakingProviderConfirmationModal: FC<
  BaseModalProps & {
    operator: string
  }
> = ({ operator, closeModal }) => {
  const { account } = useWeb3React()

  const submitMappingOperator = () => {
    console.log("submit operator mapping")
  }

  return (
    <>
      <ModalHeader>Operator Address Mapping</ModalHeader>
      <ModalBody>
        <InfoBox variant="modal">
          <H5>
            You are about to map Operator Addresses to your Provider Address
          </H5>
          <BodyLg mt="4">
            This will require 2 transactions. Each mapping is one transaction
          </BodyLg>
        </InfoBox>
        <OperatorMappingConfirmation
          appName="tbtc"
          operator={operator}
          stakingProvider={account ? account : AddressZero}
        />
        <OperatorMappingConfirmation
          appName="random beacon"
          operator={operator}
          stakingProvider={account ? account : AddressZero}
        />
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button onClick={submitMappingOperator}>Map Address</Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(MapOperatorToStakingProviderConfirmationModal)
