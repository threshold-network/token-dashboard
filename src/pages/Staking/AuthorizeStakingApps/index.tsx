import { InfoIcon } from "@chakra-ui/icons"
import {
  Alert,
  AlertBox,
  AlertDescription,
  AlertIcon,
  Badge,
  BodyXs,
  Card,
  Checkbox,
  FilterTabs,
  H5,
  HStack,
  LabelSm,
  LineDivider,
  VStack,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
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
import { StakeCardHeaderTitle } from "../StakeCard/HeaderTitle"

const CardCheckbox = ({ ...restProps }) => {
  const tBalance = useTokenBalance(Token.T)
  const minStakeAmount = useMinStakeAmount()

  return (
    <Card {...restProps}>
      <HStack alignItems={"flex-start"} justifyContent="space-between">
        <Checkbox />
        <VStack width="90%" alignItems={"stretch"}>
          <HStack justifyContent={"space-between"} mb={10}>
            <VStack alignItems={"flex-start"}>
              <LabelSm>TBTC App - 100%</LabelSm>
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
              variant="inline"
              tabs={[
                { title: "Increase", tabId: "1" },
                { title: "Decrease", tabId: "2" },
              ]}
            />
          </HStack>
          <TokenAmountForm
            onSubmitForm={() => {
              console.log("form submitted")
            }}
            label="Amount"
            submitButtonText="Authorize TBTC"
            maxTokenAmount={tBalance}
            placeholder={`Minimum stake ${
              minStakeAmount === "0"
                ? "loading..."
                : `${formatTokenAmount(minStakeAmount)} T`
            }`}
            minTokenAmount={minStakeAmount}
            helperText="Minimum 40,000 T for TBTC"
          />
        </VStack>
      </HStack>
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

  return stake ? (
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
      <AlertBox
        status="magic"
        alignItems={"flex-start"}
        backgroundColor="brand.100"
      >
        <AlertIcon color="brand.500" />

        <AlertDescription color={"gray.700"}>
          In order to earn rewards, please authorize Threshold apps to use your
          stake. Note that you can authorize 100% of your stake for all of the
          apps. You can change this amount at any time.
        </AlertDescription>
      </AlertBox>
      <CardCheckbox mt={5} />
    </Card>
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
