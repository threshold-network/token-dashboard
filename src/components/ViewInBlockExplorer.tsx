import { FC } from "react"
import { Link, LinkProps } from "@chakra-ui/react"
import createEtherscanLink, {
  ExplorerDataType,
} from "../utils/createEtherscanLink"

const ViewInBlockExplorer: FC<
  {
    id: string
    type: ExplorerDataType
    text: string
  } & LinkProps
> = ({ id, type, text = "View in Block Explorer", ...restProps }) => {
  const etherscanLink = createEtherscanLink(
    // TO DO: This should be pulled from the ENV once PR #30 is approved & merged
    1,
    id || "",
    type
  )

  return (
    <Link
      textDecoration="underline"
      color="brand.500"
      href={etherscanLink}
      _hover={{
        fontWeight: "bold",
      }}
      {...restProps}
    >
      {text}
    </Link>
  )
}

export default ViewInBlockExplorer
