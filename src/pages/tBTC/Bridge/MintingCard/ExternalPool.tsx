import {
  BodySm,
  BodyXs,
  Button,
  HStack,
  Image,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@threshold-network/components"
import { FC } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import TBTCCurvePool from "../../../../static/images/TBTCCurvePool.svg"
import TBTCWBTCSBTCPool from "../../../../static/images/TBTC_WBTC_SBTC_pool.svg"
import { formatNumeral } from "../../../../utils/formatAmount"
import { formatPercentage } from "../../../../utils/percentage"
import shortenAddress from "../../../../utils/shortenAddress"

export const ExternalPool: FC = () => {
  const { curveTBTCPool } = useTbtcState()

  return (
    <Stack>
      <HStack justifyContent={"space-between"} mb={4}>
        <HStack>
          <Image src={TBTCCurvePool} />
          <BodySm>TBTC Curve Pool</BodySm>
        </HStack>
        <Button marginRight={"0 auto"}>Deposit in pool</Button>
      </HStack>
      <Skeleton isLoaded={!!curveTBTCPool && !!curveTBTCPool.url}>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Pool</Th>
                <Th>APY</Th>
                <Th>TVL</Th>
                <Th textAlign={"end"}>Contract</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>
                  <HStack>
                    <Image src={TBTCWBTCSBTCPool} />{" "}
                    <BodyXs>tBTC/WBTC/sBTC</BodyXs>
                  </HStack>
                </Td>
                <Td>
                  {!!curveTBTCPool &&
                    !!curveTBTCPool.apy &&
                    curveTBTCPool.apy.length == 2 && (
                      <BodyXs>{`${formatPercentage(
                        curveTBTCPool.apy[0],
                        2,
                        false,
                        true
                      )} -> ${formatPercentage(
                        curveTBTCPool.apy[1],
                        2,
                        false,
                        true
                      )} CRV`}</BodyXs>
                    )}
                </Td>
                <Td>
                  {!!curveTBTCPool && !!curveTBTCPool.tvl && (
                    <BodyXs>{formatNumeral(curveTBTCPool.tvl)}</BodyXs>
                  )}
                </Td>
                <Td textAlign={"end"}>
                  {!!curveTBTCPool && !!curveTBTCPool.address && (
                    <BodyXs>{shortenAddress(curveTBTCPool.address)}</BodyXs>
                  )}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Skeleton>
    </Stack>
  )
}
