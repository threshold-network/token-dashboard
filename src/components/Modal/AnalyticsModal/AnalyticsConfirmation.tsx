import { FC } from "react"
import {
  BodyLg,
  Button,
  BodySm,
  BodyXs,
  H5,
  Image,
  ModalBody,
  ModalFooter,
  Stack,
  VStack,
  useColorModeValue,
} from "@threshold-network/components"
import analyticsImageLight from "../../../static/images/AnalyticsIllustration.png"
import analyticsImageDark from "../../../static/images/AnalyticsIllustrationDark.png"
import sunglassesLight from "../../../static/images/SunglassesLight.png"
import diagonalPillLight from "../../../static/images/DiagonalPillLight.png"
import diagonalArrowLight from "../../../static/images/DiagonalArrowLight.png"
import FeedbackInfoItem from "./FeedbackInfoItem"
import Link from "../../Link"
import { ExternalHref } from "../../../enums"

const AnalyticsConfirmation: FC<{
  setStage: (stage: "CONFIRM" | "ACCEPT" | "REJECT") => void
}> = ({ setStage }) => {
  const imgSrc = useColorModeValue(analyticsImageLight, analyticsImageDark)

  const feedbackDetails = [
    {
      title: "Anonymous",
      subTitle: "We do not collect any personally identifiable information.",
      imgSrc: sunglassesLight,
    },
    {
      title: "Opt In analytics",
      subTitle: "We collect data only when you accept the analytics setting.",
      imgSrc: diagonalPillLight,
    },
    {
      title: "usage metrics",
      subTitle: "Usage metrics (e.g. click rate) help to improve the product.",
      imgSrc: diagonalArrowLight,
    },
  ]

  const subduedTextColor = useColorModeValue("gray.500", "gray.400")
  return (
    <>
      <ModalBody>
        <Image mx="auto" mb={8} maxW="104px" src={imgSrc} />
        <H5 mb={2}>
          Will you provide anonymous data to help improve the product?
        </H5>
        <BodyLg mb={10} color={subduedTextColor}>
          Change this at any time in Feedback Settings.
        </BodyLg>
        <Stack spacing={8} m="auto" maxW="330px" mb={16}>
          {feedbackDetails.map((detail) => (
            <FeedbackInfoItem {...detail} />
          ))}
        </Stack>
        <VStack mb={4}>
          <BodySm color={subduedTextColor}>
            All our analytics reports are publicly available{" "}
            <Link isExternal href={ExternalHref.analyticsReports}>
              here
            </Link>
          </BodySm>
          <BodyXs color={subduedTextColor}>
            By clicking Accept, you consent to allow a cookie to record this
            setting.
          </BodyXs>
        </VStack>
      </ModalBody>
      <ModalFooter>
        <Button onClick={() => setStage("REJECT")} variant="outline" mr={2}>
          Decline
        </Button>
        <Button onClick={() => setStage("ACCEPT")}>Accept</Button>
      </ModalFooter>
    </>
  )
}

export default AnalyticsConfirmation
