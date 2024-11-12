import { FC } from "react"
import { LinkProps } from "@chakra-ui/react"
import Link from "./Link"
import { ExplorerDataType } from "../networks/enums/networks"
import { isTestnetNetwork } from "../networks/utils"
import {
  createBlockExplorerLink,
  createExplorerLink,
} from "../networks/utils/createExplorerLink"

export type Chain = "bitcoin" | "ethereum"

export const createLinkToBlockExplorerForChain: Record<
  Chain,
  (
    id: string,
    type: ExplorerDataType,
    ethereumNetworkChainId?: string | number
  ) => string
> = {
  bitcoin: (id, type, ethereumNetworkChainId = 1) => {
    const prefix = `https://blockstream.info${
      isTestnetNetwork(Number(ethereumNetworkChainId)) ? "/testnet" : ""
    }`

    return createBlockExplorerLink(prefix, id, type)
  },
  ethereum: (id, type, ethereumNetworkChainId = 1) =>
    createExplorerLink(Number(ethereumNetworkChainId), id, type),
}

type ConditionalProps =
  | {
      chain?: Extract<Chain, "bitcoin">
      type: Exclude<ExplorerDataType, ExplorerDataType.TOKEN>
      ethereumNetworkChainId?: string | number | never
    }
  | {
      chain?: Extract<Chain, "ethereum"> | never
      type: ExplorerDataType
      ethereumNetworkChainId?: string | number | never
    }

type CommonProps = {
  id: string
  text: string
}

export type ViewInBlockExplorerProps = ConditionalProps &
  CommonProps &
  Omit<LinkProps, "isExternal">

const ViewInBlockExplorer: FC<ViewInBlockExplorerProps> = ({
  id,
  type,
  text = "View in Block Explorer",
  chain = "ethereum",
  ethereumNetworkChainId,
  ...restProps
}) => {
  const link = createLinkToBlockExplorerForChain[chain](
    id,
    type,
    ethereumNetworkChainId
  )

  return (
    <Link isExternal href={link} {...restProps}>
      {text}
    </Link>
  )
}

export default ViewInBlockExplorer
