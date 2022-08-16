import { InfoIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertBox,
  AlertDescription,
  AlertIcon,
  Badge,
  BodyXs,
  BoxProps,
  Button,
  Card,
  Checkbox,
  FilterTabs,
  Grid,
  GridItem,
  H5,
  HStack,
  LabelSm,
  LineDivider,
  VStack,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
import { FC } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { TokenAmountForm } from "../../../components/Forms"
import { Token } from "../../../enums"
import { useMinStakeAmount } from "../../../hooks/useMinStakeAmount"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { RootState } from "../../../store"
import { PageComponent } from "../../../types"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { isSameETHAddress } from "../../../web3/utils"
import { AppAuthDataProps } from "../StakeCard"
import { StakeCardHeaderTitle } from "../StakeCard/HeaderTitle"

export interface ApplicationCardCheckboxProps extends BoxProps {
  appAuthData: AppAuthDataProps
}

const ApplicationCardCheckbox: FC<ApplicationCardCheckboxProps> = ({
  appAuthData,
  ...restProps
}) => {
  const tBalance = useTokenBalance(Token.T)
  const minStakeAmount = useMinStakeAmount()

  const collapsed = !appAuthData.isAuthRequired

  if (collapsed) {
    return (
      <Card {...restProps}>
        <VStack alignItems={"flex-start"} gridArea="app-info">
          <HStack>
            <LabelSm>{appAuthData.label} App - 100%</LabelSm>
            <InfoIcon />
            <Badge variant={"subtle"} colorScheme="gray" color={"gray.500"}>
              Authorization not required
            </Badge>
          </HStack>
          <HStack>
            <Badge
              variant={"solid"}
              borderRadius={5}
              px={2}
              py={2}
              backgroundColor={"brand.50"}
              color={"brand.700"}
              textTransform={"none"}
              fontSize="sm"
            >
              <HStack>
                <InfoIcon w={3} h={3} color={"brand.700"} />
                <BodyXs>APR &#183; 10%</BodyXs>
              </HStack>
            </Badge>
            <Badge
              variant={"solid"}
              borderRadius={5}
              px={2}
              py={2}
              backgroundColor={"brand.50"}
              color={"brand.700"}
              textTransform={"none"}
              fontSize="sm"
            >
              <HStack>
                <InfoIcon w={3} h={3} color={"brand.700"} />
                <BodyXs>
                  {"Shlashing "} &#183; {"<1%"}
                </BodyXs>
              </HStack>
            </Badge>
          </HStack>
        </VStack>
      </Card>
    )
  }

  return (
    <Card {...restProps}>
      <Grid
        gridTemplateAreas={{
          base: `
            "checkbox             checkbox"
            "app-info             app-info"
            "filter-tabs          filter-tabs"
            "token-amount-form    token-amount-form"
          `,
          sm: `
              "checkbox        app-info"
              "checkbox        filter-tabs"
              "checkbox        token-amount-form"
            `,
          md: `
              "checkbox        app-info           filter-tabs      "
              "checkbox        token-amount-form  token-amount-form"
              "checkbox        token-amount-form  token-amount-form"
            `,
        }}
        gridTemplateColumns={"1fr 8fr"}
        gap="3"
        p={0}
      >
        <Checkbox
          gridArea="checkbox"
          alignSelf={"flex-start"}
          justifySelf={"center"}
        />
        <VStack alignItems={"flex-start"} gridArea="app-info">
          <HStack>
            <LabelSm>{appAuthData.label} App - 100%</LabelSm>
            <InfoIcon />
          </HStack>
          <HStack>
            <Badge
              variant={"solid"}
              borderRadius={5}
              px={2}
              py={2}
              backgroundColor={"brand.50"}
              color={"brand.700"}
              textTransform={"none"}
              fontSize="sm"
            >
              <HStack>
                <InfoIcon w={3} h={3} color={"brand.700"} />
                <BodyXs>APR &#183; 10%</BodyXs>
              </HStack>
            </Badge>
            <Badge
              variant={"solid"}
              borderRadius={5}
              px={2}
              py={2}
              backgroundColor={"brand.50"}
              color={"brand.700"}
              textTransform={"none"}
              fontSize="sm"
            >
              <HStack>
                <InfoIcon w={3} h={3} color={"brand.700"} />
                <BodyXs>
                  {"Shlashing "} &#183; {"<1%"}
                </BodyXs>
              </HStack>
            </Badge>
          </HStack>
        </VStack>
        <FilterTabs
          gridArea="filter-tabs"
          variant="inline"
          alignItems="center"
          gap={0}
          tabs={[
            { title: "Increase", tabId: "1" },
            { title: "Decrease", tabId: "2" },
          ]}
        />
        <GridItem gridArea="token-amount-form" mt={5}>
          <TokenAmountForm
            onSubmitForm={() => {
              console.log("form submitted")
            }}
            label="Amount"
            submitButtonText={`Authorize ${appAuthData.label}`}
            maxTokenAmount={tBalance}
            placeholder={`Minimum stake ${
              minStakeAmount === "0"
                ? "loading..."
                : `${formatTokenAmount(minStakeAmount)} T`
            }`}
            minTokenAmount={minStakeAmount}
            helperText={`Minimum 40,000 T for ${appAuthData.label}`}
          />
        </GridItem>
      </Grid>
    </Card>
  )
}

const AuthorizeStakingAppsPage: PageComponent = (props) => {
  const { authorizerAddress } = useParams()
  const stakes = useSelector((state: RootState) => state.staking.stakes)
  const stake = stakes.find((stake) => {
    if (authorizerAddress) {
      return isSameETHAddress(stake.authorizer, authorizerAddress)
    }
  })

  const isInActiveStake = stake
    ? BigNumber.from(stake?.totalInTStake).isZero()
    : false

  // TODO: This will probably be fetched from contracts
  const appsAuthData = {
    tbtc: {
      label: "tBTC",
      isAuthorized: true,
      percentage: 40,
      isAuthRequired: true,
    },
    randomBeacon: {
      label: "Random Beacon",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: true,
    },
    pre: {
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: false,
    },
  }

  const onAuthorizeApps = () => {
    console.log("Authorize Apps!!")
  }

  return stake ? (
    <>
      <FilterTabs
        tabs={[
          { title: "Stake Overview", tabId: "1" },
          { title: "Authorize Application", tabId: "2" },
        ]}
        selectedTabId={"2"}
        mb={"5"}
        size={"lg"}
      ></FilterTabs>
      <Card>
        <HStack justify={"space-between"}>
          <H5>Authorize Applications</H5>
          <HStack>
            <Badge
              colorScheme={isInActiveStake ? "gray" : "green"}
              variant="subtle"
              size="small"
              mr="2"
            >
              {isInActiveStake ? "inactive" : "active"}
            </Badge>
            <StakeCardHeaderTitle stake={stake} />
          </HStack>
        </HStack>
        <LineDivider />
        <AlertBox status="magic" alignItems={"flex-start"}>
          <AlertDescription color={"gray.700"}>
            In order to earn rewards, please authorize Threshold apps to use
            your stake. Note that you can authorize 100% of your stake for all
            of the apps. You can change this amount at any time.
          </AlertDescription>
        </AlertBox>
        <ApplicationCardCheckbox mt={5} appAuthData={appsAuthData.tbtc} />
        <ApplicationCardCheckbox
          mt={5}
          appAuthData={appsAuthData.randomBeacon}
        />
        <ApplicationCardCheckbox mt={5} appAuthData={appsAuthData.pre} />
        <Button variant="outline" width="100%" mt={5} onClick={onAuthorizeApps}>
          Authorize selected apps
        </Button>
      </Card>
    </>
  ) : (
    <H5>Please connect your wallet</H5>
  )
}

AuthorizeStakingAppsPage.route = {
  path: "authorize/:authorizerAddress",
  index: false,
  title: "Authorize",
  hideFromMenu: true,
}

export default AuthorizeStakingAppsPage
