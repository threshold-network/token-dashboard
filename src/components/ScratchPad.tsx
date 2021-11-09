import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Skeleton,
} from "@chakra-ui/react"
import { useReduxToken } from "../hooks/useReduxToken"
import { useKeep } from "../web3/hooks/useKeep"
import { useNu } from "../web3/hooks/useNu"

export const ScratchPad = ({}) => {
  const { keep, nu } = useReduxToken()
  const { fetchBalance: fetchKeepBalance } = useKeep()
  const { fetchBalance: fetchNuBalance } = useNu()

  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Token</Th>
          <Th>Balance</Th>
          <Th>USD conversion</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Keep</Td>
          <Td>
            <Skeleton isLoaded={!keep.loading}>
              {keep.balance} ({keep.usdBalance})
            </Skeleton>
          </Td>
          <Td>{keep.usdConversion}</Td>
          <Td>
            <Button onClick={fetchKeepBalance}>Fetch</Button>
          </Td>
        </Tr>
        <Tr>
          <Td>Nu</Td>
          <Td>
            <Skeleton isLoaded={!nu.loading}>
              {nu.balance} ({nu.usdBalance})
            </Skeleton>
          </Td>
          <Td>{nu.usdConversion}</Td>
          <Td>
            <Button onClick={fetchNuBalance}>Fetch</Button>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
