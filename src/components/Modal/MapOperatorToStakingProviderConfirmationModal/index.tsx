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
import { BodyLg, BodyMd, H5, LabelSm } from "@threshold-network/components"
import { useWeb3React } from "@web3-react/core"
import { ContractTransaction } from "ethers"
import { FC, useCallback } from "react"
import { ModalType } from "../../../enums"
import { useRegisterMultipleOperatorsTransaction } from "../../../hooks/staking-applications/useRegisterMultipleOperatorsTransaction"
import { useRegisterOperatorTransaction } from "../../../hooks/staking-applications/useRegisterOperatorTransaction"
import { useAppDispatch } from "../../../hooks/store"
import { useModal } from "../../../hooks/useModal"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { mapOperatorToStakingProviderModalClosed } from "../../../store/modal"
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
    isOperatorMappedOnlyInTbtc: boolean
    isOperatorMappedOnlyInRandomBeacon: boolean
  }
> = ({
  operator,
  isOperatorMappedOnlyInTbtc,
  isOperatorMappedOnlyInRandomBeacon,
  closeModal,
}) => {
  const { account } = useWeb3React()
  const { registerMultipleOperators } =
    useRegisterMultipleOperatorsTransaction()
  const dispatch = useAppDispatch()

  const { openModal } = useModal()
  const onSuccess = useCallback(
    (tx: ContractTransaction) => {
      openModal(ModalType.MapOperatorToStakingProviderSuccess, {
        transactions: [
          {
            txHash: tx,
            application: {
              appName: isOperatorMappedOnlyInRandomBeacon
                ? "tbtc"
                : "randomBeacon",
              operator,
              stakingProvider: account,
            },
          },
        ],
      })
    },
    [openModal, operator, account]
  )

  const { sendTransaction: registerOperatorTbtc } =
    useRegisterOperatorTransaction("tbtc", onSuccess)
  const { sendTransaction: registerOperatorRandomBeacon } =
    useRegisterOperatorTransaction("randomBeacon", onSuccess)

  const submitMappingOperator = async () => {
    if (isOperatorMappedOnlyInRandomBeacon) {
      const tx = await registerOperatorTbtc(operator)
      if (!tx) {
        openModal(ModalType.TransactionFailed, {
          error: new Error(
            "Transaction rejected. You are required to map the Operator Address for both apps."
          ),
          closeModal: () => {
            closeModal()
            dispatch(mapOperatorToStakingProviderModalClosed())
          },
        })
      }
    } else if (isOperatorMappedOnlyInTbtc) {
      const tx = await registerOperatorRandomBeacon(operator)
      if (!tx) {
        openModal(ModalType.TransactionFailed, {
          error: new Error(
            "Transaction rejected. You are required to map the Operator Address for both apps."
          ),
          closeModal: () => {
            closeModal()
            dispatch(mapOperatorToStakingProviderModalClosed())
          },
        })
      }
    } else {
      await registerMultipleOperators(operator)
    }
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
            This will require{" "}
            {isOperatorMappedOnlyInRandomBeacon || isOperatorMappedOnlyInTbtc
              ? "1 transaction"
              : "2 transactions"}
            . Each mapping is one transaction
          </BodyLg>
        </InfoBox>
        {!isOperatorMappedOnlyInTbtc && (
          <OperatorMappingConfirmation
            appName="tbtc"
            operator={operator}
            stakingProvider={account ? account : AddressZero}
          />
        )}
        {!isOperatorMappedOnlyInRandomBeacon && (
          <OperatorMappingConfirmation
            appName="random beacon"
            operator={operator}
            stakingProvider={account ? account : AddressZero}
          />
        )}
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
