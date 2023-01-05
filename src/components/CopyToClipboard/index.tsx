import { FC, ComponentProps } from "react"
import {
  useClipboard,
  Flex,
  IconButton,
  useColorModeValue,
  Tooltip,
  BodyMd,
} from "@threshold-network/components"
import { CopyIcon } from "@chakra-ui/icons"
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
          color="gray.500"
          onClick={onCopy}
          aria-label={copyTextMsg}
          variant="ghost"
          width="none"
          height="none"
          minW="unset"
          paddingInlineStart="unset"
          paddingInlineEnd="unset"
          p="2"
        />
      </Tooltip>
      {children}
    </Flex>
  )
}

type CopyAddressToClipboardProps = Omit<
  ComponentProps<typeof BodyMd>,
  "children"
> & {
  address: string
}

export const CopyAddressToClipboard: FC<CopyAddressToClipboardProps> = ({
  address,
  ...restProps
}) => {
  const addressColor = useColorModeValue("brand.500", "brand.100")
  return (
    <CopyToClipboard textToCopy={address}>
      <BodyMd color={addressColor} {...restProps}>
        {shortenAddress(address)}
      </BodyMd>
    </CopyToClipboard>
  )
}

export default CopyToClipboard
