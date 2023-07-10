import { FC } from "react"
import { Outlet } from "react-router-dom"
import { FormikErrors, useFormikContext, withFormik } from "formik"
import {
  BodyLg,
  BodyMd,
  BodySm,
  BodyXs,
  Box,
  BoxLabel,
  Button,
  HStack,
  LabelSm,
} from "@threshold-network/components"
import {
  Form,
  FormikInput,
  FormikTokenBalanceInput,
} from "../../../components/Forms"
import { InlineTokenBalance } from "../../../components/TokenBalance"
import {
  BridgeLayout,
  BridgeLayoutAsideSection,
  BridgeLayoutMainSection,
} from "./BridgeLayout"
import { BridgeProcessCardSubTitle } from "./components/BridgeProcessCardSubTitle"
import { BridgeProcessCardTitle } from "./components/BridgeProcessCardTitle"
import {
  BridgeContractLink,
  BridgeProcessIndicator,
  TBTCText,
} from "../../../components/tBTC"
import {
  Step,
  StepBadge,
  StepDescription,
  StepIndicator,
  Steps,
  StepTitle,
} from "../../../components/Step"
import { tBTCFillBlack } from "../../../static/icons/tBTCFillBlack"
import {
  getErrorsObj,
  validateAmountInRange,
  validateUnmintBTCAddress,
} from "../../../utils/forms"
import { PageComponent } from "../../../types"
import { useToken } from "../../../hooks/useToken"
import { ModalType, Token } from "../../../enums"
import { BitcoinNetwork } from "../../../threshold-ts/types"
import { useThreshold } from "../../../contexts/ThresholdContext"
import {
  getBridgeBTCSupportedAddressPrefixesText,
  UNMINT_MIN_AMOUNT,
} from "../../../utils/tBTC"
import { useModal } from "../../../hooks/useModal"
import { UnmintDetails } from "./UnmintDetails"
import { UnmintingCard } from "./UnmintingCard"
import { featureFlags } from "../../../constants"
import { RedemptionWalletData } from "../../../threshold-ts/tbtc"
import { UnspentTransactionOutputPlainObject } from "../../../types/tbtc"

const UnmintFormPage: PageComponent = ({}) => {
  const { balance } = useToken(Token.TBTCV2)
  const { openModal } = useModal()
  const threshold = useThreshold()

  const onSubmitForm = (values: UnmintFormValues) => {
    const { wallet } = values

    const walletData: {
      walletPublicKey: string
      mainUtxo: UnspentTransactionOutputPlainObject
    } = {
      ...wallet,
      mainUtxo: {
        ...wallet.mainUtxo,
        transactionHash:
          values.wallet.mainUtxo.transactionHash.toPrefixedString(),
        value: wallet.mainUtxo.value.toString(),
        outputIndex: wallet.mainUtxo.outputIndex.toString(),
      },
    }
    openModal(ModalType.InitiateUnminting, {
      unmintAmount: values.amount,
      btcAddress: values.btcAddress,
      wallet: walletData,
    })
  }

  return !featureFlags.TBTC_V2_REDEMPTION ? (
    <UnmintingCard />
  ) : (
    <BridgeLayout>
      <BridgeLayoutMainSection>
        <BridgeProcessCardTitle bridgeProcess="unmint" />
        <BridgeProcessCardSubTitle
          stepText="Step 1"
          subTitle="Unmint your tBTC tokens"
        />
        <BodyMd color="gray.500">
          Unminting requires one Ethereum transaction and it takes around 5
          hours.
        </BodyMd>
        <UnmintForm
          maxTokenAmount={balance.toString()}
          onSubmitForm={onSubmitForm}
          bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
          findRedemptionWallet={threshold.tbtc.findWalletForRedemption}
        />
        <Box as="p" textAlign="center" mt="4">
          <BridgeContractLink />
        </Box>
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        <LabelSm>Duration</LabelSm>
        <HStack mt="4" spacing="4">
          <BoxLabel variant="solid" status="primary">
            ~ 5 Hours
          </BoxLabel>
          <Box>
            <BodyXs as="span" color="gray.500">
              min.
            </BodyXs>{" "}
            <BodyLg as="span" color="gray.500">
              0.01
            </BodyLg>{" "}
            <BodyXs as="span" color="gray.500">
              BTC
            </BodyXs>
          </Box>
        </HStack>
        <LabelSm mt="8">Timeline</LabelSm>
        <Steps mt="6">
          <Step isActive={true} isComplete={false}>
            <StepIndicator>Step 1</StepIndicator>
            <StepBadge>action on Ethereum</StepBadge>
            <StepBadge>action on Bitcoin</StepBadge>
            <StepTitle>
              Unmint <TBTCText />
            </StepTitle>
            <StepDescription>
              Your unwrapped and withdrawn BTC will be sent to the BTC address
              of your choice, in the next sweep.
            </StepDescription>
          </Step>
        </Steps>

        <BridgeProcessIndicator bridgeProcess="unmint" mt="8" />
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

type UnmintFormBaseProps = {
  maxTokenAmount: string
  bitcoinNetwork: BitcoinNetwork
}

const UnmintFormBase: FC<UnmintFormBaseProps> = ({
  maxTokenAmount,
  bitcoinNetwork,
}) => {
  const supportedPrefixesText = getBridgeBTCSupportedAddressPrefixesText(
    "unmint",
    bitcoinNetwork
  )
  const { isSubmitting } = useFormikContext()

  return (
    <Form mt={10}>
      <FormikTokenBalanceInput
        name="amount"
        label={
          // TODO: Extract to a shared component- the same layout is used in
          // `TokenAmountForm` and `UnstakingFormLabel` components.
          <>
            <Box as="span">Amount </Box>
            <BodySm as="span" float="right" color="gray.500">
              Balance:{" "}
              <InlineTokenBalance
                tokenAmount={maxTokenAmount}
                withSymbol
                tokenSymbol="tBTC"
              />
            </BodySm>
          </>
        }
        placeholder="Amount you want to unmint"
        max={maxTokenAmount}
        icon={tBTCFillBlack}
      />
      <FormikInput
        name="btcAddress"
        label="BTC Address"
        tooltip={`This address needs to start with ${supportedPrefixesText}. This is where your BTC funds are sent.`}
        placeholder={`BTC Address should start with ${supportedPrefixesText}`}
        mt="6"
      />
      <Button size="lg" w="100%" mt="10" type="submit" isLoading={isSubmitting}>
        Unmint
      </Button>
    </Form>
  )
}

type UnmintFormValues = {
  amount: string
  btcAddress: string
  wallet: RedemptionWalletData
}

type UnmitnFormProps = {
  onSubmitForm: (values: UnmintFormValues) => void
  findRedemptionWallet: (
    amount: string,
    redeemerOutputScript: string
  ) => Promise<RedemptionWalletData>
} & UnmintFormBaseProps

const UnmintForm = withFormik<UnmitnFormProps, UnmintFormValues>({
  mapPropsToValues: () => ({
    amount: "",
    btcAddress: "",
    wallet: {} as RedemptionWalletData,
  }),
  validate: async (values, props) => {
    const errors: FormikErrors<UnmintFormValues> = {}

    errors.btcAddress = validateUnmintBTCAddress(
      values.btcAddress,
      props.bitcoinNetwork
    )
    errors.amount = validateAmountInRange(
      values.amount,
      props.maxTokenAmount,
      UNMINT_MIN_AMOUNT
    )
    errors.wallet = undefined

    // @ts-ignore
    return getErrorsObj(errors)
  },
  handleSubmit: async (
    values,
    { props, setFieldValue, setFieldError, setSubmitting }
  ) => {
    try {
      setSubmitting(true)

      const wallet = await props.findRedemptionWallet(
        values.amount,
        values.btcAddress
      )
      setFieldValue("wallet", wallet, false)

      props.onSubmitForm({ ...values, wallet })
    } catch (error) {
      setFieldError("amount", (error as Error).message)
    } finally {
      setSubmitting(false)
    }
  },
  displayName: "MintingProcessForm",
  enableReinitialize: true,
})(UnmintFormBase)

UnmintFormPage.route = {
  path: "",
  index: false,
  isPageEnabled: true,
}

export const UnmintPage: PageComponent = ({}) => {
  return <Outlet />
}

UnmintPage.route = {
  path: "unmint",
  pathOverride: "unmint/*",
  index: true,
  title: "Unmint",
  pages: [UnmintFormPage, UnmintDetails],
  isPageEnabled: true,
}
