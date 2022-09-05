import { FC } from "react"
import InfoBox from "../../../../components/InfoBox"
import { IoAlertCircle, MdCheckCircle } from "react-icons/all"
import { formatPercentage } from "../../../../utils/percentage"
import {
  Card,
  BodyMd,
  H5,
  LabelSm,
  Box,
  Grid,
  HStack,
  Stack,
  Image,
  BoxLabel,
} from "@threshold-network/components"
import { Icon } from "@chakra-ui/react"

interface Props {
  preTitle: string
  title: string
  description: string
  imgSrc: any
  ctaButtons: JSX.Element
  rewardSteps: string[]
  aprPercentage: number
  slashingPercentage: number
}

const ApplicationDetailsCard: FC<Props> = ({
  preTitle,
  title,
  description,
  imgSrc,
  ctaButtons,
  rewardSteps,
  aprPercentage,
  slashingPercentage,
}) => {
  return (
    <Card boxShadow="none">
      <LabelSm mb={6}>{preTitle}</LabelSm>
      <Grid
        gridAutoColumns="minmax(0, 3fr)"
        gridAutoFlow="column"
        gridTemplate={{
          base: `
            "providers"
            "pre-providers"
          `,
          xl: `"providers   providers   pre-providers"`,
        }}
        gridGap="8"
      >
        <Stack gridArea="providers" h="fit-content" spacing={6}>
          <H5>{title}</H5>
          <BodyMd>{description}</BodyMd>
          <InfoBox>
            <Image m="auto" maxH="180px" maxW="360px" w="100%" src={imgSrc} />
          </InfoBox>
        </Stack>

        <Box gridArea="pre-providers" h="fit-content" w="100%">
          {ctaButtons}
          <LabelSm mb={6}>How to earn rewards</LabelSm>
          <HStack mb={6}>
            <BoxLabel
              icon={<Icon as={IoAlertCircle} />}
              size="sm"
              status="primary"
              variant="solid"
            >
              APR &#183; {formatPercentage(aprPercentage, 0, true)}
            </BoxLabel>
            <BoxLabel
              icon={<Icon as={IoAlertCircle} />}
              size="sm"
              status="primary"
              variant="solid"
            >
              {"Slashing "} &#183;{" "}
              {`${formatPercentage(slashingPercentage, 0, true)}`}
            </BoxLabel>
          </HStack>
          <Stack mb={6}>
            {rewardSteps.map((step) => {
              return (
                <HStack key={step}>
                  <Icon boxSize="24px" as={MdCheckCircle} color="green.500" />
                  <BodyMd>{step}</BodyMd>
                </HStack>
              )
            })}
          </Stack>
        </Box>
      </Grid>
    </Card>
  )
}

export default ApplicationDetailsCard
