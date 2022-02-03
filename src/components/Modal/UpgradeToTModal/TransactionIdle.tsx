import { FC } from "react"
import {
  Button,
  HStack,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  useColorModeValue,
} from "@chakra-ui/react"
import { Body1, Body3, H5 } from "../../Typography"
import UpgradeIconGroup from "../../UpgradeIconGroup"
import UpgradeStats from "./UpgradeStats"
import { Divider } from "../../Divider"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { useTConvertedAmount } from "../../../hooks/useTConvertedAmount"
import { useTExchangeRate } from "../../../hooks/useTExchangeRate"
import { useVendingMachineContract } from "../../../web3/hooks/useVendingMachineContract"
import { useUpgradeToT } from "../../../web3/hooks/useUpgradeToT"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import withBaseModal from "../withBaseModal"
import { BaseModalProps, UpgredableToken } from "../../../types"
import InfoBox from "../../InfoBox"

interface TransactionIdleProps extends BaseModalProps {
  upgradedAmount: string
  token: UpgredableToken
}

const TransactionIdle: FC<TransactionIdleProps> = ({
  upgradedAmount,
  token,
  closeModal,
}) => {
  const { amount: receivedAmount } = useTConvertedAmount(token, upgradedAmount)
  const { formattedAmount: exchangeRate } = useTExchangeRate(token)
  const contract = useVendingMachineContract(token)
  const { upgradeToT } = useUpgradeToT(token)

  return (
    <>
      <ModalHeader>Upgrade Tokens</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>You are about to upgrade {token} to T.</H5>
          <Body1 mt="1rem">
            The upgrade uses an ApproveAndCall function which requires one
            confirmation transaction
          </Body1>
        </InfoBox>
        <HStack justifyContent="center" my={6}>
          <UpgradeIconGroup token={token} boxSize="48px" />
        </HStack>
        <Divider />
        <UpgradeStats
          token={token}
          exchangeRate={exchangeRate}
          receivedAmount={receivedAmount}
          upgradedAmount={upgradedAmount}
        />
        <Body3
          align="center"
          color={useColorModeValue("gray.500", "gray.300")}
          mt="2rem"
        >
          This action is reversible via the{" "}
          <ViewInBlockExplorer
            id={contract!.address}
            type={ExplorerDataType.ADDRESS}
            text="vending machine contract."
          />
        </Body3>
        <Divider />
      </ModalBody>

      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr="0.75rem">
          Cancel
        </Button>
        <Button
          onClick={async () => {
            await upgradeToT(upgradedAmount)
          }}
        >
          Upgrade
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(TransactionIdle)
