import { FC } from "react"
import {
  Box,
  Badge,
  HStack,
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
    <Box display="flex" mb={4} minW="216px">
      <Box
        bg={isActive || isComplete ? "brand.500" : "gray.300"}
        w="4px"
        minH="100%"
      />
      <Box pl={4} w="full">
        <HStack justifyContent="space-between" mb={2}>
          <LabelXs color="brand.500">{stepText}</LabelXs>
          {isActive && (
            <Badge fontSize="xs" variant="subtle" colorScheme="brand">
              {helperLabelText}
            </Badge>
          )}
        </HStack>
        <LabelSm>{title}</LabelSm>
        {isActive && <BodyXs mt={4}>{description}</BodyXs>}
        {isActive && <Image mt={4} src={imageSrc} />}
      </Box>
    </Box>
  )
}

export default TimelineItem
