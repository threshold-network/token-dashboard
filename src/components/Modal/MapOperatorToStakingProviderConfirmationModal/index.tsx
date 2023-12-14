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
import { FC, useCallback } from "react"
import { ModalType } from "../../../enums"
import { useRegisterMultipleOperatorsTransaction } from "../../../hooks/staking-applications/useRegisterMultipleOperatorsTransaction"
import { useBondOperatorTransaction } from "../../../hooks/staking-applications/useBondOperatorTransaction"
import { useRegisterOperatorTransaction } from "../../../hooks/staking-applications/useRegisterOperatorTransaction"
import { useAppDispatch } from "../../../hooks/store"
import { useModal } from "../../../hooks/useModal"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { mapOperatorToStakingProviderModalClosed } from "../../../store/modal"
import { BaseModalProps } from "../../../types"
import InfoBox from "../../InfoBox"
import withBaseModal from "../withBaseModal"
import { OnSuccessCallback } from "../../../web3/hooks"

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
    applications: {
      appName: string
      operator: string
      stakingProvider: string
    }[]
  }
> = ({ applications, closeModal }) => {
  const { account } = useWeb3React()
  const { registerMultipleOperators } =
    useRegisterMultipleOperatorsTransaction()
  const dispatch = useAppDispatch()

  const { openModal } = useModal()
  const onSuccess = useCallback<OnSuccessCallback>(
    (receipt) => {
      openModal(ModalType.MapOperatorToStakingProviderSuccess, {
        transactions: applications.map((app) => ({
          txHash: receipt.transactionHash,
          application: {
            appName: app.appName,
            operator: app.operator,
            stakingProvider: app.stakingProvider,
          },
        })),
      })
    },
    [openModal, applications]
  )

  const { sendTransaction: registerOperatorTbtc } =
    useRegisterOperatorTransaction("tbtc", (receipt) => onSuccess(receipt))
  const { sendTransaction: registerOperatorRandomBeacon } =
    useRegisterOperatorTransaction("randomBeacon", (receipt) =>
      onSuccess(receipt)
    )
  const { sendTransaction: registerOperatorTaco } = useBondOperatorTransaction(
    "taco",
    (receipt) => onSuccess(receipt)
  )

  const submitMappingOperator = async () => {
    if (!account) {
      throw new Error(`Wallet not connected`)
    }
    const transactions = []
    for (const app of applications) {
      let transaction
      switch (app.appName) {
        case "tbtc":
          transaction = await registerOperatorTbtc(app.operator)
          break
        case "randomBeacon":
          transaction = await registerOperatorRandomBeacon(app.operator)
          break
        case "taco":
          transaction = await registerOperatorTaco(account, app.operator)
          break
        default:
          throw new Error(`Unsupported app name: ${app.appName}`)
      }
      if (!transaction) {
        openModal(ModalType.TransactionFailed, {
          error: new Error(
            `Transaction rejected. You are required to map the Operator Address for ${app.appName}.`
          ),
          closeModal: () => {
            closeModal()
            dispatch(mapOperatorToStakingProviderModalClosed())
          },
        })
        return
      }
      transactions.push(transaction)
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
            {applications.filter((app) => app.operator).length +
              " transaction(s)"}
            . Each mapping is one transaction
          </BodyLg>
        </InfoBox>
        {applications.map((app, index) => (
          <OperatorMappingConfirmation
            key={index}
            appName={app.appName}
            operator={app.operator}
            stakingProvider={account ? account : AddressZero}
          />
        ))}
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
