import { ComponentProps, FC } from "react"
import {
  BodySm,
  ListItem,
  Skeleton,
  useColorModeValue,
} from "@threshold-network/components"
import { InlineTokenBalance } from "../TokenBalance"

type TransactionDetailsItemProps = {
  label: string
  value?: string
}

export const TransactionDetailsItem: FC<TransactionDetailsItemProps> = ({
  label,
  value,
  children,
}) => {
  const valueTextColor = useColorModeValue("gray.700", "gray.300")

  return (
    <ListItem display="flex" justifyContent="space-between" alignItems="center">
      <BodySm color="gray.500">{label}</BodySm>
      {value ? <BodySm color={valueTextColor}>{value}</BodySm> : children}
    </ListItem>
  )
}

type TransactionDetailsAmountItemProps = Omit<
  ComponentProps<typeof InlineTokenBalance>,
  "tokenAmount"
> &
  Pick<TransactionDetailsItemProps, "label"> & {
    amount?: string
    suffixItem?: string
    isFetching?: boolean
  }

export const TransactionDetailsAmountItem: FC<
  TransactionDetailsAmountItemProps
> = ({ label, amount, suffixItem, isFetching = false, ...restProps }) => {
  const textColor = useColorModeValue("gray.700", "gray.300")

  return (
    <TransactionDetailsItem label={label}>
      <Skeleton isLoaded={!isFetching && !!amount}>
        <BodySm color={textColor}>
          <InlineTokenBalance
            withSymbol
            tokenAmount={amount || "0"}
            tokenSymbol={suffixItem || ""}
            {...restProps}
          />
        </BodySm>
      </Skeleton>
    </TransactionDetailsItem>
  )
}
