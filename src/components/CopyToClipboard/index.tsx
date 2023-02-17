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
import ViewInBlockExplorer, {
  ViewInBlockExplorerProps,
} from "../ViewInBlockExplorer"
import { ExplorerDataType } from "../../utils/createEtherscanLink"

type CopyToClipboardProps = {
  textToCopy: string
  textCopiedMsg?: string
  helperText?: string
}

type CopyToClipboardContextValue = {
  hasCopied: boolean
  onCopy: () => void
  helperText: string
  textCopiedMsg: string
} & Omit<CopyToClipboardProps, "helperText" | "textCopiedMsg">

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
  const { hasCopied, textCopiedMsg, helperText, onCopy } =
    useCopyToClipboardContext()
  return (
    <Tooltip
      hasArrow
      label={hasCopied ? textCopiedMsg : helperText}
      closeOnClick={false}
    >
      <IconButton
        icon={<IoCopyOutline />}
        color="gray.500"
        onClick={onCopy}
        aria-label={helperText}
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
  helperText = "Copy to clipboard",
}) => {
  const { hasCopied, onCopy } = useClipboard(textToCopy)

  return (
    <CopyToClipboardContext.Provider
      value={{
        textToCopy,
        textCopiedMsg,
        helperText,
        hasCopied,
        onCopy,
      }}
    >
      {children}
    </CopyToClipboardContext.Provider>
  )
}

type CopyButtonPosition = "start" | "end"

type BaseCopyToClipboardProps = {
  copyButtonPosition?: CopyButtonPosition
} & CopyToClipboardProps

const BaseCopyToClipboard: FC<BaseCopyToClipboardProps> = ({
  children,
  copyButtonPosition = "start",
  ...restProps
}) => {
  return (
    <CopyToClipboard {...restProps}>
      <Flex alignItems="center">
        {copyButtonPosition === "start" && <CopyToClipboardButton />}
        {children}
        {copyButtonPosition === "end" && <CopyToClipboardButton />}
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
  withLinkToBlockExplorer?: boolean
} & Omit<BaseCopyToClipboardProps, "textToCopy"> &
  Pick<ViewInBlockExplorerProps, "chain">

export const CopyAddressToClipboard: FC<CopyAddressToClipboardProps> = ({
  address,
  textCopiedMsg,
  helperText,
  copyButtonPosition,
  chain,
  withFullAddress = false,
  withLinkToBlockExplorer = false,
  ...restProps
}) => {
  const addressColor = useColorModeValue("brand.500", "brand.100")
  const _address = withFullAddress ? address : shortenAddress(address)
  const mr = copyButtonPosition === "end" ? "2.5" : undefined
  const ml =
    !copyButtonPosition || copyButtonPosition === "start" ? "2.5" : undefined

  const blockExplorerProps = {
    as: ViewInBlockExplorer,
    text: _address,
    id: address,
    type: ExplorerDataType.ADDRESS,
    chain,
  }

  return (
    <BaseCopyToClipboard
      textToCopy={address}
      helperText={helperText}
      textCopiedMsg={textCopiedMsg}
      copyButtonPosition={copyButtonPosition}
    >
      <BodyMd
        {...(withLinkToBlockExplorer && blockExplorerProps)}
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
