import { FC, Fragment } from "react"
import {
  BodyMd,
  BodySm,
  HStack,
  List,
  ListItem,
} from "@threshold-network/components"
import withBaseModal from "../withBaseModal"
import { BaseModalProps } from "../../../types"
import { StakingAppName } from "../../../store/staking-applications"
import TransactionSuccessModal from "../TransactionSuccessModal"
import shortenAddress from "../../../utils/shortenAddress"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { camelCaseToNormal } from "../../../utils/text"

export type OperatorMappedSuccessTx = {
  application: {
    appName: StakingAppName
    operator: string
    stakingProvider: string
  }
  txHash: string
}

export type MapOperatorToStakingProviderSuccessProps = BaseModalProps & {
  transactions: OperatorMappedSuccessTx[]
}

const MapOperatorToStakingProviderSuccessBase: FC<
  MapOperatorToStakingProviderSuccessProps
> = ({ transactions, closeModal }) => {
  return (
    <TransactionSuccessModal
      subTitle="You successfully mapped your Operator Address."
      body={
        <>
          <List spacing="2" mb={"4rem"}>
            <ListItem key="map_operator_succes_modal__staking_provider">
              <HStack justify="space-between">
                <BodySm>Provider Address</BodySm>
                <BodySm>
                  {shortenAddress(transactions[0].application.stakingProvider)}
                </BodySm>
              </HStack>
            </ListItem>
            <ListItem key="map_operator_succes_modal__operator">
              <HStack justify="space-between">
                <BodySm>Operator Address</BodySm>
                <BodySm>
                  {shortenAddress(transactions[0].application.operator)}
                </BodySm>
              </HStack>
            </ListItem>
          </List>
          <BodySm align="center" mt={"1"}>
            {transactions.length === 1 ? (
              <>
                <ViewInBlockExplorer
                  text="View"
                  id={`map_operator_transaction_${transactions[0].txHash}`}
                  type={ExplorerDataType.TRANSACTION}
                />{" "}
                transaction on Etherscan
              </>
            ) : (
              <>
                View{" "}
                {transactions.map((_, index) => (
                  <Fragment key={_.txHash}>
                    <ViewInBlockExplorer
                      text={`transaction ${index + 1}`}
                      id={_.txHash}
                      type={ExplorerDataType.TRANSACTION}
                    />
                    {index + 1 === transactions.length ? " " : " and "}
                  </Fragment>
                ))}
                on Etherscan
              </>
            )}
          </BodySm>
        </>
      }
    />
  )
}

export const MapOperatorToStakingProviderSuccess = withBaseModal(
  MapOperatorToStakingProviderSuccessBase
)
