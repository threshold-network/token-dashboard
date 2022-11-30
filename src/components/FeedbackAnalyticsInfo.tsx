import { FC } from "react"
import {
  HStack,
  Image,
  LabelSm,
  BodySm,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"
import sunglassesLight from "../static/images/SunglassesLight.png"
import sunglassesDark from "../static/images/SunglassesDark.png"
import diagonalPillLight from "../static/images/DiagonalPillLight.png"
import diagonalPillDark from "../static/images/DiagonalPillDark.png"
import diagonalArrowLight from "../static/images/DiagonalArrowLight.png"
import diagonalArrowDark from "../static/images/DiagonalArrowDark.png"

interface Props {
  imgSrc: any
  title: string
  subTitle: string
}

const FeedbackInfoItem: FC<Props> = ({ imgSrc, subTitle, title }) => {
  return (
    <HStack>
      <Image w="70px" src={imgSrc} mr={8} />
      <Stack>
        <LabelSm textTransform="uppercase">{title}</LabelSm>
        <BodySm color={useColorModeValue("gray.500", "gray.400")}>
          {subTitle}
        </BodySm>
      </Stack>
    </HStack>
  )
}

const FeedbackAnalyticsInfo = () => {
  const feedbackDetails = [
    {
      title: "Anonymous",
      subTitle: "We do not collect any personally identifiable information.",
      imgSrc: useColorModeValue(sunglassesLight, sunglassesDark),
    },
    {
      title: "Opt In analytics",
      subTitle: "We collect data only when you accept the analytics setting.",
      imgSrc: useColorModeValue(diagonalPillLight, diagonalPillDark),
    },
    {
      title: "usage metrics",
      subTitle: "Usage metrics (e.g. click rate) help to improve the product.",
      imgSrc: useColorModeValue(diagonalArrowLight, diagonalArrowDark),
    },
  ]

  return (
    <Stack spacing={8} m="auto" maxW="330px" mb={16}>
      {feedbackDetails.map((detail) => (
        <FeedbackInfoItem key={detail.title} {...detail} />
      ))}
    </Stack>
  )
}

export default FeedbackAnalyticsInfo
