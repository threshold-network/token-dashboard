import { FC, ComponentProps } from "react"
import {
  useClipboard,
  Flex,
  IconButton,
  useColorModeValue,
  Tooltip,
} from "@chakra-ui/react"
import { CopyIcon } from "@chakra-ui/icons"
import { Body2 } from "../Typography"
import shortenAddress from "../../utils/shortenAddress"

type CopyToClipboardProps = {
  textToCopy: string
  textCopiedMsg?: string
  copyTextMsg?: string
}

const CopyToClipboard: FC<CopyToClipboardProps> = ({
  textToCopy,
  children,
  textCopiedMsg = "Copied!",
  copyTextMsg = "Copy to clipboard",
}) => {
  const { hasCopied, onCopy } = useClipboard(textToCopy)

  return (
    <Flex alignItems="center">
      <Tooltip
        hasArrow
        label={hasCopied ? textCopiedMsg : copyTextMsg}
        closeOnClick={false}
      >
        <IconButton
          icon={<CopyIcon />}
          onClick={onCopy}
          aria-label={copyTextMsg}
          variant="ghost"
        />
      </Tooltip>
      {children}
    </Flex>
  )
}

type CopyAddressToClipboardProps = Omit<
  ComponentProps<typeof Body2>,
  "children"
> & {
  address: string
}

export const CopyAddressToClipboard: FC<CopyAddressToClipboardProps> = ({
  address,
  ...restProps
}) => {
  const addressColor = useColorModeValue("brand.500", "brand.550")
  return (
    <CopyToClipboard textToCopy={address}>
      <Body2 color={addressColor} {...restProps}>
        {shortenAddress(address)}
      </Body2>
    </CopyToClipboard>
  )
}

export default CopyToClipboard
