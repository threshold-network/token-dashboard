import { FC, useMemo } from "react"
import { Box, HStack, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { BsArrowDownCircleFill } from "react-icons/all"
import { Body3, H5 } from "../Typography"
import Card from "../Card"
import { Divider, DividerIcon } from "../Divider"
import SubmitTxButton from "../SubmitTxButton"
import UpgradeIconGroup from "../UpgradeIconGroup"
import { useTConvertedAmount } from "../../hooks/useTConvertedAmount"
import { useTExchangeRate } from "../../hooks/useTExchangeRate"
import { UpgredableToken } from "../../types"
import { Token } from "../../enums"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "ethers"

export interface UpgradeCardTemplateProps {
  token: UpgredableToken
  amountToConvert: number | string
  onSubmit: () => void
  max: string | number
}

const UpgradeCardTemplate: FC<UpgradeCardTemplateProps> = ({
  token,
  children,
  amountToConvert,
  onSubmit,
  max,
}) => {
  const { formattedAmount } = useTConvertedAmount(token, amountToConvert)
  const { formattedAmount: exchangeRate } = useTExchangeRate(token)
  const { account } = useWeb3React()

  const titleText = useMemo(() => {
    switch (token) {
      case Token.Nu:
        return "NU to T Upgrade"
      case Token.Keep:
        return "KEEP to T Upgrade"
      default:
        return ""
    }
  }, [token])

  return (
    <Card maxW="720px">
      <Stack direction="row" justify="space-between">
        <H5>{titleText}</H5>
        <UpgradeIconGroup token={token} />
      </Stack>
      <Box mt={10}>
        <Box>{children}</Box>
        <Divider mt={9}>
          <DividerIcon
            left="30px"
            height="40px !important"
            width="40px !important"
            color="gray.600"
            as={BsArrowDownCircleFill}
          />
        </Divider>
        <HStack mt={9}>
          <Body3 fontWeight="bold">T Amount</Body3>
          <Body3 ml={4} color={useColorModeValue("gray.500", "gray.300")}>
            {`1 ${token} = ${exchangeRate} T`}
          </Body3>
        </HStack>
        <Text mt={2}>{amountToConvert === "" ? "--" : formattedAmount}</Text>
        <SubmitTxButton
          mt={10}
          onSubmit={onSubmit}
          disabled={
            !!account &&
            (amountToConvert == 0 ||
              amountToConvert == "" ||
              BigNumber.from(amountToConvert).gt(max))
          }
        />
      </Box>
    </Card>
  )
}

export default UpgradeCardTemplate
