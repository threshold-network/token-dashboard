import { FC } from "react"
import { Box, BodySm } from "@threshold-network/components"
import { TokenAmountFormBaseProps } from "../Forms/TokenAmountForm"
import { formatTokenAmount } from "../../utils/formatAmount"
import TooltipIcon from "../TooltipIcon"
import Link from "../Link"

type Props = Pick<
  TokenAmountFormBaseProps,
  "token" | "maxTokenAmount" | "label"
> & { stakingProvider: string; hasAuthorizedApps: boolean }

type TooltipLabelProps = Pick<Props, "stakingProvider">

const TooltipLabel: FC<TooltipLabelProps> = ({ stakingProvider }) => {
  return (
    <>
      If you want to unstake more T deauthorize the apps for this stake first{" "}
      <Link to={`/staking/${stakingProvider}/authorize`}>here</Link>.
    </>
  )
}

export const UnstakingFormLabel: FC<Props> = ({
  label = "Amount",
  maxTokenAmount,
  stakingProvider,
  hasAuthorizedApps,
  token = { decimals: 18, symbol: "T" },
}) => {
  return (
    <>
      <Box as="span">{label} </Box>
      <BodySm
        as="span"
        float="right"
        color="gray.500"
        display="flex"
        alignItems="center"
        sx={{ ">span": { display: "flex" } }}
      >
        {maxTokenAmount
          ? formatTokenAmount(maxTokenAmount, undefined, token.decimals)
          : "--"}{" "}
        {token.symbol}
        {hasAuthorizedApps && (
          <TooltipIcon
            ml="0.25em"
            width="1.25em"
            height="1.25em"
            label={<TooltipLabel stakingProvider={stakingProvider} />}
          />
        )}
      </BodySm>
    </>
  )
}
