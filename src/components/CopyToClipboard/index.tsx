import { FC, ComponentProps, createContext, useContext } from "react"
import {
  useClipboard,
  Flex,
  IconButton,
  useColorModeValue,
  Tooltip,
  BodyMd,
} from "@threshold-network/components"
import { IoCopyOutline } from "react-icons/all"
import shortenAddress from "../../utils/shortenAddress"

type CopyToClipboardProps = {
  textToCopy: string
  textCopiedMsg?: string
  copyTextMsg?: string
}

type CopyToClipboardContextValue = {
  hasCopied: boolean
  onCopy: () => void
  copyTextMsg: string
  textCopiedMsg: string
} & Omit<CopyToClipboardProps, "copyTextMsg" | "textCopiedMsg">

const CopyToClipboardContext = createContext<
  CopyToClipboardContextValue | undefined
>(undefined)

const useCopyToClipboardContext = () => {
  const context = useContext(CopyToClipboardContext)

  if (!context) {
    throw new Error(
      "CopyToClipboardContext used outside of the CopyToClipboard component."
    )
  }

  return context
}

export const CopyToClipboardButton: FC = () => {
  const { hasCopied, textCopiedMsg, copyTextMsg, onCopy } =
    useCopyToClipboardContext()
  return (
    <Tooltip
      hasArrow
      label={hasCopied ? textCopiedMsg : copyTextMsg}
      closeOnClick={false}
    >
      <IconButton
        icon={<IoCopyOutline />}
        color="gray.500"
        onClick={onCopy}
        aria-label={copyTextMsg}
        variant="ghost"
        width="none"
        height="none"
        minW="unset"
        paddingInlineStart="unset"
        paddingInlineEnd="unset"
        p="0"
        _hover={{ background: "none" }}
      />
    </Tooltip>
  )
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({
  textToCopy,
  children,
  textCopiedMsg = "Copied!",
  copyTextMsg = "Copy to clipboard",
}) => {
  const { hasCopied, onCopy } = useClipboard(textToCopy)

  return (
    <CopyToClipboardContext.Provider
      value={{
        textToCopy,
        textCopiedMsg,
        copyTextMsg,
        hasCopied,
        onCopy,
      }}
    >
      {children}
    </CopyToClipboardContext.Provider>
  )
}

type CopyIconPosition = "start" | "end"

type BaseCopyToClipboardProps = {
  copyIconPosition?: CopyIconPosition
} & CopyToClipboardProps

const BaseCopyToClipboard: FC<BaseCopyToClipboardProps> = ({
  children,
  copyIconPosition = "start",
  ...restProps
}) => {
  return (
    <CopyToClipboard {...restProps}>
      <Flex alignItems="center">
        {copyIconPosition === "start" && <CopyToClipboardButton />}
        {children}
        {copyIconPosition === "end" && <CopyToClipboardButton />}
      </Flex>
    </CopyToClipboard>
  )
}

type CopyAddressToClipboardProps = Omit<
  ComponentProps<typeof BodyMd>,
  "children"
> & {
  address: string
  withFullAddress?: boolean
} & Omit<BaseCopyToClipboardProps, "textToCopy">

export const CopyAddressToClipboard: FC<CopyAddressToClipboardProps> = ({
  address,
  textCopiedMsg,
  copyTextMsg,
  copyIconPosition,
  withFullAddress = false,
  ...restProps
}) => {
  const addressColor = useColorModeValue("brand.500", "brand.100")
  const _address = withFullAddress ? address : shortenAddress(address)
  const mr = copyIconPosition === "end" ? "2.5" : undefined
  const ml =
    !copyIconPosition || copyIconPosition === "start" ? "2.5" : undefined

  return (
    <BaseCopyToClipboard
      textToCopy={address}
      copyTextMsg={copyTextMsg}
      textCopiedMsg={textCopiedMsg}
      copyIconPosition={copyIconPosition}
    >
      <BodyMd
        color={addressColor}
        mr={mr}
        ml={ml}
        textStyle="chain-identifier"
        {...restProps}
      >
        {_address}
      </BodyMd>
    </BaseCopyToClipboard>
  )
}
// Just to not break the current component API.
export default BaseCopyToClipboard
