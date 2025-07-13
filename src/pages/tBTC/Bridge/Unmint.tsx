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
  useColorModeValue,
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
import { BridgeProcessEmptyState } from "./components/BridgeProcessEmptyState"
import { useIsActive } from "../../../hooks/useIsActive"
import SubmitTxButton from "../../../components/SubmitTxButton"
import { isSupportedNetwork } from "../../../networks/utils"

const UnmintFormPage: PageComponent = ({}) => {
  const { balance } = useToken(Token.TBTCV2)
  const { chainId } = useIsActive()
  const { openModal } = useModal()
  const threshold = useThreshold()

  const onSubmitForm = (values: UnmintFormValues) => {
    openModal(ModalType.InitiateUnminting, {
      unmintAmount: values.amount,
      btcAddress: values.btcAddress,
    })
  }

  return !featureFlags.TBTC_V2_REDEMPTION || !isSupportedNetwork(chainId) ? (
    <UnmintingCard />
  ) : (
    <>
      <BridgeProcessCardTitle bridgeProcess="unmint" />
      <BridgeProcessCardSubTitle
        stepText="Step 1"
        subTitle="Unmint your tBTC tokens"
      />
      <BodyMd color="gray.500">
        Unminting requires one Ethereum transaction and it takes around 3-5
        hours.
      </BodyMd>
      <UnmintForm
        maxTokenAmount={balance.toString()}
        onSubmitForm={onSubmitForm}
        bitcoinNetwork={threshold.tbtc.bitcoinNetwork}
      />
      <Box as="p" textAlign="center" mt="4">
        <BridgeContractLink />
      </Box>
    </>
  )
}

const UnmintAsideLayout = () => {
  return (
    <BridgeLayoutAsideSection>
      <LabelSm>Duration</LabelSm>
      <HStack mt="4" spacing="4">
        <BoxLabel variant="solid" status="primary">
          ~ 3-5 Hours
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
            Your unwrapped and withdrawn BTC will be sent to the BTC address of
            your choice, in the next sweep.
          </StepDescription>
        </Step>
      </Steps>
      <BridgeProcessIndicator bridgeProcess="unmint" mt="8" />
    </BridgeLayoutAsideSection>
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
  const threshold = useThreshold()
  const supportedPrefixesText = getBridgeBTCSupportedAddressPrefixesText(
    "unmint",
    bitcoinNetwork
  )
  const { isSubmitting, getFieldMeta } = useFormikContext()
  const { error } = getFieldMeta("wallet")
  const errorColor = useColorModeValue("red.500", "red.300")

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
      {error && (
        <BodyMd color={errorColor} mt="10" mb="2">
          {error}
        </BodyMd>
      )}
      <SubmitTxButton
        size="lg"
        isFullWidth
        mt={error ? "0" : "10"}
        isDisabled={!threshold.tbtc.bridgeContract}
        type="submit"
        isLoading={isSubmitting}
      >
        Unmint
      </SubmitTxButton>
    </Form>
  )
}

type UnmintFormValues = {
  amount: string
  btcAddress: string
}

type UnmintFormProps = {
  onSubmitForm: (values: UnmintFormValues) => void
} & UnmintFormBaseProps

const UnmintForm = withFormik<UnmintFormProps, UnmintFormValues>({
  mapPropsToValues: () => ({
    amount: "",
    btcAddress: "",
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

    // @ts-ignore
    return getErrorsObj(errors)
  },
  handleSubmit: async (values, { props, setFieldError, setSubmitting }) => {
    try {
      setSubmitting(true)
      props.onSubmitForm({ ...values })
    } catch (error) {
      setFieldError("wallet", (error as Error).message)
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

export const UnmintPageLayout: PageComponent = ({}) => {
  const { isActive } = useIsActive()

  return (
    <BridgeLayout>
      <BridgeLayoutMainSection>
        {isActive ? (
          <Outlet />
        ) : (
          <BridgeProcessEmptyState
            title="Ready to unmint tBTC?"
            bridgeProcess="unmint"
          />
        )}
      </BridgeLayoutMainSection>
      <BridgeLayoutAsideSection>
        <UnmintAsideLayout />
      </BridgeLayoutAsideSection>
    </BridgeLayout>
  )
}

UnmintPageLayout.route = {
  path: "",
  index: false,
  isPageEnabled: true,
  pages: [UnmintFormPage],
}

export const UnmintPage: PageComponent = () => {
  return <Outlet />
}

UnmintPage.route = {
  path: "unmint",
  pathOverride: "unmint/*",
  index: true,
  title: "Unmint",
  pages: [UnmintPageLayout, UnmintDetails],
  isPageEnabled: true,
}
