import { FC } from "react"
import {
  Alert,
  AlertIcon,
  Stack,
  Text,
  Link as ChakraLink,
} from "@chakra-ui/react"

type BridgeTxAlertProps = {
  tx: {
    hash: string
    route: "ccip" | "standard"
  }
}

const BridgeTxAlert: FC<BridgeTxAlertProps> = ({ tx }) => {
  const explorerUrl =
    tx.route === "ccip"
      ? `https://ccip.chain.link/tx/${tx.hash}`
      : `https://explorer.gobob.xyz/tx/${tx.hash}`

  const explorerLabel = tx.route === "ccip" ? "CCIP Explorer" : "BOB Explorer"

  return (
    <Alert status="success" borderRadius="md">
      <AlertIcon />
      <Stack spacing={1}>
        <Text fontWeight="medium">Transaction submitted successfully!</Text>
        <Text fontSize="sm">
          View on{" "}
          <ChakraLink href={explorerUrl} isExternal color="brand.500">
            {explorerLabel}
          </ChakraLink>
        </Text>
      </Stack>
    </Alert>
  )
}

export default BridgeTxAlert
