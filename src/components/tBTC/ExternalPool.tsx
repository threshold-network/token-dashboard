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
import { formatNumeral } from "../../utils/formatAmount"
import { formatPercentage } from "../../utils/percentage"
import shortenAddress from "../../utils/shortenAddress"
import ButtonLink from "../ButtonLink"
import TBTCWBTCSBTCPool from "../../static/images/TBTC_WBTC_SBTC_pool.svg"
import TBTCCurvePool from "../../static/images/TBTCCurvePool.svg"
import { ExternalPoolData } from "../../types/tbtc"

export interface ExternalPoolProps extends ComponentProps<typeof Card> {
  title: string
  externalPoolData: ExternalPoolData
}

export const ExternalPool: FC<ExternalPoolProps> = ({
  title,
  externalPoolData,
  ...props
}) => {
  const {
    poolName,
    url: curvePoolUrl,
    apy,
    tvl,
    address: poolAddress,
  } = externalPoolData

  const commonCellProps = {
    borderBottom: "none",
  }

  return (
    <Card {...props}>
      <Stack>
        <HStack justifyContent={"space-between"} mb={4}>
          <HStack>
            <Image src={TBTCCurvePool} />
            <BodySm>{title}</BodySm>
          </HStack>
          <ButtonLink isLoading={!curvePoolUrl} isExternal href={curvePoolUrl}>
            Deposit in pool
          </ButtonLink>
        </HStack>
        <Skeleton isLoaded={!!curvePoolUrl}>
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
                  <Td {...commonCellProps}>
                    <HStack>
                      <Image src={TBTCWBTCSBTCPool} />{" "}
                      <BodyXs>{poolName}</BodyXs>
                    </HStack>
                  </Td>
                  <Td {...commonCellProps}>
                    {!!apy && apy.length == 2 && (
                      <BodyXs>{`${formatPercentage(
                        apy[0],
                        2,
                        false,
                        true
                      )} -> ${formatPercentage(
                        apy[1],
                        2,
                        false,
                        true
                      )} CRV`}</BodyXs>
                    )}
                  </Td>
                  <Td {...commonCellProps}>
                    {!!tvl && <BodyXs>${formatNumeral(tvl)}</BodyXs>}
                  </Td>
                  <Td {...commonCellProps} textAlign={"end"}>
                    {!!poolAddress && (
                      <BodyXs>{shortenAddress(poolAddress)}</BodyXs>
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
