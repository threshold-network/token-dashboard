import { FC } from "react"
import { LinkProps } from "@chakra-ui/react"
import ExternalLink from "./ExternalLink"
import createEtherscanLink, {
  ExplorerDataType,
} from "../utils/createEtherscanLink"
import { supportedChainId } from "../utils/getEnvVariable"

const ViewInBlockExplorer: FC<
  {
    id: string
    type: ExplorerDataType
    text: string
  } & Omit<LinkProps, "isExternal">
> = ({ id, type, text = "View in Block Explorer", ...restProps }) => {
  const etherscanLink = createEtherscanLink(
    Number(supportedChainId),
    id || "",
    type
  )

  return (
    <ExternalLink isExternal={true} href={etherscanLink} {...restProps}>
      {text}
    </ExternalLink>
  )
}

export default ViewInBlockExplorer
