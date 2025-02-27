import { FC } from "react"
import { LinkProps } from "@chakra-ui/react"
import Link from "./Link"
import { ExplorerDataType } from "../networks/enums/networks"
import { getMainnetOrTestnetChainId, isTestnetNetwork } from "../networks/utils"
import {
  createBlockExplorerLink,
  createExplorerLink,
} from "../networks/utils/createExplorerLink"
import { useIsActive } from "../hooks/useIsActive"

export type Chain = "bitcoin" | "ethereum"

export const createLinkToBlockExplorerForChain: Record<
  Chain,
  (
    id: string,
    type: ExplorerDataType,
    ethereumNetworkChainId?: string | number
  ) => string
> = {
  bitcoin: (id, type, ethereumNetworkChainId) => {
    const prefix = `https://blockstream.info${
      isTestnetNetwork(Number(ethereumNetworkChainId)) ? "/testnet" : ""
    }`

    return createBlockExplorerLink(prefix, id, type)
  },
  ethereum: (id, type, ethereumNetworkChainId) =>
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
  // Some networks, such as Arbitrum and Base, are only available
  // for specific actions, e.g., signing the L1BitcoinDepositor
  // contract. For those cases in particular, the connected chainId
  // should be passed as a prop as ethereumNetworkChainId.
  const { chainId } = useIsActive()
  const explorerChainId =
    ethereumNetworkChainId ?? getMainnetOrTestnetChainId(chainId)

  const link = createLinkToBlockExplorerForChain[chain](
    id,
    type,
    explorerChainId
  )

  return (
    <Link isExternal href={link} {...restProps}>
      {text}
    </Link>
  )
}

export default ViewInBlockExplorer
