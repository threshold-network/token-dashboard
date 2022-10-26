import { FC } from "react"
import { MdCheckCircle } from "react-icons/all"
import {
  BodyMd,
  Box,
  Card,
  H5,
  HStack,
  Icon,
  Image,
  LabelSm,
  Stack,
  useColorModeValue,
  List,
  ListItem,
  Grid,
} from "@threshold-network/components"
import InfoBox from "../../../../components/InfoBox"

interface Props {
  preTitle: string
  title: string
  description: string
  imgSrc: any
  ctaButtons: JSX.Element
  rewardSteps: string[]
}

const ApplicationDetailsCard: FC<Props> = ({
  preTitle,
  title,
  description,
  imgSrc,
  ctaButtons,
  rewardSteps,
}) => {
  const infoBoxBg = useColorModeValue("gray.50", "blackAlpha.300")

  return (
    <Card boxShadow="none" as="section">
      <LabelSm mb={6}>{preTitle}</LabelSm>
      <Grid
        gridAutoColumns="minmax(0, 1fr)"
        gridAutoFlow="column"
        gridTemplate={{
          base: `
          "app-details"
          "cta-buttons"
        `,
          xl: `
            "app-details    app-details    cta-buttons"
          `,
        }}
        gridGap="8"
      >
        <Stack spacing={6} gridArea="app-details">
          <H5>{title}</H5>
          <BodyMd>{description}</BodyMd>
          <InfoBox bg={infoBoxBg}>
            <Image m="auto" maxH="180px" maxW="360px" w="100%" src={imgSrc} />
          </InfoBox>
        </Stack>
        <Box gridArea="cta-buttons">
          {ctaButtons}
          <LabelSm mb={6}>How to earn rewards</LabelSm>
          <List mb={6} as={Stack} spacing={2}>
            {rewardSteps.map((step) => {
              return (
                <ListItem key={step} as={HStack} spacing={2}>
                  <Icon boxSize="24px" as={MdCheckCircle} color="green.500" />
                  <BodyMd>{step}</BodyMd>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </Grid>
    </Card>
  )
}

export default ApplicationDetailsCard
