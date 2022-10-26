import { FC } from "react"
import { LinkProps } from "@chakra-ui/react"
import Link from "./Link"
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
    <Link isExternal href={etherscanLink} {...restProps}>
      {text}
    </Link>
  )
}

export default ViewInBlockExplorer
