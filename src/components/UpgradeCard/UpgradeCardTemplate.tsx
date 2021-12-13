import { FC, useMemo } from "react"
import { Box, HStack, Stack, Text } from "@chakra-ui/react"
import { Body3, H5 } from "../Typography"
import Card from "../Card"
import { Token } from "../../enums"
import { BsArrowDownCircleFill } from "react-icons/all"
import { Divider, DividerIcon } from "../Divider"
import SubmitTxButton from "../SubmitTxButton"
import UpgradeIconGroup from "../UpgradeIconGroup"
import { UpgredableToken } from "../../types"
import { useTConvertedAmount } from "../../hooks/useTConvertedAmount"
import { useTExchangeRate } from "../../hooks/useTExchangeRate"

export interface UpgradeCardTemplateProps {
  token: UpgredableToken
  amountToConvert: number | string
  onSubmit: () => void
}

const UpgradeCardTemplate: FC<UpgradeCardTemplateProps> = ({
  token,
  children,
  amountToConvert,
  onSubmit,
}) => {
  const { formattedAmount } = useTConvertedAmount(token, amountToConvert)
  const { formattedAmount: exchangeRate } = useTExchangeRate(token)

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
      <Box mt={6}>
        {children}
        <Divider>
          <DividerIcon color="gray.600" as={BsArrowDownCircleFill} />
        </Divider>
        <HStack>
          <Body3 fontWeight="bold">T Amount</Body3>
          <Body3 ml={4} color="gray.500">
            {`1 ${token} = ${exchangeRate} T`}
          </Body3>
        </HStack>
        <Text mt={2}>{amountToConvert === "" ? "--" : formattedAmount}</Text>
        <SubmitTxButton onSubmit={onSubmit} />
      </Box>
    </Card>
  )
}

export default UpgradeCardTemplate
