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
  } & LinkProps
> = ({ id, type, text = "View in Block Explorer", ...restProps }) => {
  const etherscanLink = createEtherscanLink(
    Number(supportedChainId),
    id || "",
    type
  )

  return (
    <ExternalLink isExternal href={etherscanLink} text={text} {...restProps} />
  )
}

export default ViewInBlockExplorer
