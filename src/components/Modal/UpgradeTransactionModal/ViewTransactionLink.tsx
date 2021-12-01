import { Transaction } from "ethers"
import { HStack, Link, Text } from "@chakra-ui/react"
import { FC } from "react"
import createEtherscanLink, {
  ExplorerDataType,
} from "../../../utils/createEtherscanLink"

const ViewTransactionLink: FC<{ transactionId: string }> = ({
  transactionId,
}) => {
  const etherscanLink = createEtherscanLink(
    // TO DO: This should be pulled from the ENV once PR #30 is approved & merged
    1,
    transactionId || "",
    ExplorerDataType.TRANSACTION
  )

  return (
    <HStack justify="center">
      <Text>
        <Link
          textDecoration="underline"
          color="brand.500"
          href={etherscanLink}
          _hover={{
            fontWeight: "bold",
          }}
        >
          View
        </Link>{" "}
        transaction on Etherscan
      </Text>
    </HStack>
  )
}

export default ViewTransactionLink
