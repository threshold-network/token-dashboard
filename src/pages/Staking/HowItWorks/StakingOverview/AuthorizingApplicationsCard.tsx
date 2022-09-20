import { ComponentProps, FC } from "react"
import {
  BodyMd,
  BoxLabel,
  Card,
  FlowStep,
  FlowStepStatus,
  LabelSm,
  Image,
} from "@threshold-network/components"
import { Stack, useColorMode } from "@chakra-ui/react"
import AuthorizingApplicationsIllustrationLight from "../../../../static/images/AuthorizingApplicationsIllustrationLight.png"
import AuthorizingApplicationsIllustrationDark from "../../../../static/images/AuthorizingApplicationsIllustrationDark.png"
import InternalLink from "../../../../components/InternalLink"

export const AuthorizingApplicationsCard: FC<ComponentProps<typeof Card>> = (
  props
) => {
  const { colorMode } = useColorMode()

  return (
    <Card {...props} h="fit-content">
      <LabelSm>Authorizing Applications</LabelSm>
      <BodyMd my={6}>
        In order to earn rewards, you can authorize Threshold applications to
        use your stake. You can read more about the applications{" "}
        <InternalLink to="/staking/how-it-works/applications">
          here
        </InternalLink>
        . Note that you can authorize 100% of your stake for all of the apps.
      </BodyMd>
      <Image
        maxW="370px"
        mx="auto"
        my={8}
        src={
          colorMode === "dark"
            ? AuthorizingApplicationsIllustrationDark
            : AuthorizingApplicationsIllustrationLight
        }
      />
      <BodyMd>
        If you want to decrease your authorization, refer to the timeline below
        for deauthorization of some or all of your stake from an application.
      </BodyMd>
      <BoxLabel status="secondary" my={6}>
        Deauthorization Timeline
      </BoxLabel>
      <Stack spacing={6}>
        <FlowStep
          status={FlowStepStatus.active}
          preTitle="Step 1"
          title="Initiate Deauthorization"
          size="sm"
          margin="0 !important"
        >
          This is 1 transaction
        </FlowStep>
        <FlowStep
          status={FlowStepStatus.active}
          preTitle="Step 2"
          title="14 day cooldown"
          size="sm"
        >
          You must wait a 14 day cooldown to then confirm the deauthorization.
          This is 1 transaction.
        </FlowStep>
      </Stack>
    </Card>
  )
}
