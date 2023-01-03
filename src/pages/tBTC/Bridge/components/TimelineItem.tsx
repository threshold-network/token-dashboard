import { FC } from "react"
import {
  Box,
  Badge,
  Image,
  BodyXs,
  LabelSm,
  LabelXs,
} from "@threshold-network/components"

interface Props {
  stepText: string
  helperLabelText: string
  isActive: boolean
  isComplete: boolean
  title: string
  description: string
  imageSrc: any
}

const TimelineItem: FC<Props> = ({
  stepText,
  helperLabelText,
  isComplete,
  isActive,
  title,
  description,
  imageSrc,
}) => {
  return (
    <Box>
      {isActive && (
        <Badge mb={4} size="sm" variant="subtle">
          {helperLabelText}
        </Badge>
      )}
      <Box display="flex" mb={4}>
        <Box
          bg={isActive || isComplete ? "brand.500" : "gray.300"}
          w="4px"
          minH="100%"
        />
        <Box pl={4} w="full">
          <LabelXs mb={2} color="brand.500">
            {stepText}
          </LabelXs>
          <LabelSm>{title}</LabelSm>
          {isActive && <BodyXs mt={4}>{description}</BodyXs>}
          {isActive && <Image mt={4} src={imageSrc} />}
        </Box>
      </Box>
    </Box>
  )
}

export default TimelineItem
