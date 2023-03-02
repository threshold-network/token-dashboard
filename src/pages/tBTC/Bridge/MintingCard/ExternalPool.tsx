import {
  BodySm,
  BodyXs,
  Card,
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
import { ComponentProps, FC } from "react"
import ButtonLink from "../../../../components/ButtonLink"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import TBTCCurvePool from "../../../../static/images/TBTCCurvePool.svg"
import TBTCWBTCSBTCPool from "../../../../static/images/TBTC_WBTC_SBTC_pool.svg"
import { formatNumeral } from "../../../../utils/formatAmount"
import { formatPercentage } from "../../../../utils/percentage"
import shortenAddress from "../../../../utils/shortenAddress"

export const ExternalPool: FC<ComponentProps<typeof Card>> = ({ ...props }) => {
  const { curveTBTCPool } = useTbtcState()

  return (
    <Card {...props}>
      <Stack>
        <HStack justifyContent={"space-between"} mb={4}>
          <HStack>
            <Image src={TBTCCurvePool} />
            <BodySm>TBTC Curve Pool</BodySm>
          </HStack>
          <ButtonLink
            isLoading={!curveTBTCPool}
            isExternal
            href={curveTBTCPool ? curveTBTCPool.url : ""}
          >
            Deposit in pool
          </ButtonLink>
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
    </Card>
  )
}
