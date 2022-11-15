import { FC } from "react"
import {
  HStack,
  Image,
  LabelSm,
  BodySm,
  Stack,
  useColorModeValue,
} from "@threshold-network/components"

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

export default FeedbackInfoItem
