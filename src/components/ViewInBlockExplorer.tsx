import { FC } from "react"
import { LinkProps } from "@chakra-ui/react"
import Link from "./Link"
import createEtherscanLink, {
  createBlockExplorerLink,
  ExplorerDataType,
} from "../utils/createEtherscanLink"
import { supportedChainId } from "../utils/getEnvVariable"

type Chain = "bitcoin" | "ethereum"

const createLinkToBlockExplorerForChain: Record<
  Chain,
  (id: string, type: ExplorerDataType) => string
> = {
  bitcoin: (id, type) => {
    const prefix = `https://blockstream.info${
      Number(supportedChainId) !== 1 ? "/testnet" : ""
    }`

    return createBlockExplorerLink(prefix, id, type)
  },
  ethereum: (id, type) =>
    createEtherscanLink(Number(supportedChainId), id, type),
}

type ConditionalProps =
  | {
      chain?: Extract<Chain, "bitcoin">
      type: Exclude<ExplorerDataType, ExplorerDataType.TOKEN>
    }
  | {
      chain?: Extract<Chain, "ethereum"> | never
      type: ExplorerDataType
    }

type CommonProps = {
  id: string
  text: string
}

export type Props = ConditionalProps &
  CommonProps &
  Omit<LinkProps, "isExternal">

const ViewInBlockExplorer: FC<Props> = ({
  id,
  type,
  text = "View in Block Explorer",
  chain = "ethereum",
  ...restProps
}) => {
  const link = createLinkToBlockExplorerForChain[chain](id, type)

  return (
    <Link isExternal href={link} {...restProps}>
      {text}
    </Link>
  )
}

export default ViewInBlockExplorer
