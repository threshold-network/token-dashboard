import { FC, ComponentProps, useCallback } from "react"
import {
  BodyMd,
  Box,
  BoxLabel,
  Button,
  ChecklistGroup,
  HStack,
  Stack,
  Divider,
  useColorModeValue,
  Card,
  BodySm,
} from "@threshold-network/components"
import { BridgeProcessCardTitle } from "../components/BridgeProcessCardTitle"
import { BridgeProcessCardSubTitle } from "../components/BridgeProcessCardSubTitle"
import TooltipIcon from "../../../../components/TooltipIcon"
import {
  CopyAddressToClipboard,
  CopyToClipboard,
  CopyToClipboardButton,
} from "../../../../components/CopyToClipboard"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { QRCode } from "../../../../components/QRCode"
import withOnlyConnectedWallet from "../../../../components/withOnlyConnectedWallet"
import { ViewInBlockExplorerProps } from "../../../../components/ViewInBlockExplorer"
import { useEmbedFeatureFlag } from "../../../../hooks/useEmbedFeatureFlag"
import {
  useRequestBitcoinAccount,
  useSendBitcoinTransaction,
} from "../../../../hooks/ledger-live-app"
import { Form, FormikTokenBalanceInput } from "../../../../components/Forms"
import { InlineTokenBalance } from "../../../../components/TokenBalance"
import { tBTCFillBlack } from "../../../../static/icons/tBTCFillBlack"
import { FormikErrors, useFormikContext, withFormik } from "formik"
import { getErrorsObj, validateAmountInRange } from "../../../../utils/forms"
import { MINT_BITCOIN_MIN_AMOUNT } from "../../../../utils/tBTC"

const AddressRow: FC<
  { address: string; text: string } & Pick<ViewInBlockExplorerProps, "chain">
> = ({ address, text, chain }) => {
  return (
    <HStack justify="space-between">
      <BoxLabel>{text}</BoxLabel>
      <CopyAddressToClipboard
        address={address}
        copyButtonPosition="end"
        withLinkToBlockExplorer
        chain={chain}
      />
    </HStack>
  )
}

const BTCAddressCard: FC<ComponentProps<typeof Card>> = ({
  children,
  ...restProps
}) => {
  const bgColor = useColorModeValue("gray.50", "gray.900")
  return (
    <Card {...restProps} backgroundColor={bgColor} border="none">
      {children}
    </Card>
  )
}

const BTCAddressSection: FC<{ btcDepositAddress: string }> = ({
  btcDepositAddress,
}) => {
  const titleColor = useColorModeValue("gray.700", "gray.100")
  const btcAddressColor = useColorModeValue("brand.500", "white")

  return (
    <>
      <HStack
        alignItems="center"
        mb="3.5"
        // To center the tooltip icon. The tooltip icon is wrapped by `span`
        // because of: If you're wrapping an icon from `react-icons`, you need
        // to also wrap the icon in a `span` element as `react-icons` icons do
        // not use forwardRef. See
        // https://chakra-ui.com/docs/components/tooltip#with-an-icon.
        sx={{ ">span": { display: "flex" } }}
      >
        <BodyMd color={titleColor}>BTC Deposit Address</BodyMd>
        <TooltipIcon
          color={titleColor}
          label="This is a unique BTC address generated based on the ETH address and Recovery address you provided. Send your BTC funds to this address in order to mint tBTC."
        />
      </HStack>
      <BTCAddressCard p="2.5" display="flex" justifyContent="center">
        <Box
          p={2.5}
          backgroundColor={"white"}
          width={"100%"}
          maxW="205px"
          borderRadius="8px"
        >
          <QRCode
            size={256}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={btcDepositAddress}
            viewBox={`0 0 256 256`}
          />
        </Box>
      </BTCAddressCard>
      <CopyToClipboard textToCopy={btcDepositAddress}>
        <HStack mt="2.5">
          <BTCAddressCard minW="0" p="2">
            <BodyMd color={btcAddressColor} textStyle="chain-identifier">
              {btcDepositAddress}
            </BodyMd>
          </BTCAddressCard>
          <BTCAddressCard
            flex="1"
            p="4"
            display="flex"
            alignSelf="stretch"
            alignItems="center"
          >
            <CopyToClipboardButton />
          </BTCAddressCard>
        </HStack>
      </CopyToClipboard>
    </>
  )
}

const MakeDepositComponent: FC<{
  onPreviousStepClick: (previosuStep: MintingStep) => void
}> = ({ onPreviousStepClick }) => {
  const { btcDepositAddress, ethAddress, btcRecoveryAddress, updateState } =
    useTbtcState()

  const { isEmbed } = useEmbedFeatureFlag()
  const { requestAccount, account: ledgerBitcoinAccount } =
    useRequestBitcoinAccount()
  const { sendBitcoinTransaction } = useSendBitcoinTransaction()

  const chooseBitcoinAccount = useCallback(async () => {
    await requestAccount()
  }, [requestAccount])

  const handleSendBitcoinTransaction = useCallback(
    async (values: SendBitcoinsToDepositAddressFormValues) => {
      const { amount } = values
      try {
        await sendBitcoinTransaction(amount, btcDepositAddress)
      } catch (e) {
        console.error(e)
      }
    },
    [btcDepositAddress, sendBitcoinTransaction]
  )

  return (
    <>
      <BridgeProcessCardTitle
        previousStep={MintingStep.ProvideData}
        onPreviousStepClick={onPreviousStepClick}
      />
      <BridgeProcessCardSubTitle
        stepText="Step 2"
        subTitle="Make your BTC deposit"
      />
      <BodyMd color="gray.500" mb={6}>
        Use this generated address to send minimum 0.01&nbsp;BTC, to mint as
        tBTC.
      </BodyMd>
      <BodyMd color="gray.500" mb={6}>
        This address is a uniquely generated address based on the data you
        provided.
      </BodyMd>
      <BTCAddressSection btcDepositAddress={btcDepositAddress} />
      <Stack spacing={4} mt="5" mb={8}>
        <BodyMd>Provided Addresses Recap</BodyMd>
        <AddressRow text="ETH Address" address={ethAddress} />
        <AddressRow
          text="BTC Recovery Address"
          address={btcRecoveryAddress}
          chain="bitcoin"
        />
      </Stack>
      <Divider mt={4} mb={6} />
      <ChecklistGroup
        mb={6}
        checklistItems={[
          {
            itemId: "staking_deposit__0",
            itemTitle: "",
            itemSubTitle: (
              <BodyMd color={useColorModeValue("gray.500", "gray.300")}>
                Send the funds and come back to this dApp. You do not need to
                wait for the BTC transaction to be mined.
              </BodyMd>
            ),
          },
        ]}
      />
      {/* TODO: No need to use button here. We can replace it with just some text */}
      {isEmbed && !!ledgerBitcoinAccount?.address && (
        <AddressRow
          text="Bitcoin account"
          address={ledgerBitcoinAccount.address}
        />
      )}
      {isEmbed && (
        <Button
          isFullWidth
          onClick={() => {
            chooseBitcoinAccount()
          }}
          mb="2"
          variant={ledgerBitcoinAccount?.address ? "brand" : "solid"}
        >
          {ledgerBitcoinAccount
            ? "Change bitcoin account"
            : "Choose bitcoin account"}
        </Button>
      )}
      {isEmbed && ledgerBitcoinAccount && (
        <SendBitcoinsToDepositAddressForm
          maxTokenAmount={ledgerBitcoinAccount.balance.toString()}
          onSubmitForm={handleSendBitcoinTransaction}
        />
      )}
      {!isEmbed && (
        /* TODO: No need to use button here. We can replace it with just some text */
        <Button
          isLoading={true}
          loadingText={"Waiting for funds to be sent..."}
          form="tbtc-minting-data-form"
          isDisabled={true}
          isFullWidth
        >
          I sent the BTC
        </Button>
      )}
    </>
  )
}

/**
 * Formik for Ledger Live App where we can send bitcoins without leaving our
 * T dashboard. It should only be visible with `isEmbed` flag.
 */

type SendBitcoinsToDepositAddressFormBaseProps = {
  maxTokenAmount: string
}

const SendBitcoinsToDepositAddressFormBase: FC<
  SendBitcoinsToDepositAddressFormBaseProps
> = ({ maxTokenAmount }) => {
  const { isSubmitting } =
    useFormikContext<SendBitcoinsToDepositAddressFormValues>()

  return (
    <Form mt={10}>
      <FormikTokenBalanceInput
        name="amount"
        label={
          // TODO: Extract to a shared component - the same layout is used in
          // `UnmintFormBase` component.
          <>
            <Box as="span">Amount </Box>
            <BodySm as="span" float="right" color="gray.500">
              Balance:{" "}
              <InlineTokenBalance
                tokenAmount={maxTokenAmount}
                withSymbol
                tokenSymbol="BTC"
                tokenDecimals={8}
                precision={6}
                higherPrecision={8}
                withHigherPrecision
              />
            </BodySm>
          </>
        }
        placeholder="Amount of bitcoins you want to send to deposit address."
        max={maxTokenAmount}
        icon={tBTCFillBlack}
        tokenDecimals={8}
      />
      <Button
        size="lg"
        w="100%"
        mt={"10"}
        type="submit"
        isLoading={isSubmitting}
      >
        Send Bitcoins
      </Button>
    </Form>
  )
}

type SendBitcoinsToDepositAddressFormValues = {
  amount: string
}

type SendBitcoinsToDepositAddressFormProps = {
  onSubmitForm: (values: SendBitcoinsToDepositAddressFormValues) => void
} & SendBitcoinsToDepositAddressFormBaseProps

const SendBitcoinsToDepositAddressForm = withFormik<
  SendBitcoinsToDepositAddressFormProps,
  SendBitcoinsToDepositAddressFormValues
>({
  mapPropsToValues: () => ({
    amount: "",
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<SendBitcoinsToDepositAddressFormValues> = {}

    errors.amount = validateAmountInRange(
      values.amount,
      props.maxTokenAmount,
      MINT_BITCOIN_MIN_AMOUNT,
      undefined,
      8,
      8
    )

    return getErrorsObj(errors)
  },
  handleSubmit: (values, { props }) => {
    props.onSubmitForm(values)
  },
  displayName: "SendBitcoinsToDepositAddressForm",
  enableReinitialize: true,
})(SendBitcoinsToDepositAddressFormBase)

export const MakeDeposit = withOnlyConnectedWallet(MakeDepositComponent)
