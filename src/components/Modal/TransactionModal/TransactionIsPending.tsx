import { FC } from "react"
import {
  ModalBody,
  ModalFooter,
  ModalHeader,
  Spinner,
  BodyLg,
  BodySm,
  VStack,
} from "@threshold-network/components"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import { ExplorerDataType } from "../../../networks/enums/networks"
import { useWeb3React } from "@web3-react/core"
import { useNonEVMConnection } from "../../../hooks/useNonEVMConnection"

interface Props {
  transactionHash: string
}

const TransactionIsPending: FC<Props> = ({ transactionHash }) => {
  const { chainId } = useWeb3React()
  const { isNonEVMActive } = useNonEVMConnection()

  return (
    <>
      <ModalHeader>Transaction is pending</ModalHeader>
      <ModalBody>
        <VStack spacing={8}>
          <Spinner
            size="xl"
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="brand.500"
          />
          <BodyLg>
            Please wait a moment for your transaction to be confirmed.
          </BodyLg>
        </VStack>
      </ModalBody>
      {!isNonEVMActive && (
        <ModalFooter justifyContent="center">
          <BodySm>
            <ViewInBlockExplorer
              text="View"
              id={transactionHash}
              type={ExplorerDataType.TRANSACTION}
              ethereumNetworkChainId={chainId}
            />{" "}
            transaction on Etherscan
          </BodySm>
        </ModalFooter>
      )}
    </>
  )
}

export default TransactionIsPending
